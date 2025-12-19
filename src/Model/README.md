# Model Layer - API Definitions

This directory contains all API endpoint definitions following the MVVM architecture pattern.

## Directory Structure

```
Model/
├── BaseUri.js          # Base URL configuration
├── base.js             # Axios instances with interceptors
└── Data/               # API modules by feature
    ├── User/
    │   └── User.js     # User API endpoints
    └── Product/
        └── Product.js  # Product API endpoints
```

## Usage

### Import API Services

```javascript
// Import user API
import userApi from '../Model/Data/User/User';

// Import product API
import productApi from '../Model/Data/Product/Product';
```

### Example: Register User

```javascript
import userApi from '../Model/Data/User/User';

const handleRegister = async (userData) => {
  try {
    const response = await userApi.registerUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      address: userData.address,
    });
    
    if (response.status === 201 && response.data.STATUS === "SUCCESSFUL") {
      // Save token to localStorage
      localStorage.setItem('jwt', response.data.DB_DATA.token);
      localStorage.setItem('user', JSON.stringify(response.data.DB_DATA.user));
      return { success: true, data: response.data.DB_DATA };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.response?.data?.ERROR_DESCRIPTION || error.message };
  }
};
```

### Example: Login User

```javascript
import userApi from '../Model/Data/User/User';

const handleLogin = async (email, password) => {
  try {
    const response = await userApi.loginUser({
      email: email,
      password: password,
    });
    
    if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
      // Save token to localStorage
      localStorage.setItem('jwt', response.data.DB_DATA.token);
      localStorage.setItem('user', JSON.stringify(response.data.DB_DATA.user));
      return { success: true, data: response.data.DB_DATA };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.response?.data?.ERROR_DESCRIPTION || error.message };
  }
};
```

### Example: Get Products

```javascript
import productApi from '../Model/Data/Product/Product';

const getProducts = async (page = 1, category = null) => {
  try {
    const response = await productApi.getAllProducts({
      page: page,
      limit: 50,
      category: category,
      sort_by: 'newest',
    });
    
    if (response.status === 200 && response.data.STATUS === "SUCCESSFUL") {
      return { success: true, data: response.data.DB_DATA };
    }
  } catch (error) {
    console.error('Get products error:', error);
    return { success: false, error: error.message };
  }
};
```

## Axios Instances

### axiosInstance
- Main instance for regular API calls
- Automatically adds JWT token from localStorage
- Handles 401 errors (redirects to login)

### axiosInstanceFile
- For file uploads with progress tracking
- Uses multipart/form-data content type
- Longer timeout (60 seconds)

## Authentication

JWT tokens are automatically added to all requests via interceptors. The token is retrieved from `localStorage.getItem('jwt')`.

If a 401 error occurs, the interceptor will:
1. Clear the token from localStorage
2. Clear user data
3. Redirect to `/MyAccountSignIn`

## Base URL

The base URL is configured in `BaseUri.js`:
- Development: `http://localhost:6160`
- Update this file for production environment

