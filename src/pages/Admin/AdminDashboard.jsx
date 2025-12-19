import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import productApi from "../../Model/Data/Product/Product";
import categoryApi from "../../Model/Data/Category/Category";
import orderApi from "../../Model/Data/Order/Order";
import uploadApi from "../../Model/Data/Upload/Upload";
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', or 'orders'
  
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
    image: "",
    imageFile: null, // For file upload
    category: "",
    label: "",
    stock_quantity: "",
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

  // Define fetchOrders before useEffect
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const response = await orderApi.getAllOrders();
      if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
        setOrders(response.data.DB_DATA.orders || []);
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
  }, []);

  // Check authentication and fetch data
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
    } else {
      if (activeTab === 'products') {
        fetchProducts();
      } else if (activeTab === 'categories') {
        fetchCategories();
      } else if (activeTab === 'orders') {
        fetchOrders();
      }
    }
  }, [navigate, activeTab, fetchProducts, fetchCategories, fetchOrders]);

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
      category: "",
      label: "",
      stock_quantity: "",
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
      }));
    }
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
      
      if (response?.data?.STATUS === "SUCCESSFUL") {
        return response.data.DB_DATA.url;
      } else {
        throw new Error(response?.data?.ERROR_DESCRIPTION || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!productFormData.name || !productFormData.price || !productFormData.category) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields (Name, Price, Category)',
      });
      return;
    }

    if (!productFormData.imageFile && !productFormData.image) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please upload an image',
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = productFormData.image;

      // If a new file is selected, upload it to Cloudinary
      if (productFormData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(productFormData.imageFile, "products");
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

      const response = await productApi.createProduct({
        name: productFormData.name,
        description: productFormData.description || null,
        price: parseFloat(productFormData.price),
        original_price: productFormData.original_price ? parseFloat(productFormData.original_price) : null,
        image: imageUrl,
        category: productFormData.category,
        label: productFormData.label || null,
        stock_quantity: productFormData.stock_quantity ? parseInt(productFormData.stock_quantity) : 0,
      });

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
      image: product.image || "",
      imageFile: null,
      category: product.category || "",
      label: product.label || "",
      stock_quantity: product.stock_quantity || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = productFormData.image;

      // If a new file is selected, upload it to Cloudinary
      if (productFormData.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(productFormData.imageFile, "products");
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

      const response = await productApi.updateProduct(editingProduct._id, {
        name: productFormData.name,
        description: productFormData.description || null,
        price: parseFloat(productFormData.price),
        original_price: productFormData.original_price ? parseFloat(productFormData.original_price) : null,
        image: imageUrl,
        category: productFormData.category,
        label: productFormData.label || null,
        stock_quantity: productFormData.stock_quantity ? parseInt(productFormData.stock_quantity) : 0,
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
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Admin Dashboard</h2>
                {activeTab === 'products' ? (
                  <button
                    className="btn btn-primary"
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
                      className="feather feather-plus me-2"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                    Add New Product
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
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
                      className="feather feather-plus me-2"
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
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                Categories
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
            </li>
          </ul>

          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <>
              {/* Search Bar */}
              <div className="row mb-4">
                <div className="col-12">
                  <form onSubmit={handleSearch}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search products by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="submit">
                        Search
                      </button>
                      {searchTerm && (
                        <button
                          className="btn btn-outline-secondary"
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
                    </div>
                  </form>
                </div>
              </div>

              {/* Products Table */}
              <div className="row">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      {loading && products.length === 0 ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : products.length === 0 ? (
                        <div className="text-center py-5">
                          <p className="text-muted">No products found</p>
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Category</th>
                                  <th>Price</th>
                                  <th>Stock</th>
                                  <th>Label</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {products.map((product) => (
                                  <tr key={product._id}>
                                    <td>
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/50';
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <strong>{product.name}</strong>
                                      {product.description && (
                                        <div className="text-muted small">{product.description.substring(0, 50)}...</div>
                                      )}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>
                                      <strong>Rs {product.price}</strong>
                                      {product.original_price && product.original_price > product.price && (
                                        <div className="text-muted small text-decoration-line-through">
                                          Rs {product.original_price}
                                        </div>
                                      )}
                                    </td>
                                    <td>{product.stock_quantity || 0}</td>
                                    <td>
                                      {product.label && (
                                        <span className={`badge ${
                                          product.label === 'Sale' ? 'bg-danger' :
                                          product.label === 'Hot' ? 'bg-warning' :
                                          'bg-info'
                                        }`}>
                                          {product.label}
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button
                                          className="btn btn-sm btn-outline-primary"
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
                                          className="btn btn-sm btn-outline-danger"
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
                            <nav aria-label="Page navigation" className="mt-4">
                              <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                  <button
                                    type="button"
                                    className="page-link"
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
                                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button
                                          type="button"
                                          className="page-link"
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
                                      <li key={page} className="page-item disabled">
                                        <span className="page-link">...</span>
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                  <button
                                    type="button"
                                    className="page-link"
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
              </div>
            </>
          )}

          {/* Categories Tab Content */}
          {activeTab === 'categories' && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    {loading && categories.length === 0 ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-muted">No categories found</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => (
                              <tr key={category._id}>
                                <td>
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/50';
                                    }}
                                  />
                                </td>
                                <td>
                                  <strong>{category.name}</strong>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
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
                                      className="btn btn-sm btn-outline-danger"
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
            </div>
          )}

          {/* Orders Tab Content */}
          {activeTab === 'orders' && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    {ordersLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-muted">No orders found</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Order Number</th>
                              <th>Customer</th>
                              <th>Items</th>
                              <th>Total</th>
                              <th>Payment Method</th>
                              <th>Payment Status</th>
                              <th>Order Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td>
                                  <strong>{order.order_number || `#${order._id.toString().slice(-6)}`}</strong>
                                </td>
                                <td>
                                  {order.user_id && typeof order.user_id === 'object' ? (
                                    <div>
                                      <div><strong>{order.user_id.name || 'N/A'}</strong></div>
                                      <small className="text-muted">{order.user_id.email || ''}</small>
                                    </div>
                                  ) : order.shipping_address ? (
                                    <div>
                                      <div><strong>{order.shipping_address.name || 'N/A'}</strong></div>
                                      <small className="text-muted">{order.shipping_address.email || ''}</small>
                                      {order.shipping_address.phone && (
                                        <div className="small text-muted">{order.shipping_address.phone}</div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted">N/A</span>
                                  )}
                                </td>
                                <td>
                                  <div>
                                    {order.items && order.items.length > 0 ? (
                                      <>
                                        {order.items.slice(0, 2).map((item, idx) => (
                                          <div key={idx} className="small">
                                            {typeof item.product_id === 'object' && item.product_id ? item.product_id.name : item.name} x {item.quantity}
                                          </div>
                                        ))}
                                        {order.items.length > 2 && (
                                          <div className="small text-muted">+{order.items.length - 2} more</div>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-muted">No items</span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <strong>Rs {order.total?.toFixed(2) || '0.00'}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-info text-capitalize">
                                    {order.payment_method || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${
                                    order.payment_status === 'completed' ? 'bg-success' :
                                    order.payment_status === 'pending' ? 'bg-warning' :
                                    order.payment_status === 'failed' ? 'bg-danger' :
                                    'bg-secondary'
                                  }`}>
                                    {order.payment_status || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${
                                    order.order_status === 'completed' ? 'bg-success' :
                                    order.order_status === 'processing' ? 'bg-primary' :
                                    order.order_status === 'pending' ? 'bg-warning' :
                                    order.order_status === 'cancelled' ? 'bg-danger' :
                                    'bg-secondary'
                                  }`}>
                                    {order.order_status || 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <small>
                                    {order.created_at ? new Date(order.created_at * 1000).toLocaleDateString() : 'N/A'}
                                  </small>
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
            </div>
          )}
        </div>
      </section>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setShowAddModal(false);
            resetProductForm();
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    resetProductForm();
                  }}
                />
              </div>
              <form onSubmit={handleAddProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Product Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={productFormData.description}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Original Price (for discount)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="original_price"
                        value={productFormData.original_price}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Product Image <span className="text-danger">*</span></label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleProductImageChange}
                        required
                      />
                      <small className="form-text text-muted">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                      </small>
                      {productFormData.image && (
                        <div className="mt-2">
                          <img
                            src={productFormData.image}
                            alt="Preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="category"
                        value={productFormData.category}
                        onChange={handleProductInputChange}
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
                    <div className="col-md-6">
                      <label className="form-label">Label</label>
                      <select
                        className="form-select"
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
                    <div className="col-12">
                      <label className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock_quantity"
                        value={productFormData.stock_quantity}
                        onChange={handleProductInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      resetProductForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
                    {loading || uploadingImage ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setShowEditModal(false);
            setEditingProduct(null);
            resetProductForm();
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                />
              </div>
              <form onSubmit={handleUpdateProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Product Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={productFormData.name}
                        onChange={handleProductInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={productFormData.description}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={productFormData.price}
                        onChange={handleProductInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Original Price (for discount)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="original_price"
                        value={productFormData.original_price}
                        onChange={handleProductInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleProductImageChange}
                      />
                      <small className="form-text text-muted">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB). Leave empty to keep current image.
                      </small>
                      {productFormData.image && (
                        <div className="mt-2">
                          <img
                            src={productFormData.image}
                            alt="Preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="category"
                        value={productFormData.category}
                        onChange={handleProductInputChange}
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
                    <div className="col-md-6">
                      <label className="form-label">Label</label>
                      <select
                        className="form-select"
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
                    <div className="col-12">
                      <label className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="stock_quantity"
                        value={productFormData.stock_quantity}
                        onChange={handleProductInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
                    {loading || uploadingImage ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setShowAddCategoryModal(false);
            resetCategoryForm();
          }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    resetCategoryForm();
                  }}
                />
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Category Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Category Image <span className="text-danger">*</span></label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleCategoryImageChange}
                        required
                      />
                      <small className="form-text text-muted">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                      </small>
                      {categoryFormData.image && (
                        <div className="mt-2">
                          <img
                            src={categoryFormData.image}
                            alt="Preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddCategoryModal(false);
                      resetCategoryForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
                    {loading || uploadingImage ? 'Creating...' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && editingCategory && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setShowEditCategoryModal(false);
            setEditingCategory(null);
            resetCategoryForm();
          }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setEditingCategory(null);
                    resetCategoryForm();
                  }}
                />
              </div>
              <form onSubmit={handleUpdateCategory}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Category Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Category Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleCategoryImageChange}
                      />
                      <small className="form-text text-muted">
                        Supported formats: JPEG, PNG, GIF, WebP (Max 5MB). Leave empty to keep current image.
                      </small>
                      {categoryFormData.image && (
                        <div className="mt-2">
                          <img
                            src={categoryFormData.image}
                            alt="Preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditCategoryModal(false);
                      setEditingCategory(null);
                      resetCategoryForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading || uploadingImage}>
                    {loading || uploadingImage ? 'Updating...' : 'Update Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
