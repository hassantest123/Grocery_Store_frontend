import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import productApi from "../../Model/Data/Product/Product";
import categoryApi from "../../Model/Data/Category/Category";
import orderApi from "../../Model/Data/Order/Order";
import uploadApi from "../../Model/Data/Upload/Upload";
import commentApi from "../../Model/Data/Comment/Comment";
import userApi from "../../Model/Data/User/User";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'orders', 'customerOrders', or 'customerFeedback'
  
  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    image: "", // Backward compatibility
    imageFile: null, // For file upload
    main_image: "",
    main_imageFile: null,
    category: "",
    category_id: "",
    label: "",
    stock_quantity: "",
    unit: "1kg",
    additional_items: [],
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: "",
    imageFile: null, // For file upload
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [customerOrdersSummary, setCustomerOrdersSummary] = useState([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [createOrderForm, setCreateOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    productId: '',
    quantity: 1,
    paymentMethod: 'cod',
  });
  const [productsList, setProductsList] = useState([]);
  const [productsListLoading, setProductsListLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [usersListLoading, setUsersListLoading] = useState(false);
  const [customerSelectionMode, setCustomerSelectionMode] = useState('select'); // 'select' or 'manual'
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Payment proof modal state
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState(null);

  // Order details modal state
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // Track which order's action menu is open

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuOpen && !event.target.closest('.action-menu-container')) {
        setActionMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenuOpen]);

  // Define fetchProducts before useEffect
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productApi.getAllProducts({
        page: currentPage,
        limit: 10,
        search: searchTerm || null,
      });

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        setProducts(response.data.DB_DATA.products || []);
        setTotalPages(response.data.DB_DATA.pagination?.total_pages || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to fetch products',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Define fetchCategories before useEffect
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.getAllCategories({ is_active: 1 });
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        setCategories(response.data.DB_DATA || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  // Aggregate orders by user
  const aggregateOrdersByUser = useCallback((ordersData) => {
    const userOrderMap = {};
    
    ordersData.forEach(order => {
      let userId = null;
      let userName = 'N/A';
      let userEmail = 'N/A';
      
      // Get user ID and name from order
      if (order.user_id) {
        if (typeof order.user_id === 'object' && order.user_id._id) {
          userId = order.user_id._id.toString();
          userName = order.user_id.name || order.shipping_address?.name || 'N/A';
          userEmail = order.user_id.email || order.shipping_address?.email || 'N/A';
        } else if (typeof order.user_id === 'string') {
          userId = order.user_id;
          userName = order.shipping_address?.name || 'N/A';
          userEmail = order.shipping_address?.email || 'N/A';
        }
      }
      
      // If no user_id, try to get from shipping_address
      if (!userId && order.shipping_address) {
        userId = order.shipping_address.email || 'guest';
        userName = order.shipping_address.name || 'Guest User';
        userEmail = order.shipping_address.email || 'N/A';
      }
      
      if (userId) {
        if (!userOrderMap[userId]) {
          userOrderMap[userId] = {
            userId: userId,
            userName: userName,
            email: userEmail,
            orderCount: 0,
          };
        }
        userOrderMap[userId].orderCount += 1;
      }
    });
    
    // Convert to array and sort by order count (descending)
    return Object.values(userOrderMap).sort((a, b) => b.orderCount - a.orderCount);
  }, []);

  // Define fetchOrders before useEffect
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        const ordersData = response.data.DB_DATA.orders || [];
        setOrders(ordersData);
        
        // Aggregate orders by user for Customer Orders tab
        const customerSummary = aggregateOrdersByUser(ordersData);
        setCustomerOrdersSummary(customerSummary);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.ERROR_DESCRIPTION || 'Failed to fetch orders',
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to fetch orders',
      });
    } finally {
      setOrdersLoading(false);
    }
  }, [aggregateOrdersByUser]);

  // Define fetchComments before useEffect
  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await commentApi.getAllComments();
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        setComments(response.data.DB_DATA.comments || []);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.ERROR_DESCRIPTION || 'Failed to fetch comments',
        });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to fetch comments',
      });
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  // Check authentication and role-based access
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please login to access admin dashboard',
      }).then(() => {
        navigate('/MyAccountSignIn');
      });
      return;
    }

    // Check user role from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const userRole = parsedUser.role;

        // If user role is "employee" or not "admin", redirect to home page
        if (userRole === 'employee' || userRole !== 'admin') {
          Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: 'You do not have permission to access the admin dashboard',
          }).then(() => {
            navigate('/');
          });
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to verify user permissions',
        }).then(() => {
          navigate('/');
        });
        return;
      }
    } else {
      // If no user data, try to decode JWT token to get role
      try {
        // Decode JWT token (simple base64 decode of payload)
        const tokenParts = jwtToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const userRole = payload.role;

          // If user role is "employee" or not "admin", redirect to home page
          if (userRole === 'employee' || userRole !== 'admin') {
            Swal.fire({
              icon: 'warning',
              title: 'Access Denied',
              text: 'You do not have permission to access the admin dashboard',
            }).then(() => {
              navigate('/');
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to verify user permissions',
        }).then(() => {
          navigate('/');
        });
        return;
      }
    }

    // If user is admin, proceed with fetching data
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'orders' || activeTab === 'customerOrders') {
      fetchOrders();
    } else if (activeTab === 'customerFeedback') {
      fetchComments();
    }
  }, [navigate, activeTab, fetchProducts, fetchCategories, fetchOrders, fetchComments]);

  // Fetch categories when switching to products tab (for dropdown)
  useEffect(() => {
    if (activeTab === 'products') {
      fetchCategories();
    }
  }, [activeTab, fetchCategories]);

  // Product handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetProductForm = () => {
    setProductFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      image: "",
      imageFile: null,
      main_image: "",
      main_imageFile: null,
      category: "",
      category_id: "",
      label: "",
      stock_quantity: "",
      unit: "1kg",
      additional_items: [],
    });
  };

  // Handle product image file selection
  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductFormData(prev => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file), // Preview URL
        main_imageFile: file,
        main_image: URL.createObjectURL(file), // Also set main_image for backward compatibility
      }));
    }
  };

  // Handle main image file selection
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductFormData(prev => ({
        ...prev,
        main_imageFile: file,
        main_image: URL.createObjectURL(file),
      }));
    }
  };

  // Add additional item
  const addAdditionalItem = () => {
    setProductFormData(prev => ({
      ...prev,
      additional_items: [...prev.additional_items, {
        name: "",
        image: "",
        imageFile: null,
        price: "",
        original_price: "",
        descriptions: "",
        stock_quantity: "",
      }],
    }));
  };

  // Update additional item
  const updateAdditionalItem = (index, field, value) => {
    setProductFormData(prev => {
      const newItems = [...prev.additional_items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, additional_items: newItems };
    });
  };

  // Handle additional item image
  const handleAdditionalItemImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      updateAdditionalItem(index, 'imageFile', file);
      updateAdditionalItem(index, 'image', URL.createObjectURL(file));
    }
  };

  // Remove additional item
  const removeAdditionalItem = (index) => {
    setProductFormData(prev => ({
      ...prev,
      additional_items: prev.additional_items.filter((_, i) => i !== index),
    }));
  };

  // Handle category image file selection
  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryFormData(prev => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file), // Preview URL
      }));
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file, folder = "grocery_store") => {
    try {
      setUploadingImage(true);
      const response = await uploadApi.uploadImage(file, folder);
      
      console.log('FILE: AdminDashboard.jsx | uploadImageToCloudinary | Upload response:', response?.data);
      
      if (response?.data?.STATUS === "SUCCESSFUL" && response?.data?.DB_DATA?.url) {
        const imageUrl = response.data.DB_DATA.url;
        if (!imageUrl || imageUrl.trim() === '') {
          throw new Error("Image upload returned empty URL");
        }
        return imageUrl;
      } else {
        const errorMessage = response?.data?.ERROR_DESCRIPTION || "Failed to upload image";
        console.error('FILE: AdminDashboard.jsx | uploadImageToCloudinary | Upload failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("FILE: AdminDashboard.jsx | uploadImageToCloudinary | Error:", error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!productFormData.name || !productFormData.price || (!productFormData.category && !productFormData.category_id)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Name, Price, Category)',
      });
      return;
    }

    const mainImageFile = productFormData.main_imageFile || productFormData.imageFile;
    if (!mainImageFile && !productFormData.main_image && !productFormData.image) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please upload a main image',
      });
      return;
    }

    setLoading(true);
    try {
      // Upload main image - MUST upload file, cannot use preview URL
      let mainImageUrl = null;
      if (mainImageFile) {
        try {
          mainImageUrl = await uploadImageToCloudinary(mainImageFile, "products");
          if (!mainImageUrl || mainImageUrl.trim() === '') {
            throw new Error('Image upload returned empty URL');
          }
        } catch (uploadError) {
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: uploadError.response?.data?.ERROR_DESCRIPTION || uploadError.message || 'Failed to upload main image. Please try again.',
          });
          setLoading(false);
          return;
        }
      } else {
        // If no file is selected, show error
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please upload a main image file',
        });
        setLoading(false);
        return;
      }

      // Final validation - ensure mainImageUrl is set
      if (!mainImageUrl || mainImageUrl.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Main image URL is missing. Please upload an image.',
        });
        setLoading(false);
        return;
      }

      // Upload additional item images
      const processedAdditionalItems = await Promise.all(
        productFormData.additional_items.map(async (item) => {
          let itemImageUrl = item.image;
          if (item.imageFile) {
            try {
              itemImageUrl = await uploadImageToCloudinary(item.imageFile, "products");
            } catch (error) {
              console.error("Error uploading additional item image:", error);
            }
          }
          return {
            name: item.name,
            image: itemImageUrl,
            price: parseFloat(item.price) || 0,
            original_price: item.original_price ? parseFloat(item.original_price) : null,
            descriptions: item.descriptions || null,
            stock_quantity: item.stock_quantity ? parseInt(item.stock_quantity) : 0,
          };
        })
      );

      // Find category_id if category name is provided
      let categoryId = productFormData.category_id;
      if (!categoryId && productFormData.category) {
        const selectedCategory = categories.find(cat => cat.name === productFormData.category);
        if (selectedCategory) {
          categoryId = selectedCategory._id;
        }
      }

      // Validate category_id is set
      if (!categoryId && !productFormData.category) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please select a category',
        });
        setLoading(false);
        return;
      }

      // Prepare the product payload
      const productPayload = {
        name: productFormData.name,
        description: productFormData.description || null,
        price: parseFloat(productFormData.price),
        original_price: productFormData.original_price ? parseFloat(productFormData.original_price) : null,
        main_image: mainImageUrl, // This is required and should always be set at this point
        category: productFormData.category || null,
        category_id: categoryId || null,
        label: productFormData.label || null,
        stock_quantity: productFormData.stock_quantity ? parseInt(productFormData.stock_quantity) : 0,
        unit: productFormData.unit || "1kg",
        additional_items: processedAdditionalItems.filter(item => item.name && item.image),
      };

      // Final validation before sending
      if (!productPayload.main_image || productPayload.main_image.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Main image is required. Please upload an image.',
        });
        setLoading(false);
        return;
      }

      console.log('FILE: AdminDashboard.jsx | handleAddProduct | Sending product payload:', productPayload);

      const response = await productApi.createProduct(productPayload);

      if (response.status === 201 && response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product created successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowAddModal(false);
        resetProductForm();
        fetchProducts();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to create product',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      original_price: product.original_price || "",
      image: product.main_image || product.image || "",
      imageFile: null,
      main_image: product.main_image || product.image || "",
      main_imageFile: null,
      category: product.category || "",
      category_id: product.category_id?._id || product.category_id || "",
      label: product.label || "",
      stock_quantity: product.stock_quantity || "",
      unit: product.unit || "1kg",
      additional_items: product.additional_items ? product.additional_items.map(item => ({
        name: item.name || "",
        image: item.image || "",
        imageFile: null,
        price: item.price || "",
        original_price: item.original_price || "",
        descriptions: item.descriptions || "",
        stock_quantity: item.stock_quantity || "",
      })) : [],
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload main image if a new file is selected
      let mainImageUrl = productFormData.main_image || productFormData.image;
      const mainImageFile = productFormData.main_imageFile || productFormData.imageFile;
      
      if (mainImageFile) {
        try {
          mainImageUrl = await uploadImageToCloudinary(mainImageFile, "products");
          if (!mainImageUrl || mainImageUrl.trim() === '') {
            throw new Error('Image upload returned empty URL');
          }
        } catch (uploadError) {
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: uploadError.response?.data?.ERROR_DESCRIPTION || uploadError.message || 'Failed to upload main image. Please try again.',
          });
          setLoading(false);
          return;
        }
      }

      // Upload additional item images
      const processedAdditionalItems = await Promise.all(
        productFormData.additional_items.map(async (item) => {
          let itemImageUrl = item.image;
          if (item.imageFile) {
            try {
              itemImageUrl = await uploadImageToCloudinary(item.imageFile, "products");
            } catch (error) {
              console.error("Error uploading additional item image:", error);
            }
          }
          return {
            name: item.name,
            image: itemImageUrl,
            price: parseFloat(item.price) || 0,
            original_price: item.original_price ? parseFloat(item.original_price) : null,
            descriptions: item.descriptions || null,
            stock_quantity: item.stock_quantity ? parseInt(item.stock_quantity) : 0,
          };
        })
      );

      // Find category_id if category name is provided
      let categoryId = productFormData.category_id;
      if (!categoryId && productFormData.category) {
        const selectedCategory = categories.find(cat => cat.name === productFormData.category);
        if (selectedCategory) {
          categoryId = selectedCategory._id;
        }
      }

      const response = await productApi.updateProduct(editingProduct._id, {
        name: productFormData.name,
        description: productFormData.description || null,
        price: parseFloat(productFormData.price),
        original_price: productFormData.original_price ? parseFloat(productFormData.original_price) : null,
        main_image: mainImageUrl,
        category: productFormData.category || null,
        category_id: categoryId || null,
        label: productFormData.label || null,
        stock_quantity: productFormData.stock_quantity ? parseInt(productFormData.stock_quantity) : 0,
        unit: productFormData.unit || "1kg",
        additional_items: processedAdditionalItems.filter(item => item.name && item.image),
      });

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product updated successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowEditModal(false);
        setEditingProduct(null);
        resetProductForm();
        fetchProducts();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to update product',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (productId, productName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${productName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await productApi.deleteProduct(productId);
          if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Product has been deleted',
              timer: 2000,
              showConfirmButton: false,
            });
            fetchProducts();
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to delete product',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Category handlers
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      image: "",
      imageFile: null,
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!categoryFormData.name) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in category name',
      });
      return;
    }

    if (!categoryFormData.imageFile && !categoryFormData.image) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please upload an image',
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = categoryFormData.image;

      // If a new file is selected, upload it to Cloudinary
      if (categoryFormData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(categoryFormData.imageFile, "categories");
        } catch (uploadError) {
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: uploadError.response?.data?.ERROR_DESCRIPTION || 'Failed to upload image. Please try again.',
          });
          setLoading(false);
          return;
        }
      }

      const response = await categoryApi.createCategory({
        name: categoryFormData.name,
        image: imageUrl,
      });

      if (response.status === 201 && response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category created successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowAddCategoryModal(false);
        resetCategoryForm();
        fetchCategories();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to create category',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name || "",
      image: category.image || "",
      imageFile: null,
    });
    setShowEditCategoryModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = categoryFormData.image;

      // If a new file is selected, upload it to Cloudinary
      if (categoryFormData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(categoryFormData.imageFile, "categories");
        } catch (uploadError) {
          Swal.fire({
            icon: 'error',
            title: 'Upload Error',
            text: uploadError.response?.data?.ERROR_DESCRIPTION || 'Failed to upload image. Please try again.',
          });
          setLoading(false);
          return;
        }
      }

      const response = await categoryApi.updateCategory(editingCategory._id, {
        name: categoryFormData.name,
        image: imageUrl,
      });

      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category updated successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowEditCategoryModal(false);
        setEditingCategory(null);
        resetCategoryForm();
        fetchCategories();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to update category',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${categoryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await categoryApi.deleteCategory(categoryId);
          if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category has been deleted',
              timer: 2000,
              showConfirmButton: false,
            });
            fetchCategories();
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to delete category',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  return (
    <div>
      <ScrollToTop />
      <section className="py-8 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-0">Admin Dashboard</h2>
              <div className="flex items-center gap-3">
                {activeTab === 'products' && (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center"
                    onClick={() => {
                      resetProductForm();
                      setShowAddModal(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Add New Product
                  </button>
                )}
                {/* {activeTab === 'products' && (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center"
                    onClick={() => {
                      resetProductForm();
                      setShowAddModal(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Add New Product
                  </button>
                )} */}
                {(activeTab === 'orders' || activeTab === 'customerOrders') && (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center"
                    onClick={async () => {
                      setCreateOrderForm({
                        customerName: '',
                        customerPhone: '',
                        customerEmail: '',
                        customerAddress: '',
                        productId: '',
                        quantity: 1,
                        paymentMethod: 'cod',
                      });
                      setCustomerSelectionMode('select');
                      setSelectedCustomerId('');
                      // Fetch products list for dropdown
                      setProductsListLoading(true);
                      try {
                        const response = await productApi.getProductsList();
                        if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
                          setProductsList(response.data.DB_DATA || []);
                        }
                      } catch (error) {
                        console.error('Error fetching products list:', error);
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'Failed to load products list',
                        });
                      } finally {
                        setProductsListLoading(false);
                      }
                      // Fetch users list for dropdown
                      setUsersListLoading(true);
                      try {
                        const usersResponse = await userApi.getAllUsersList();
                        if (usersResponse.status === 200 && usersResponse.data.STATUS === "SUCCESSFUL") {
                          setUsersList(usersResponse.data.DB_DATA?.users || []);
                        }
                      } catch (error) {
                        console.error('Error fetching users list:', error);
                        // Don't show error, just continue without users list
                      } finally {
                        setUsersListLoading(false);
                      }
                      setShowCreateOrderModal(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                     Create Order
                  </button>
                )}
                {activeTab === 'categories' && (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center"
                    onClick={() => {
                      resetCategoryForm();
                      setShowAddCategoryModal(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Add New Category
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('products')}
              >
                Products
              </button>
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('categories')}
              >
                Categories
              </button>
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customerOrders'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('customerOrders')}
              >
                Customer Orders
              </button>
              <button
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customerFeedback'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('customerFeedback')}
              >
                Customer Feedback
              </button>
            </nav>
          </div>

          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium" type="submit">
                    Search
                  </button>
                  {searchTerm && (
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                        fetchProducts();
                      }}
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>

              {/* Products Table */}
              <div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    {loading && products.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No products found</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Image</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Name</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Category</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Price</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Stock</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Label</th>
                                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {products.map((product) => (
                                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 border-b border-gray-200">
                                      <img
                                        src={product.main_image || product.image || 'https://via.placeholder.com/50'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/50';
                                        }}
                                      />
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                      <strong className="font-semibold text-gray-900">{product.name}{product.unit ? ` (${product.unit})` : ''}</strong>
                                      {product.description && (
                                        <div className="text-gray-500 text-sm mt-1">{product.description.substring(0, 50)}...</div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">{product.category}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                      <strong className="font-semibold text-gray-900">Rs {product.price}</strong>
                                      {product.original_price && product.original_price > product.price && (
                                        <div className="text-gray-500 text-sm line-through">
                                          Rs {product.original_price}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200 text-gray-700">{product.stock_quantity || 0}</td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                      {product.label && (
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                          product.label === 'Sale' ? 'bg-red-100 text-red-800' :
                                          product.label === 'Hot' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-blue-100 text-blue-800'
                                        }`}>
                                          {product.label}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-gray-200">
                                      <div className="flex gap-2">
                                        <button
                                          className="p-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                                          onClick={() => handleEditProductClick(product)}
                                          title="Edit"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                          </svg>
                                        </button>
                                        <button
                                          className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                                          onClick={() => handleDeleteProduct(product._id, product.name)}
                                          title="Delete"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={16}
                                            height={16}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <nav aria-label="Page navigation" className="mt-6">
                              <ul className="flex justify-center items-center space-x-1">
                                <li>
                                  <button
                                    type="button"
                                    className={`px-3 py-2 border border-gray-300 rounded-lg ${
                                      currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(prev => Math.max(1, prev - 1));
                                    }}
                                    disabled={currentPage === 1}
                                  >
                                    Previous
                                  </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => {
                                  const page = index + 1;
                                  if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                  ) {
                                    return (
                                      <li key={page}>
                                        <button
                                          type="button"
                                          className={`px-3 py-2 border rounded-lg ${
                                            currentPage === page
                                              ? 'bg-primary text-white border-primary'
                                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                          }`}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(page);
                                          }}
                                        >
                                          {page}
                                        </button>
                                      </li>
                                    );
                                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return (
                                      <li key={page}>
                                        <span className="px-3 py-2 text-gray-400">...</span>
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                                <li>
                                  <button
                                    type="button"
                                    className={`px-3 py-2 border border-gray-300 rounded-lg ${
                                      currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                    }}
                                    disabled={currentPage === totalPages}
                                  >
                                    Next
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
            </>
          )}

          {/* Categories Tab Content */}
          {activeTab === 'categories' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {loading && categories.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No categories found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Image</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 border-b border-gray-200">
                                <img
                                  src={category.image}
                                  alt={category.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/50';
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <strong className="font-semibold text-gray-900">{category.name}</strong>
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <div className="flex gap-2">
                                  <button
                                    className="p-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                                    onClick={() => handleEditCategoryClick(category)}
                                    title="Edit"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="p-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                                    onClick={() => handleDeleteCategory(category._id, category.name)}
                                    title="Delete"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={16}
                                      height={16}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Search and Date Filter */}
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by Order Number, Customer Name, or Items..."
                          value={orderSearchTerm}
                          onChange={(e) => setOrderSearchTerm(e.target.value)}
                          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.35-4.35" />
                        </svg>
                        {orderSearchTerm && (
                          <button
                            onClick={() => setOrderSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={20}
                              height={20}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Date Filters */}
                    <div className="flex flex-col gap-2">
                      {/* Labels Row */}
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                        </div>
                      </div>
                      {/* Inputs Row */}
                      <div className="flex gap-3">
                        {/* Start Date */}
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {startDate && (
                              <button
                                onClick={() => setStartDate('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              min={startDate || undefined}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {endDate && (
                              <button
                                onClick={() => setEndDate('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={16}
                                  height={16}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    
                    {/* Export Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          // Get filtered orders (same logic as in the filter function)
                          const filteredOrders = orders.filter(order => {
                            // Search term filter
                            if (orderSearchTerm.trim()) {
                              const searchLower = orderSearchTerm.toLowerCase().trim();
                              
                              const orderNumber = order.order_number?.toLowerCase() || '';
                              const matchesOrderNumber = orderNumber.includes(searchLower);
                              
                              const customerName = (
                                (order.user_id && typeof order.user_id === 'object' ? order.user_id.name : '') || 
                                order.shipping_address?.name || 
                                ''
                              ).toLowerCase();
                              const matchesCustomerName = customerName.includes(searchLower);
                              
                              const itemNames = order.items?.map(item => item.name?.toLowerCase() || '').join(' ') || '';
                              const matchesItems = itemNames.includes(searchLower);
                              
                              if (!matchesOrderNumber && !matchesCustomerName && !matchesItems) {
                                return false;
                              }
                            }
                            
                            // Date range filter
                            if (startDate || endDate) {
                              const orderDate = order.created_at ? new Date(order.created_at * 1000) : null;
                              if (!orderDate) return false;
                              
                              if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (orderDate < start) return false;
                              }
                              
                              if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (orderDate > end) return false;
                              }
                            }
                            
                            return true;
                          });

                          // Aggregate orders by customer
                          const customerOrderMap = {};
                          filteredOrders.forEach(order => {
                            const customerName = (
                              (order.user_id && typeof order.user_id === 'object' ? order.user_id.name : '') || 
                              order.shipping_address?.name || 
                              'Unknown Customer'
                            );
                            
                            if (!customerOrderMap[customerName]) {
                              customerOrderMap[customerName] = 0;
                            }
                            customerOrderMap[customerName] += 1;
                          });

                          // Convert to array for PDF
                          const customerOrderData = Object.entries(customerOrderMap)
                            .map(([name, count]) => [name, count.toString()])
                            .sort((a, b) => parseInt(b[1]) - parseInt(a[1]));

                          // Create PDF
                          const doc = new jsPDF();
                          
                          // Title
                          doc.setFontSize(18);
                          doc.text('Orders Report', 14, 20);
                          
                          // Date range info
                          doc.setFontSize(10);
                          let dateInfo = 'All Orders';
                          if (startDate && endDate) {
                            dateInfo = `From ${startDate} to ${endDate}`;
                          } else if (startDate) {
                            dateInfo = `From ${startDate}`;
                          } else if (endDate) {
                            dateInfo = `Until ${endDate}`;
                          }
                          doc.text(dateInfo, 14, 30);
                          
                          // Search term info
                          if (orderSearchTerm.trim()) {
                            doc.text(`Search: ${orderSearchTerm}`, 14, 35);
                          }
                          
                          // Table data
                          const tableData = customerOrderData;
                          
                          // Add table
                          const startY = orderSearchTerm.trim() ? 40 : 35;
                          autoTable(doc, {
                            startY: startY,
                            head: [['Customer Name', 'No. of Orders']],
                            body: tableData,
                            theme: 'striped',
                            headStyles: { fillColor: [34, 139, 34] }, // Green color
                            styles: { fontSize: 10, cellPadding: 3 },
                            columnStyles: {
                              0: { cellWidth: 120 },
                              1: { cellWidth: 60, halign: 'center' }
                            }
                          });
                          
                          // Get the actual final Y position after table is drawn
                          // Add margin (15 units) between table and total line for proper spacing
                          const finalY = doc.lastAutoTable.finalY || (startY + (tableData.length * 7) + 10);
                          const totalYPosition = finalY + 15;
                          
                          // Add total at the bottom with proper spacing
                          doc.setFontSize(12);
                          doc.setFont(undefined, 'bold');
                          doc.text(`Total Orders: ${filteredOrders.length}`, 14, totalYPosition);
                          
                          // Save PDF
                          const fileName = `Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`;
                          doc.save(fileName);
                          
                          Swal.fire({
                            icon: 'success',
                            title: 'Export Successful',
                            text: `PDF exported with ${filteredOrders.length} orders`,
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={18}
                          height={18}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                      </button>
                    </div>
                  </div>

                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (() => {
                    // Filter orders based on search term and date range
                    const filteredOrders = orders.filter(order => {
                      // Search term filter
                      if (orderSearchTerm.trim()) {
                        const searchLower = orderSearchTerm.toLowerCase().trim();
                        
                        // Search in order number
                        const orderNumber = order.order_number?.toLowerCase() || '';
                        const matchesOrderNumber = orderNumber.includes(searchLower);
                        
                        // Search in customer name
                        const customerName = (
                          (order.user_id && typeof order.user_id === 'object' ? order.user_id.name : '') || 
                          order.shipping_address?.name || 
                          ''
                        ).toLowerCase();
                        const matchesCustomerName = customerName.includes(searchLower);
                        
                        // Search in items (product names)
                        const itemNames = order.items?.map(item => item.name?.toLowerCase() || '').join(' ') || '';
                        const matchesItems = itemNames.includes(searchLower);
                        
                        // If search term doesn't match any field, exclude this order
                        if (!matchesOrderNumber && !matchesCustomerName && !matchesItems) {
                          return false;
                        }
                      }
                      
                      // Date range filter
                      if (startDate || endDate) {
                        // Convert created_at (Unix timestamp) to Date object
                        const orderDate = order.created_at ? new Date(order.created_at * 1000) : null;
                        
                        if (!orderDate) return false; // Exclude orders without date
                        
                        // Set time to start of day for startDate comparison
                        if (startDate) {
                          const start = new Date(startDate);
                          start.setHours(0, 0, 0, 0);
                          if (orderDate < start) return false;
                        }
                        
                        // Set time to end of day for endDate comparison
                        if (endDate) {
                          const end = new Date(endDate);
                          end.setHours(23, 59, 59, 999);
                          if (orderDate > end) return false;
                        }
                      }
                      
                      return true;
                    });

                    return filteredOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No orders found matching your search</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Order Number</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Customer</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Items</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => {
                            // Determine next status based on current status
                            const getNextStatus = (currentStatus) => {
                              switch (currentStatus) {
                                case 'pending':
                                  return 'delivered';
                                case 'delivered':
                                  return 'completed';
                                case 'completed':
                                  return null; // No next status
                                default:
                                  return 'delivered'; // Default to delivered for other statuses
                              }
                            };

                            const nextStatus = getNextStatus(order.order_status);
                            const isUpdating = updatingOrderId === order._id;

                            return (
                              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 border-b border-gray-200">
                                  <strong className="font-semibold text-gray-900">{order.order_number || `#${order._id.toString().slice(-6)}`}</strong>
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200">
                                  {order.user_id && typeof order.user_id === 'object' ? (
                                    <div>
                                      <div><strong className="font-semibold text-gray-900">{order.user_id.name || 'N/A'}</strong></div>
                                      {order.user_id.phone && (
                                        <div className="text-sm text-gray-500">{order.user_id.phone}</div>
                                      )}
                                    </div>
                                  ) : order.shipping_address ? (
                                    <div>
                                      <div><strong className="font-semibold text-gray-900">{order.shipping_address.name || 'N/A'}</strong></div>
                                      {order.shipping_address.phone && (
                                        <div className="text-sm text-gray-500">{order.shipping_address.phone}</div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">N/A</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200">
                                  <div>
                                    {order.items && order.items.length > 0 ? (
                                      <>
                                        {order.items.slice(0, 2).map((item, idx) => {
                                          const itemName = typeof item.product_id === 'object' && item.product_id ? item.product_id.name : item.name;
                                          let unit = '';
                                          if (typeof item.product_id === 'object' && item.product_id && item.product_id.unit) {
                                            unit = item.product_id.unit.replace(/^\d+/, '').trim();
                                          }
                                          const quantityDisplay = unit ? `${item.quantity} ${unit}` : item.quantity;
                                          return (
                                            <div key={idx} className="text-sm text-gray-700">
                                              {itemName} x {quantityDisplay}
                                            </div>
                                          );
                                        })}
                                        {order.items.length > 2 && (
                                          <div className="text-sm text-gray-500">+{order.items.length - 2} more</div>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-gray-500">No items</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 border-b border-gray-200 relative">
                                  <div className="relative action-menu-container">
                                    <button
                                      onClick={() => setActionMenuOpen(actionMenuOpen === order._id ? null : order._id)}
                                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                      title="Actions"
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                      </svg>
                                    </button>
                                    {actionMenuOpen === order._id && (
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="py-1">
                                          {order.order_status !== 'delivered' && order.order_status !== 'completed' && (
                                            <button
                                              onClick={async () => {
                                                setActionMenuOpen(null);
                                                const currentOrderStatus = order.order_status;
                                                const currentPaymentStatus = order.payment_status;
                                                const updatingOrderId = order._id;
                                                
                                                try {
                                                  setUpdatingOrderId(updatingOrderId);
                                                  
                                                  const optimisticUpdate = { order_status: 'delivered' };
                                                  if (order.order_status === 'pending') {
                                                    optimisticUpdate.payment_status = 'paid';
                                                  }
                                                  
                                                  setOrders(prevOrders => 
                                                    prevOrders.map(o => 
                                                      o._id === updatingOrderId 
                                                        ? { ...o, ...optimisticUpdate }
                                                        : o
                                                    )
                                                  );

                                                  const response = await orderApi.updateOrderStatus(order._id, 'delivered');
                                                  
                                                  if (response?.data?.STATUS === "SUCCESSFUL") {
                                                    if (response.data.DB_DATA) {
                                                      setOrders(prevOrders => 
                                                        prevOrders.map(o => 
                                                          o._id === updatingOrderId 
                                                            ? { ...o, ...response.data.DB_DATA }
                                                            : o
                                                        )
                                                      );
                                                    }
                                                    
                                                    Swal.fire({
                                                      icon: 'success',
                                                      title: 'Success!',
                                                      text: 'Order marked as delivered',
                                                      timer: 2000,
                                                      showConfirmButton: false,
                                                    });
                                                  } else {
                                                    setOrders(prevOrders => 
                                                      prevOrders.map(o => 
                                                        o._id === updatingOrderId 
                                                          ? { ...o, order_status: currentOrderStatus, payment_status: currentPaymentStatus }
                                                          : o
                                                      )
                                                    );
                                                    
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Error',
                                                      text: response?.data?.ERROR_DESCRIPTION || 'Failed to update order status',
                                                    });
                                                  }
                                                } catch (error) {
                                                  console.error('Error updating order status:', error);
                                                  setOrders(prevOrders => 
                                                    prevOrders.map(o => 
                                                      o._id === updatingOrderId 
                                                        ? { ...o, order_status: currentOrderStatus, payment_status: currentPaymentStatus }
                                                        : o
                                                    )
                                                  );
                                                  
                                                  Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to update order status',
                                                  });
                                                } finally {
                                                  setUpdatingOrderId(null);
                                                }
                                              }}
                                              disabled={isUpdating}
                                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                              Mark as Delivered
                                            </button>
                                          )}
                                          <button
                                            onClick={() => {
                                              setActionMenuOpen(null);
                                              setSelectedOrder(order);
                                              setShowOrderDetailsModal(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Customer Orders Tab Content */}
          {activeTab === 'customerOrders' && (
            <div className="space-y-6">
              {/* Customer Orders Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Orders Summary</h3>
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : customerOrdersSummary.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No customer orders found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Customer Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">Number of Orders</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerOrdersSummary.map((customer, index) => (
                            <tr key={customer.userId} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <strong className="font-semibold text-gray-900">{customer.userName}</strong>
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                                {customer.email}
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary text-white">
                                  {customer.orderCount}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer Feedback Tab Content */}
          {activeTab === 'customerFeedback' && (
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Feedback</h3>
                  {commentsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No feedback found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              {comment.user_id && typeof comment.user_id === 'object' ? (
                                <div>
                                  <strong className="font-semibold text-gray-900">{comment.user_id.name || 'Registered User'}</strong>
                                  <span className="text-gray-500 text-sm ml-2">({comment.user_id.email || ''})</span>
                                </div>
                              ) : (
                                <strong className="font-semibold text-gray-900">Guest User</strong>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.created_at * 1000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            resetProductForm();
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h5 className="text-xl font-semibold text-gray-900">Add New Product</h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowAddModal(false);
                  resetProductForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="border-b border-gray-200 pb-4">
                    <h6 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h6>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          name="name"
                          value={productFormData.name}
                          onChange={handleProductInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          name="description"
                          rows="3"
                          value={productFormData.description}
                          onChange={handleProductInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="price"
                            value={productFormData.price}
                            onChange={handleProductInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (for discount)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="original_price"
                            value={productFormData.original_price}
                            onChange={handleProductInputChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="stock_quantity"
                            value={productFormData.stock_quantity}
                            onChange={handleProductInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="category"
                            value={productFormData.category}
                            onChange={(e) => {
                              const selectedCategory = categories.find(cat => cat.name === e.target.value);
                              setProductFormData(prev => ({
                                ...prev,
                                category: e.target.value,
                                category_id: selectedCategory ? selectedCategory._id : "",
                              }));
                            }}
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                          <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="label"
                            value={productFormData.label}
                            onChange={handleProductInputChange}
                          >
                            <option value="">None</option>
                            <option value="Sale">Sale</option>
                            <option value="Hot">Hot</option>
                            <option value="New">New</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            name="unit"
                            value={productFormData.unit}
                            onChange={handleProductInputChange}
                            placeholder="e.g., 1kg, 500g, 1L"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Image */}
                  <div className="border-b border-gray-200 pb-4">
                    <h6 className="text-lg font-semibold text-gray-900 mb-4">Main Product Image <span className="text-red-500">*</span></h6>
                    <div>
                      <input
                        type="file"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleMainImageChange}
                        required
                      />
                      <small className="text-gray-500 text-xs mt-1 block">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                      </small>
                      {(productFormData.main_image || productFormData.image) && (
                        <div className="mt-2">
                          <img
                            src={productFormData.main_image || productFormData.image}
                            alt="Main Preview"
                            className="w-36 h-36 object-cover rounded border border-gray-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Items */}
                  <div className="pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h6 className="text-lg font-semibold text-gray-900">Additional Items</h6>
                      <button
                        type="button"
                        onClick={addAdditionalItem}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </div>
                    {productFormData.additional_items.length > 0 && (
                      <div className="space-y-4">
                        {productFormData.additional_items.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeAdditionalItem(index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={item.name}
                                  onChange={(e) => updateAdditionalItem(index, 'name', e.target.value)}
                                  placeholder="e.g., Matching Belt"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                                <input
                                  type="file"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                  onChange={(e) => handleAdditionalItemImageChange(index, e)}
                                />
                                {item.image && (
                                  <img src={item.image} alt="Item" className="w-20 h-20 object-cover rounded mt-2 border border-gray-300" />
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={item.price}
                                  onChange={(e) => updateAdditionalItem(index, 'price', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={item.original_price}
                                  onChange={(e) => updateAdditionalItem(index, 'original_price', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descriptions</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={item.descriptions}
                                  onChange={(e) => updateAdditionalItem(index, 'descriptions', e.target.value)}
                                  placeholder="Enter item descriptions"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  value={item.stock_quantity}
                                  onChange={(e) => updateAdditionalItem(index, 'stock_quantity', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => {
                    setShowAddModal(false);
                    resetProductForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowEditModal(false);
            setEditingProduct(null);
            resetProductForm();
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h5 className="text-xl font-semibold text-gray-900">Edit Product</h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="name"
                      value={productFormData.name}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="description"
                      rows="3"
                      value={productFormData.description}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (for discount)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        name="original_price"
                        value={productFormData.original_price}
                        onChange={handleProductInputChange}
                      />
                    </div>
                  </div>
                  {/* Main Image */}
                  <div className="border-b border-gray-200 pb-4">
                    <h6 className="text-lg font-semibold text-gray-900 mb-4">Main Product Image <span className="text-red-500">*</span></h6>
                    <div>
                      <input
                        type="file"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleMainImageChange}
                      />
                      <small className="text-gray-500 text-xs mt-1 block">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB). Leave empty to keep current image.
                      </small>
                      {(productFormData.main_image || productFormData.image) && (
                        <div className="mt-2">
                          <img
                            src={productFormData.main_image || productFormData.image}
                            alt="Main Preview"
                            className="w-36 h-36 object-cover rounded border border-gray-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        name="category"
                        value={productFormData.category}
                        onChange={(e) => {
                          const selectedCategory = categories.find(cat => cat.name === e.target.value);
                          setProductFormData(prev => ({
                            ...prev,
                            category: e.target.value,
                            category_id: selectedCategory ? selectedCategory._id : "",
                          }));
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        name="label"
                        value={productFormData.label}
                        onChange={handleProductInputChange}
                      >
                        <option value="">None</option>
                        <option value="Sale">Sale</option>
                        <option value="Hot">Hot</option>
                        <option value="New">New</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="unit"
                      value={productFormData.unit}
                      onChange={handleProductInputChange}
                      placeholder="e.g., 1kg, 500g, 1L"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="stock_quantity"
                      value={productFormData.stock_quantity}
                      onChange={handleProductInputChange}
                    />
                  </div>
                </div>

                {/* Additional Items */}
                <div className="pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h6 className="text-lg font-semibold text-gray-900">Additional Items</h6>
                    <button
                      type="button"
                      onClick={addAdditionalItem}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                  {productFormData.additional_items.length > 0 && (
                    <div className="space-y-4">
                      {productFormData.additional_items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeAdditionalItem(index)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.name}
                                onChange={(e) => updateAdditionalItem(index, 'name', e.target.value)}
                                placeholder="e.g., Matching Belt"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                              <input
                                type="file"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={(e) => handleAdditionalItemImageChange(index, e)}
                              />
                              {item.image && (
                                <img src={item.image} alt="Item" className="w-20 h-20 object-cover rounded mt-2 border border-gray-300" />
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.price}
                                onChange={(e) => updateAdditionalItem(index, 'price', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.original_price}
                                onChange={(e) => updateAdditionalItem(index, 'original_price', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Descriptions</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.descriptions}
                                onChange={(e) => updateAdditionalItem(index, 'descriptions', e.target.value)}
                                placeholder="Enter item descriptions"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={item.stock_quantity}
                                onChange={(e) => updateAdditionalItem(index, 'stock_quantity', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddCategoryModal(false);
            resetCategoryForm();
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h5 className="text-xl font-semibold text-gray-900">Add New Category</h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  resetCategoryForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image <span className="text-red-500">*</span></label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleCategoryImageChange}
                      required
                    />
                    <small className="text-gray-500 text-xs mt-1 block">
                      Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                    </small>
                    {categoryFormData.image && (
                      <div className="mt-2">
                        <img
                          src={categoryFormData.image}
                          alt="Preview"
                          className="w-36 h-36 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    resetCategoryForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowEditCategoryModal(false);
            setEditingCategory(null);
            resetCategoryForm();
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h5 className="text-xl font-semibold text-gray-900">Edit Category</h5>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowEditCategoryModal(false);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateCategory}>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                    <input
                      type="file"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleCategoryImageChange}
                    />
                    <small className="text-gray-500 text-xs mt-1 block">
                      Supported formats: JPEG, PNG, GIF, WebP (Max 5MB). Leave empty to keep current image.
                    </small>
                    {categoryFormData.image && (
                      <div className="mt-2">
                        <img
                          src={categoryFormData.image}
                          alt="Preview"
                          className="w-36 h-36 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setEditingCategory(null);
                    resetCategoryForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Order</h2>
                <button
                  onClick={() => {
                    setShowCreateOrderModal(false);
                    setCustomerSelectionMode('select');
                    setSelectedCustomerId('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  // Validate form
                  if (!createOrderForm.customerName || !createOrderForm.customerPhone || !createOrderForm.productId || !createOrderForm.quantity) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Validation Error',
                      text: 'Please fill in all required fields',
                    });
                    return;
                  }

                  // Find selected product from list
                  const selectedProductFromList = productsList.find(p => p._id === createOrderForm.productId);
                  if (!selectedProductFromList) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'Selected product not found',
                    });
                    return;
                  }

                  // Fetch full product details to get image
                  let productImage = null;
                  try {
                    const productResponse = await productApi.getProductById(createOrderForm.productId);
                    if (productResponse.status === 200 && productResponse.data.STATUS === "SUCCESSFUL") {
                      productImage = productResponse.data.DB_DATA?.image || null;
                    }
                  } catch (error) {
                    console.error('Error fetching product details:', error);
                    // Continue without image
                  }

                  // Prepare order data
                  // For admin-created orders, user_id should be null (guest order)
                  const orderData = {
                    user_id: null, // Explicitly set to null for guest orders created from admin dashboard
                    items: [
                      {
                        product_id: selectedProductFromList._id,
                        name: selectedProductFromList.name,
                        price: selectedProductFromList.price,
                        quantity: parseInt(createOrderForm.quantity),
                        image: productImage,
                      },
                    ],
                    shipping_address: {
                      name: createOrderForm.customerName,
                      email: createOrderForm.customerEmail || `${createOrderForm.customerPhone}@guest.com`,
                      phone: createOrderForm.customerPhone,
                      address: createOrderForm.customerAddress || 'Address not provided',
                    },
                    payment_method: createOrderForm.paymentMethod,
                    tax: 0,
                    shipping: 0,
                  };

                  try {
                    const response = await orderApi.createOrder(orderData);
                    
                    if (response.status === 201 && response.data.STATUS === "SUCCESSFUL") {
                      Swal.fire({
                        icon: 'success',
                        title: 'Order Created',
                        text: 'Order has been created successfully',
                        timer: 2000,
                        showConfirmButton: false,
                      });
                      
                      // Reset form
                      setCreateOrderForm({
                        customerName: '',
                        customerPhone: '',
                        customerEmail: '',
                        customerAddress: '',
                        productId: '',
                        quantity: 1,
                        paymentMethod: 'cod',
                      });
                      setShowCreateOrderModal(false);
                      setCustomerSelectionMode('select');
                      setSelectedCustomerId('');
                      
                      // Refresh orders list immediately
                      if (activeTab === 'orders' || activeTab === 'customerOrders') {
                        await fetchOrders();
                      }
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.ERROR_DESCRIPTION || 'Failed to create order',
                      });
                    }
                  } catch (error) {
                    console.error('Error creating order:', error);
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: error.response?.data?.ERROR_DESCRIPTION || 'Failed to create order',
                    });
                  }
                }}
                className="space-y-4"
              >
                {/* Customer Name Selection Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Radio buttons for selection mode */}
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="customerMode"
                        value="select"
                        checked={customerSelectionMode === 'select'}
                        onChange={(e) => {
                          setCustomerSelectionMode(e.target.value);
                          setSelectedCustomerId('');
                          setCreateOrderForm({ ...createOrderForm, customerName: '' });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Select Customer</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="customerMode"
                        value="manual"
                        checked={customerSelectionMode === 'manual'}
                        onChange={(e) => {
                          setCustomerSelectionMode(e.target.value);
                          setSelectedCustomerId('');
                          setCreateOrderForm({ ...createOrderForm, customerName: '' });
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Manual Entry</span>
                    </label>
                  </div>

                  {/* Conditional rendering based on mode */}
                  {customerSelectionMode === 'select' ? (
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => {
                        const userId = e.target.value;
                        setSelectedCustomerId(userId);
                        const selectedUser = usersList.find(u => u._id === userId);
                        if (selectedUser) {
                          setCreateOrderForm({ ...createOrderForm, customerName: selectedUser.name });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      disabled={usersListLoading}
                    >
                      <option value="">Select a customer</option>
                      {usersList.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={createOrderForm.customerName}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter customer name"
                      required
                    />
                  )}
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={createOrderForm.customerPhone}
                    onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={createOrderForm.customerEmail}
                    onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="customer@example.com"
                  />
                </div>

                {/* Customer Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <textarea
                    value={createOrderForm.customerAddress}
                    onChange={(e) => setCreateOrderForm({ ...createOrderForm, customerAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="3"
                    placeholder="Enter customer address"
                  />
                </div>

                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product <span className="text-red-500">*</span>
                  </label>
                  {productsListLoading ? (
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                      <span className="text-gray-500">Loading products...</span>
                    </div>
                  ) : (
                    <select
                      value={createOrderForm.productId}
                      onChange={(e) => setCreateOrderForm({ ...createOrderForm, productId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select a product</option>
                      {productsList.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}{product.unit ? ` (${product.unit})` : ''} - Rs {product.price}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={createOrderForm.quantity}
                    onChange={(e) => setCreateOrderForm({ ...createOrderForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={createOrderForm.paymentMethod}
                    onChange={(e) => setCreateOrderForm({ ...createOrderForm, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="easypaisa">Easy Paisa</option>
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateOrderModal(false);
                      setCustomerSelectionMode('select');
                      setSelectedCustomerId('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showPaymentProofModal && selectedPaymentProof && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPaymentProofModal(false);
            setSelectedPaymentProof(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoice</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowPaymentProofModal(false);
                  setSelectedPaymentProof(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="p-6 flex justify-center items-center bg-gray-50">
              <img
                src={selectedPaymentProof}
                alt="EasyPaisa Payment Invoice"
                className="max-w-full h-auto rounded-lg border border-gray-200 shadow-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                }}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  window.open(selectedPaymentProof, '_blank');
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Open in New Tab
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentProofModal(false);
                  setSelectedPaymentProof(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowOrderDetailsModal(false);
            setSelectedOrder(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Order Details</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrder(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Number */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Number</h4>
                <p className="text-lg font-bold text-gray-900">{selectedOrder.order_number || `#${selectedOrder._id.toString().slice(-6)}`}</p>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedOrder.user_id && typeof selectedOrder.user_id === 'object' ? (
                    <>
                      <p><span className="font-medium">Name:</span> {selectedOrder.user_id.name || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.user_id.email || 'N/A'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.user_id.phone || 'N/A'}</p>
                    </>
                  ) : selectedOrder.shipping_address ? (
                    <>
                      <p><span className="font-medium">Name:</span> {selectedOrder.shipping_address.name || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.shipping_address.email || 'N/A'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.shipping_address.phone || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No customer information available</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Shipping Address</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedOrder.shipping_address ? (
                    <>
                      <p className="font-medium text-gray-900">{selectedOrder.shipping_address.address || 'N/A'}</p>
                      {selectedOrder.shipping_address.latitude && selectedOrder.shipping_address.longitude && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Location Coordinates:</p>
                          <p className="text-sm text-gray-700 font-mono">
                            Latitude: {selectedOrder.shipping_address.latitude.toFixed(6)}
                          </p>
                          <p className="text-sm text-gray-700 font-mono">
                            Longitude: {selectedOrder.shipping_address.longitude.toFixed(6)}
                          </p>
                          <a
                            href={`https://www.google.com/maps?q=${selectedOrder.shipping_address.latitude},${selectedOrder.shipping_address.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View on Google Maps
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500">No address available</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Items</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => {
                        const itemName = typeof item.product_id === 'object' && item.product_id ? item.product_id.name : item.name;
                        const itemPrice = typeof item.product_id === 'object' && item.product_id ? item.product_id.price : item.price;
                        let unit = '';
                        if (typeof item.product_id === 'object' && item.product_id && item.product_id.unit) {
                          unit = item.product_id.unit.replace(/^\d+/, '').trim();
                        }
                        const quantityDisplay = unit ? `${item.quantity} ${unit}` : item.quantity;
                        return (
                          <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                            <div>
                              <p className="font-medium text-gray-900">{itemName}</p>
                              <p className="text-sm text-gray-500">Quantity: {quantityDisplay}</p>
                            </div>
                            <p className="font-semibold text-gray-900">Rs {(itemPrice * item.quantity).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">Rs {selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-semibold">Rs {selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.shipping > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold">Rs {selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">Rs {selectedOrder.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Order Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Method</h4>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">
                    {selectedOrder.payment_method || 'N/A'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Payment Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    selectedOrder.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.payment_status || 'N/A'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.order_status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedOrder.order_status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.order_status === 'processing' ? 'bg-primary text-white' :
                    selectedOrder.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedOrder.order_status || 'N/A'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Date</h4>
                  <p className="text-gray-700">
                    {selectedOrder.created_at ? new Date(selectedOrder.created_at * 1000).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
