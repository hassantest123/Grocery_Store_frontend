# Empleado v3 - Architecture & Code Structure Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Pattern](#architecture-pattern)
4. [Folder Structure](#folder-structure)
5. [State Management](#state-management)
6. [API Communication Flow](#api-communication-flow)
7. [Authentication & Authorization](#authentication--authorization)
8. [Routing Structure](#routing-structure)
9. [Code Standards & Best Practices](#code-standards--best-practices)
10. [Development Workflow](#development-workflow)

---

## Project Overview

**Empleado v3** is a comprehensive HR Management System built with React. The application follows a **Model-ViewModel-View (MVVM)** architectural pattern with centralized state management using Zustand.

### Key Features
- Employee Management
- Attendance Tracking
- Payroll Management
- Performance Reviews
- Leave Planning
- Shift Management
- HR Policies
- Recruitment & Hiring
- Notes & Documentation
- Expense Management

---

## Technology Stack

### Core Technologies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.17.0",
  "zustand": "^4.4.3",
  "axios": "^1.6.1",
  "jwt-decode": "^4.0.0"
}
```

### UI Libraries
- **@material-tailwind/react**: Component library
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **react-icons**: Icon components

### Data Visualization
- **chart.js** & **react-chartjs-2**: Charts and graphs
- **recharts**: Additional charting library

### Form Management
- **react-hook-form**: Form state management
- **yup**: Schema validation

### Additional Libraries
- **react-toastify**: Toast notifications
- **date-fns**: Date manipulation
- **xlsx**: Excel file handling
- **jspdf**: PDF generation

---

## Architecture Pattern

### MVVM (Model-ViewModel-View) Pattern

```
┌─────────────────────────────────────────────────────────┐
│                        VIEW LAYER                        │
│         (React Components in src/View/)                  │
│  - Renders UI                                            │
│  - Handles user interactions                             │
│  - Consumes ViewModel functions & state                  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Uses Zustand Store
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   VIEWMODEL LAYER                        │
│         (Business Logic in src/ViewModel/)               │
│  - State management                                      │
│  - Business logic processing                             │
│  - Data transformation                                   │
│  - Calls Model API functions                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Calls API
                        │
┌───────────────────────▼─────────────────────────────────┐
│                      MODEL LAYER                         │
│          (API calls in src/Model/Data/)                  │
│  - HTTP request definitions                              │
│  - Axios instance management                             │
│  - API endpoint definitions                              │
│  - Raw data fetching                                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTP Requests
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    BACKEND APIs                          │
│  - Multiple microservices                                │
│  - Different base URLs                                   │
│  - RESTful endpoints                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
empleado_dev_v1/
│
├── public/                          # Static files
│   ├── index.html
│   ├── emp-logo.ico
│   └── *.xlsx                       # Excel templates
│
├── src/
│   ├── App.jsx                      # Main application component
│   ├── index.jsx                    # Application entry point
│   ├── index.css                    # Global styles
│   │
│   ├── Authentication/              # Authentication utilities
│   │   ├── jwt_decode.js           # JWT token decoding
│   │   ├── localStorageServices.js # localStorage management
│   │   └── expirationJWT.js        # Token expiration handling
│   │
│   ├── Model/                       # DATA LAYER (API Definitions)
│   │   ├── base.js                 # Axios instances configuration
│   │   ├── BaseUri.js              # API base URLs
│   │   └── Data/                   # API modules by feature
│   │       ├── Employees/
│   │       │   └── Employees.js    # Employee API endpoints
│   │       ├── Dashboard/
│   │       │   └── Dashboard.js    # Dashboard API endpoints
│   │       ├── Attendance/
│   │       ├── Payroll/
│   │       ├── Performance/
│   │       └── ...                 # Other modules
│   │
│   ├── ViewModel/                   # BUSINESS LOGIC LAYER
│   │   ├── EmployeeViewModel/
│   │   │   └── Employees.js        # Employee business logic
│   │   ├── DashboardViewModel/
│   │   │   └── Dashboard.js        # Dashboard business logic
│   │   ├── AttendanceViewModel/
│   │   ├── PayrollViewModel/
│   │   └── ...                     # Other ViewModels
│   │
│   ├── View/                        # PRESENTATION LAYER (UI Components)
│   │   ├── Employees/
│   │   │   ├── Employees.jsx       # Main employees component
│   │   │   ├── AllEmployess.jsx
│   │   │   ├── AddNewEmployee.jsx
│   │   │   └── ...
│   │   ├── Dashoboard/
│   │   │   └── Dashboard.jsx       # Dashboard UI
│   │   ├── Attendance/
│   │   ├── Payroll/
│   │   └── ...                     # Other views
│   │
│   ├── Components/                  # Reusable UI components
│   │   ├── Header/
│   │   ├── SideMenu/
│   │   ├── CustomButton/
│   │   ├── CustomDialog/
│   │   ├── CustomDrawer/
│   │   ├── Toaster/
│   │   └── ...                     # Other components
│   │
│   ├── Store/                       # STATE MANAGEMENT
│   │   └── store.js                # Zustand store configuration
│   │
│   ├── Routers/                     # ROUTING
│   │   ├── index.js
│   │   └── Routers.jsx             # Route definitions
│   │
│   ├── services/                    # UTILITY SERVICES
│   │   ├── __axiosInterceptors.js  # HTTP interceptors
│   │   ├── __authErrorHandler.js   # Auth error handling
│   │   ├── __dateTimeServices.js   # Date utilities
│   │   ├── __apiManager.js
│   │   └── ...                     # Other utilities
│   │
│   ├── hooks/                       # CUSTOM REACT HOOKS
│   │   ├── useAuthReady.js
│   │   ├── useProfileCompletion.js
│   │   └── ...
│   │
│   ├── Validation/                  # FORM VALIDATION
│   │   ├── Validation.js
│   │   └── CustomValidation.js
│   │
│   ├── Theme/                       # THEME CONFIGURATION
│   │   └── Theme.js
│   │
│   └── assets/                      # STATIC ASSETS
│       ├── images/
│       └── template/
│
├── package.json                     # Dependencies
├── tailwind.config.js              # Tailwind configuration
└── README.md                        # Project README
```

### Key Folder Descriptions

#### 1. **Model Layer** (`src/Model/`)
- **Purpose**: Defines all API calls and HTTP request configurations
- **Responsibilities**:
  - Configure Axios instances for different microservices
  - Define API endpoint URLs
  - Make HTTP requests (GET, POST, PUT, DELETE, PATCH)
  - Return raw API responses

**Example Structure**:
```
Model/
├── base.js                    # Axios instances with auth headers
├── BaseUri.js                 # All base URL constants
└── Data/
    └── Employees/
        └── Employees.js       # Employee API functions
```

#### 2. **ViewModel Layer** (`src/ViewModel/`)
- **Purpose**: Contains business logic and state management
- **Responsibilities**:
  - Call Model API functions
  - Transform API data
  - Manage component state
  - Handle business logic
  - Update Zustand store

**Example Structure**:
```
ViewModel/
└── EmployeeViewModel/
    └── Employees.js           # Employee business logic
```

#### 3. **View Layer** (`src/View/`)
- **Purpose**: UI components that render the interface
- **Responsibilities**:
  - Render UI elements
  - Handle user interactions
  - Consume ViewModel state and functions
  - Display data

**Example Structure**:
```
View/
└── Employees/
    ├── Employees.jsx          # Main container
    ├── AllEmployess.jsx       # List view
    └── AddNewEmployee.jsx     # Add form
```

---

## State Management

### Zustand Store Architecture

Empleado uses **Zustand** for centralized state management. The store is composed of multiple ViewModel modules.

#### Store Configuration (`src/Store/store.js`)

```javascript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Import all ViewModels
import dashboardViewModel from "../ViewModel/DashboardViewModel/Dashboard";
import employeeViewModel from "../ViewModel/EmployeeViewModel/Employees";
import attendanceViewModel from "../ViewModel/AttendanceViewModel/Attendance";
// ... other ViewModels

const useStore = create(
  devtools((set, get) => ({
    // Authentication state
    isAuthenticated: false,
    isAuthLoading: true,
    setAuthenticationState: (isAuthenticated, isAuthLoading = false) => 
      set({ isAuthenticated, isAuthLoading }),
    
    // Spread all ViewModel functions
    ...dashboardViewModel(set, get),
    ...employeeViewModel(set, get),
    ...attendanceViewModel(set, get),
    // ... other ViewModels
  }))
);

export default useStore;
```

### Zustand State Pattern

Each ViewModel follows this pattern:

```javascript
// ViewModel: src/ViewModel/EmployeeViewModel/Employees.js
import employeesApi from "../../Model/Data/Employees/Employees";

const employeeViewModel = (set, get) => ({
  // STATE VARIABLES
  allEmployees: [],
  isLoadingEmployees: false,
  
  // STATE FUNCTIONS (Actions)
  getEmployeesList: async () => {
    set({ isLoadingEmployees: true });
    
    try {
      // Call Model API
      const response = await employeesApi.gettingAllEmployees();
      const data = response.data;
      
      // Update state
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        set({ 
          allEmployees: data.DB_DATA, 
          isLoadingEmployees: false 
        });
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      set({ isLoadingEmployees: false });
    }
  },
  
  // Filter function example
  searchEmployees: (name) => {
    const lowercaseName = name.toLowerCase();
    const allEmployees = get().allEmployees;
    
    const filteredEmployees = allEmployees.filter((employee) =>
      employee.data.name.toLowerCase().includes(lowercaseName)
    );
    
    set({ allEmployees: filteredEmployees });
  },
});

export default employeeViewModel;
```

### Using Zustand Store in Components

```javascript
// View: src/View/Employees/AllEmployess.jsx
import React, { useEffect } from "react";
import useStore from "../../Store/store";

const AllEmployees = () => {
  // Select specific state and functions from store
  const allEmployees = useStore((state) => state.allEmployees);
  const isLoadingEmployees = useStore((state) => state.isLoadingEmployees);
  const getEmployeesList = useStore((state) => state.getEmployeesList);
  const searchEmployees = useStore((state) => state.searchEmployees);
  
  // Fetch data on component mount
  useEffect(() => {
    getEmployeesList();
  }, [getEmployeesList]);
  
  // Handle search
  const handleSearch = (event) => {
    searchEmployees(event.target.value);
  };
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Search employees..." 
        onChange={handleSearch} 
      />
      
      {isLoadingEmployees ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {allEmployees.map((emp) => (
            <li key={emp.id}>{emp.data.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllEmployees;
```

---

## API Communication Flow

### Complete Flow: View → ViewModel → Model → API

#### Step 1: Model Layer - Define API Endpoint

**File**: `src/Model/Data/Employees/Employees.js`

```javascript
import axiosInstance, { axiosInstancecoremodule } from "../../base";

const employeesApi = {
  // GET request
  gettingAllEmployees: function () {
    return axiosInstancecoremodule.request({
      method: 'GET',
      url: '/api/v1/employees',
      params: {
        page: 1,
        status: 'active'
      }
    });
  },
  
  // POST request
  RegisterEmp: function (data) {
    return axiosInstancecoremodule.request({
      method: 'POST',
      url: '/api/v1/employees',
      data: {
        ...data
      }
    });
  },
  
  // PUT request
  updateEmployee: function (employeeId, data) {
    return axiosInstancecoremodule.request({
      method: 'PUT',
      url: `/api/v1/employees/${employeeId}`,
      data: data
    });
  },
  
  // DELETE request
  deleteEmployee: function (employeeId) {
    return axiosInstancecoremodule.request({
      method: 'DELETE',
      url: `/api/v1/employees/${employeeId}`
    });
  }
};

export default employeesApi;
```

#### Step 2: ViewModel Layer - Business Logic

**File**: `src/ViewModel/EmployeeViewModel/Employees.js`

```javascript
import employeesApi from "../../Model/Data/Employees/Employees";

const employeeViewModel = (set, get) => ({
  // State
  allEmployees: [],
  copyAllEmployees: [],
  isLoadingEmployees: false,
  
  // GET - Fetch all employees
  getEmployeesList: async () => {
    set({ isLoadingEmployees: true });
    
    try {
      const response = await employeesApi.gettingAllEmployees();
      const data = response.data;
      
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        set({ 
          allEmployees: data.DB_DATA,
          copyAllEmployees: data.DB_DATA,  // Keep original copy
          isLoadingEmployees: false
        });
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      set({ isLoadingEmployees: false });
    }
  },
  
  // POST - Add new employee
  addNewEmployee: async (employeeData) => {
    set({ isLoadingEmployees: true });
    
    try {
      const response = await employeesApi.RegisterEmp(employeeData);
      const data = response.data;
      
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        // Refresh employee list after adding
        await get().getEmployeesList();
        return { success: true, data: data.DB_DATA };
      } else {
        return { success: false, error: data.ERROR_DESCRIPTION };
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      return { success: false, error: err.message };
    } finally {
      set({ isLoadingEmployees: false });
    }
  },
  
  // PUT - Update employee
  updateEmployee: async (employeeId, employeeData) => {
    set({ isLoadingEmployees: true });
    
    try {
      const response = await employeesApi.updateEmployee(employeeId, employeeData);
      const data = response.data;
      
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        // Update local state
        const updatedEmployees = get().allEmployees.map(emp => 
          emp.id === employeeId ? { ...emp, ...data.DB_DATA } : emp
        );
        
        set({ 
          allEmployees: updatedEmployees,
          copyAllEmployees: updatedEmployees,
          isLoadingEmployees: false
        });
        
        return { success: true, data: data.DB_DATA };
      } else {
        return { success: false, error: data.ERROR_DESCRIPTION };
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      return { success: false, error: err.message };
    } finally {
      set({ isLoadingEmployees: false });
    }
  },
  
  // DELETE - Delete employee
  deleteEmployee: async (employeeId) => {
    set({ isLoadingEmployees: true });
    
    try {
      const response = await employeesApi.deleteEmployee(employeeId);
      const data = response.data;
      
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        // Remove from local state
        const filteredEmployees = get().allEmployees.filter(
          emp => emp.id !== employeeId
        );
        
        set({ 
          allEmployees: filteredEmployees,
          copyAllEmployees: filteredEmployees,
          isLoadingEmployees: false
        });
        
        return { success: true };
      } else {
        return { success: false, error: data.ERROR_DESCRIPTION };
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      return { success: false, error: err.message };
    } finally {
      set({ isLoadingEmployees: false });
    }
  },
  
  // Local state manipulation (no API call)
  searchEmployees: (searchTerm) => {
    if (searchTerm.trim() === '') {
      set({ allEmployees: get().copyAllEmployees });
    } else {
      const lowercaseTerm = searchTerm.toLowerCase();
      const filtered = get().copyAllEmployees.filter(employee =>
        employee.data.name.toLowerCase().includes(lowercaseTerm)
      );
      set({ allEmployees: filtered });
    }
  }
});

export default employeeViewModel;
```

#### Step 3: View Layer - UI Component

**File**: `src/View/Employees/AllEmployess.jsx`

```javascript
import React, { useEffect, useState } from "react";
import useStore from "../../Store/store";
import { showToast } from "../../Components/Toaster/Toaster";

const AllEmployees = () => {
  // Select state from Zustand store
  const allEmployees = useStore((state) => state.allEmployees);
  const isLoadingEmployees = useStore((state) => state.isLoadingEmployees);
  
  // Select actions from Zustand store
  const getEmployeesList = useStore((state) => state.getEmployeesList);
  const addNewEmployee = useStore((state) => state.addNewEmployee);
  const updateEmployee = useStore((state) => state.updateEmployee);
  const deleteEmployee = useStore((state) => state.deleteEmployee);
  const searchEmployees = useStore((state) => state.searchEmployees);
  
  // Local component state
  const [showAddForm, setShowAddForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    department: ''
  });
  
  // Fetch employees on mount
  useEffect(() => {
    getEmployeesList();
  }, [getEmployeesList]);
  
  // Handle search
  const handleSearch = (event) => {
    searchEmployees(event.target.value);
  };
  
  // Handle add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    const result = await addNewEmployee(employeeData);
    
    if (result.success) {
      showToast("Employee added successfully", "success");
      setShowAddForm(false);
      setEmployeeData({ name: '', email: '', department: '' });
    } else {
      showToast(result.error || "Failed to add employee", "error");
    }
  };
  
  // Handle update employee
  const handleUpdateEmployee = async (employeeId, updatedData) => {
    const result = await updateEmployee(employeeId, updatedData);
    
    if (result.success) {
      showToast("Employee updated successfully", "success");
    } else {
      showToast(result.error || "Failed to update employee", "error");
    }
  };
  
  // Handle delete employee
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const result = await deleteEmployee(employeeId);
      
      if (result.success) {
        showToast("Employee deleted successfully", "success");
      } else {
        showToast(result.error || "Failed to delete employee", "error");
      }
    }
  };
  
  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Employees</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
      </div>
      
      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          onChange={handleSearch}
          className="border px-4 py-2 rounded w-full"
        />
      </div>
      
      {/* Add Employee Form */}
      {showAddForm && (
        <form onSubmit={handleAddEmployee} className="mb-4 p-4 border rounded">
          <h2 className="text-xl mb-2">Add New Employee</h2>
          <input
            type="text"
            placeholder="Name"
            value={employeeData.name}
            onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
            className="border px-4 py-2 rounded w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={employeeData.email}
            onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
            className="border px-4 py-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={employeeData.department}
            onChange={(e) => setEmployeeData({...employeeData, department: e.target.value})}
            className="border px-4 py-2 rounded w-full mb-2"
            required
          />
          <button 
            type="submit" 
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      )}
      
      {/* Employee List */}
      {isLoadingEmployees ? (
        <div className="text-center py-8">
          <p>Loading employees...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allEmployees.map((employee) => (
            <div key={employee.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{employee.data.name}</h3>
              <p className="text-gray-600">{employee.data.email}</p>
              <p className="text-gray-500">{employee.data.department}</p>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleUpdateEmployee(employee.id, { status: 'inactive' })}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
```

---

## Authentication & Authorization

### Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    1. User Login                         │
│             (External Auth System)                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ JWT Token (URL param)
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    2. App.jsx                            │
│  - Check URL params for token                            │
│  - Save token to localStorage                            │
│  - Decode JWT and extract user data                      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Token saved
                        │
┌───────────────────────▼─────────────────────────────────┐
│              3. Axios Interceptors                       │
│  - Attach token to all API requests                      │
│  - Handle 401/403 errors                                 │
│  - Auto-refresh or redirect to login                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ Authorized requests
                        │
┌───────────────────────▼─────────────────────────────────┐
│              4. Protected Routes                         │
│  - Check authentication state                            │
│  - Role-based route rendering                            │
│  - Redirect unauthenticated users                        │
└─────────────────────────────────────────────────────────┘
```

### JWT Token Management

#### Token Extraction & Storage

**File**: `src/App.jsx`

```javascript
useEffect(() => {
  const processAuthentication = async () => {
    try {
      // Check localStorage first
      let jwtToken = getLocalStorage();
      
      // Check URL params if no token in localStorage
      const currentUrl = window.location;
      const urlParams = new URLSearchParams(currentUrl.search);
      const tokenFromUrl = urlParams.get("token");
      
      // Save token from URL to localStorage
      if (!jwtToken && tokenFromUrl) {
        localStorage.setItem("jwt", tokenFromUrl);
        jwtToken = tokenFromUrl;
      }
      
      if (!jwtToken) {
        // No token found - redirect to login
        setAuthenticationState(false, false);
        if (!isLoginRoute) {
          navigate('/login');
        }
      } else {
        // Decode and save JWT data
        const decoded = jwtDecode(jwtToken);
        
        // Save all JWT fields to localStorage
        for (const key in decoded) {
          if (decoded.hasOwnProperty(key)) {
            settingLocalStorage(key, decoded[key]);
          }
        }
        
        // Clean up URL
        window.history.replaceState(
          {}, 
          document.title, 
          currentUrl.origin + currentUrl.pathname
        );
        
        // Set authentication state
        setAuthenticationState(true, false);
        
        // Initialize authentication check
        if (!isLoginRoute) {
          checkAuthentication();
          getUserDataFromToken();
        }
        
        // Set up JWT expiration check (every minute)
        const interval = setInterval(expireJwtLocalStorage, 60000);
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('Authentication processing error:', error);
      setAuthenticationState(false, false);
      if (!isLoginRoute) {
        navigate('/login');
      }
    }
  };
  
  processAuthentication();
}, [setAuthenticationState, navigate, isLoginRoute]);
```

#### Token Decoding

**File**: `src/Authentication/jwt_decode.js`

```javascript
import { jwtDecode } from 'jwt-decode';

const getToken = () => {
  return localStorage.getItem('jwt');
};

const decodeToken = () => {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserData = () => {
  const decoded = decodeToken();
  if (!decoded) return null;
  
  return {
    org_id: decoded?.org_id || 0,
    org_name: decoded.role_id || "Admin",
    email: decoded.user_email || "",
    org_oneid: decoded.org_oneid,
    oneid: decoded.oneid,
    fullUsername: decoded.user_full_name,
    userEmail: decoded.user_email,
    fullDp: decoded.full_dp,
    roleId: decoded.role_id,       // "Admin" or "Employee"
    roleDbId: decoded.role_db_id,
    otherPermissions: decoded.other_permissions,
    oneIdRolePermissions: decoded.oneid_role_permissions
  };
};

export const isTokenValid = () => {
  const decoded = decodeToken();
  if (!decoded) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
};
```

### Axios Interceptors

#### Request Interceptor (Add Token)

**File**: `src/services/__axiosInterceptors.js`

```javascript
export const setupAuthInterceptor = (axiosInstance, instanceName = 'Unknown') => {
  // Request interceptor - add fresh token to every request
  axiosInstance.interceptors.request.use(
    (config) => {
      // Get fresh token from localStorage
      const token = localStorage.getItem('jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      console.error(`Request error in ${instanceName}:`, error);
      return Promise.reject(error);
    }
  );
  
  // Response interceptor - handle auth errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if this is an authentication error
      if (authErrorHandler.isAuthenticationError(error)) {
        return authErrorHandler.handleAuthError(error, error.config);
      }
      
      return Promise.reject(error);
    }
  );
};
```

#### Auth Error Handler

**File**: `src/services/__authErrorHandler.js`

```javascript
class AuthErrorHandler {
  constructor() {
    this.isRedirecting = false;
    this.authErrorCodes = [
      'VTWE-401002',              // Invalid or expired token
      'USER_NOT_AUTHENTICATED',
      'TOKEN_EXPIRED',
      'INVALID_TOKEN',
      'UNAUTHORIZED'
    ];
  }
  
  isAuthenticationError(error) {
    if (!error || !error.response) return false;
    
    const { status, data } = error.response;
    
    // Check for specific error codes
    if (data && typeof data === 'object') {
      const errorCode = data.ERROR_CODE || data.error_code;
      const errorFilter = data.ERROR_FILTER || data.error_filter;
      
      if (errorCode && this.authErrorCodes.includes(errorCode)) {
        return true;
      }
      
      if (errorFilter && this.authErrorCodes.includes(errorFilter)) {
        return true;
      }
    }
    
    // Check HTTP status codes
    if (status === 401 || status === 403) {
      // Verify token is actually expired
      if (!this.isTokenValid()) {
        return true;
      }
    }
    
    return false;
  }
  
  handleAuthError(error, config = {}) {
    console.warn('Authentication error detected:', {
      url: config.url || 'Unknown',
      status: error.response?.status,
      errorCode: error.response?.data?.ERROR_CODE
    });
    
    // Show error message
    this.showAuthErrorMessage(error);
    
    // Redirect to login
    this.redirectToLogin();
    
    return Promise.reject(error);
  }
  
  redirectToLogin(reason = 'Session expired') {
    if (this.isRedirecting) return;
    
    this.isRedirecting = true;
    this.clearAuthData();
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }
  
  clearAuthData() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('org_oneid');
    localStorage.removeItem('oneid');
    localStorage.removeItem('user_email');
    // Clear other auth-related items
  }
}

const authErrorHandler = new AuthErrorHandler();
export default authErrorHandler;
```

### Role-Based Routing

**File**: `src/Routers/Routers.jsx`

```javascript
import React from "react";
import { Routes, Route } from "react-router-dom";
import { getUserData } from "../Authentication/jwt_decode";

const Routers = () => {
  // Get role from JWT token
  const userData = getUserData();
  const authRole = userData?.roleId || 'Employee';  // "Admin" or "Employee"
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/login" element={<Login />} />
      
      {/* Role-based Dashboard */}
      {authRole === "Admin" ? (
        <Route exact path="/" element={<Dashboard />} />
      ) : (
        <Route exact path="/" element={<EmployeeDashboard />} />
      )}
      
      {/* Admin-only Routes */}
      {authRole === "Admin" && (
        <>
          <Route path="/employees/*" element={<Employees />} />
          <Route path="/departments/*" element={<Departments />} />
          <Route path="/payroll/*" element={<Payroll />} />
          {/* ... more admin routes */}
        </>
      )}
      
      {/* Employee-only Routes */}
      {authRole !== "Admin" && (
        <>
          <Route path="/attendance" element={<EmpAttendance />} />
          <Route path="/applications" element={<EmpApplication />} />
          <Route path="/payslip" element={<EmpPayslip />} />
          {/* ... more employee routes */}
        </>
      )}
      
      {/* Common Routes */}
      <Route path="/notices/*" element={<Notices />} />
      <Route path="/performance" element={<Performance />} />
    </Routes>
  );
};

export default Routers;
```

---

## Routing Structure

### Route Organization

The application uses **React Router v6** for navigation.

#### Main Route Structure

```
/                              → Dashboard (Admin) or EmployeeDashboard (Employee)
├── /login                     → Login page (public)
│
├── /dashboard                 → Dashboard
│
├── /employees                 → Employee Management (Admin only)
│   ├── /all_employess         → List all employees
│   ├── /add_emp               → Add new employee
│   ├── /add_bulk_emp          → Bulk employee upload
│   └── /emp_checkList         → Employee checklist
│
├── /departments               → Department Management (Admin only)
│   ├── /manageDept/:id        → Manage specific department
│   ├── /createNewDept/:id     → Create new department
│   └── /edit/:id              → Edit department
│
├── /branches                  → Branch Management (Admin only)
│   └── /create_new_branch     → Create new branch
│
├── /attendance                → Attendance Management
│   ├── (Admin)                → Attendance reports
│   │   ├── /att_report_archive
│   │   ├── /branch_wise_list_rep
│   │   ├── /raw_att_logs
│   │   └── /attendance_adjust_req
│   └── (Employee)             → Employee attendance view
│
├── /payroll                   → Payroll Management (Admin only)
│   ├── /payroll_overview
│   ├── /manage_salary_template
│   ├── /manage_employees_salary
│   ├── /manage_payslip
│   ├── /export_Reports
│   └── /settings
│
├── /notices                   → Notices
│   ├── (Admin)
│   │   ├── /list_notices
│   │   └── /add_notice
│   └── (Employee)
│       └── /list_notices      → View notices only
│
├── /hire                      → Recruitment & Hiring (Admin only)
│   ├── /vacancies_list
│   ├── /talent_pool
│   └── /create_vacancy
│
├── /application               → Leave Applications
│   ├── /application_list
│   └── /new_applications
│
├── /leavesPlanner             → Leave Management
│   ├── /leaves_group
│   └── /public_holiday
│
├── /performance               → Performance Reviews
│   ├── (Admin)
│   │   ├── /goals
│   │   ├── /competency
│   │   ├── /history
│   │   └── /feedback
│   └── (Employee)             → Employee performance view
│
├── /notespool                 → Notes & Documentation
│   ├── /                      → My notebooks
│   ├── /mysharednotebooks
│   ├── /sharednotebooks
│   └── /starrednotes          → (Admin only)
│
├── /expense                   → Expense Management
│   ├── (Admin)                → Expense dashboard
│   └── (Employee)             → Submit expenses
│
├── /shiftPlanners             → Shift Planning (Admin only)
│
├── /hrpolicies                → HR Policies (Admin only)
│   ├── /manage_policies
│   ├── /create_new
│   └── /swap_policies
│
├── /formApproval              → Approval Workflows (Admin only)
│   ├── /custom_form
│   └── /approval_flow
│
├── /inbox                     → Inbox/Messages
│
├── /trainingDash              → Training Management
│
├── /settings                  → Settings (Admin only)
│
└── (Employee-specific routes)
    ├── /time-adjustment       → Time adjustment requests
    ├── /applications          → Leave applications
    ├── /payslip               → View payslips
    ├── /duties                → Assigned duties
    └── /profile               → Employee profile
```

---

## Code Standards & Best Practices

### 1. API Response Structure

All API responses should follow this structure:

```javascript
{
  "STATUS": "SUCCESSFUL" | "ERROR",
  "DB_DATA": {}, // or []
  "ERROR_CODE": "VTWE-XXXXX",
  "ERROR_FILTER": "ERROR_TYPE",
  "ERROR_DESCRIPTION": "Human-readable error message",
  "MESSAGE": "Success message"
}
```

### 2. Naming Conventions

#### Variables
```javascript
// Use camelCase
const employeeData = {};
const isLoadingEmployees = false;

// Boolean variables should start with "is", "has", "should"
const isAuthenticated = true;
const hasPermission = false;
const shouldRefresh = true;
```

#### Functions
```javascript
// Use camelCase with verb prefix
const getEmployeesList = () => {};
const addNewEmployee = () => {};
const updateEmployeeData = () => {};
const deleteEmployee = () => {};

// API functions
const fetchEmployees = () => {};
const createEmployee = () => {};
```

#### Components
```javascript
// Use PascalCase
const EmployeeList = () => {};
const AddEmployeeForm = () => {};
const CustomButton = () => {};
```

#### Files
```javascript
// Components: PascalCase
EmployeeList.jsx
CustomButton.jsx

// Utilities/Services: camelCase
authenticationServices.js
dateTimeServices.js

// ViewModels: Feature name
Employees.js  // in ViewModel/EmployeeViewModel/
Dashboard.js  // in ViewModel/DashboardViewModel/
```

### 3. Error Handling Pattern

```javascript
// In ViewModel
const getEmployeesList = async () => {
  set({ isLoadingEmployees: true });
  
  try {
    const response = await employeesApi.gettingAllEmployees();
    const data = response.data;
    
    if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
      set({ 
        allEmployees: data.DB_DATA, 
        isLoadingEmployees: false 
      });
      return { success: true, data: data.DB_DATA };
    } else {
      // API returned error
      console.error("API Error:", data.ERROR_DESCRIPTION);
      set({ isLoadingEmployees: false });
      return { 
        success: false, 
        error: data.ERROR_DESCRIPTION || "Unknown error" 
      };
    }
  } catch (err) {
    // Network or other errors
    console.error("Error fetching employees:", err);
    set({ isLoadingEmployees: false });
    return { 
      success: false, 
      error: err.message || "Failed to fetch employees" 
    };
  }
};
```

### 4. Component Structure

```javascript
import React, { useState, useEffect } from "react";
import useStore from "../../Store/store";
import { showToast } from "../../Components/Toaster/Toaster";

/**
 * EmployeeList Component
 * Displays a list of all employees with search and filter functionality
 */
const EmployeeList = () => {
  // ============ ZUSTAND STATE ============
  const allEmployees = useStore((state) => state.allEmployees);
  const isLoadingEmployees = useStore((state) => state.isLoadingEmployees);
  const getEmployeesList = useStore((state) => state.getEmployeesList);
  const searchEmployees = useStore((state) => state.searchEmployees);
  
  // ============ LOCAL STATE ============
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // ============ EFFECTS ============
  useEffect(() => {
    getEmployeesList();
  }, [getEmployeesList]);
  
  // ============ HANDLERS ============
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchEmployees(value);
  };
  
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    // Apply filter logic
  };
  
  // ============ RENDER ============
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee List</h1>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search employees..."
          className="border px-4 py-2 rounded w-full"
        />
      </div>
      
      {/* Employee List */}
      {isLoadingEmployees ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {allEmployees.map((employee) => (
            <div key={employee.id} className="border p-4 rounded">
              <h3>{employee.data.name}</h3>
              <p>{employee.data.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
```

### 5. Constants Management

Store constants in config files:

**File**: `src/Model/BaseUri.js`

```javascript
// Base URLs
export const BASE_URL = 'https://empleado-bk.veevotech.com/';
export const CORE_BASE_URL = 'http://172.18.0.44:6199';
export const HIRE_BASE_URL = 'http://172.18.0.44:6179';
export const Performance_BASE_URL = 'http://172.18.0.44:6061';
export const attendance_url = 'http://172.18.0.34:8005';
export const payroll = 'http://172.18.0.34:8000';

// Organization ID
export const org_id = 10381947;
```

**Usage in config files only**:
```javascript
import { CORE_BASE_URL, org_id } from './BaseUri';
```

### 6. Avoid Code Duplication

Before writing new code:
1. Search for similar functionality in the codebase
2. Check if a utility function already exists
3. Reuse existing API functions
4. Extract common logic into shared utilities

**Example**: Use existing services
```javascript
// ✅ GOOD - Use existing date service
import { toUnixTimeStamp } from '../../services/__dateTimeServices';

const timestamp = toUnixTimeStamp(dateString);

// ❌ BAD - Duplicate date conversion logic
const timestamp = new Date(dateString).getTime() / 1000;
```

### 7. Comment Standards

```javascript
/**
 * Get all employees with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.branch_id - Branch ID to filter by
 * @param {string} filters.status - Employee status (active/inactive)
 * @returns {Promise<Object>} API response with employee data
 */
const getEmployeesWithFilters = async (filters = {}) => {
  // Implementation
};

// Single-line comments for clarification
// This function handles the edge case when...

// TODO: Implement employee search optimization
// FIXME: Fix pagination issue on employee list
```

---

## Development Workflow

### 1. Setting Up New Feature

#### Step 1: Create Model (API Layer)

**File**: `src/Model/Data/[Feature]/[Feature].js`

```javascript
import { axiosInstancecoremodule } from "../../base";

const featureApi = {
  getData: function (params) {
    return axiosInstancecoremodule.request({
      method: 'GET',
      url: '/api/v1/feature',
      params: params
    });
  },
  
  postData: function (data) {
    return axiosInstancecoremodule.request({
      method: 'POST',
      url: '/api/v1/feature',
      data: data
    });
  }
};

export default featureApi;
```

#### Step 2: Create ViewModel (Business Logic)

**File**: `src/ViewModel/[Feature]ViewModel/[Feature].js`

```javascript
import featureApi from "../../Model/Data/Feature/Feature";

const featureViewModel = (set, get) => ({
  // State
  featureData: [],
  isLoadingFeature: false,
  
  // Actions
  getFeatureData: async (params) => {
    set({ isLoadingFeature: true });
    
    try {
      const response = await featureApi.getData(params);
      const data = response.data;
      
      if (response.status === 200 && data.STATUS === "SUCCESSFUL") {
        set({ 
          featureData: data.DB_DATA,
          isLoadingFeature: false
        });
        return { success: true, data: data.DB_DATA };
      }
    } catch (err) {
      console.error("Error fetching feature data:", err);
      return { success: false, error: err.message };
    } finally {
      set({ isLoadingFeature: false });
    }
  }
});

export default featureViewModel;
```

#### Step 3: Register in Store

**File**: `src/Store/store.js`

```javascript
import featureViewModel from "../ViewModel/FeatureViewModel/Feature";

const useStore = create(
  devtools((set, get) => ({
    // ... other ViewModels
    ...featureViewModel(set, get),
  }))
);
```

#### Step 4: Create View (UI Component)

**File**: `src/View/Feature/FeatureList.jsx`

```javascript
import React, { useEffect } from "react";
import useStore from "../../Store/store";

const FeatureList = () => {
  const featureData = useStore((state) => state.featureData);
  const isLoadingFeature = useStore((state) => state.isLoadingFeature);
  const getFeatureData = useStore((state) => state.getFeatureData);
  
  useEffect(() => {
    getFeatureData();
  }, [getFeatureData]);
  
  return (
    <div>
      {isLoadingFeature ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {featureData.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeatureList;
```

#### Step 5: Add Route

**File**: `src/Routers/Routers.jsx`

```javascript
import FeatureList from "../View/Feature/FeatureList";

// Inside Routes component
<Route path="/feature" element={<FeatureList />} />
```

### 2. Debugging Tips

#### Check Authentication
```javascript
// In browser console
localStorage.getItem('jwt')

// Check if token is valid
import { isTokenValid } from './Authentication/jwt_decode';
console.log('Is token valid:', isTokenValid());
```

#### Check Zustand State
```javascript
// In browser console (if Zustand devtools enabled)
window.__ZUSTAND_STORE__

// Or in component
const store = useStore.getState();
console.log('Current state:', store);
```

#### Check API Calls
```javascript
// Network tab in browser DevTools
// Look for:
// - Request headers (Authorization: Bearer token)
// - Response status (200, 401, 403, etc.)
// - Response data structure
```

### 3. Common Issues & Solutions

#### Issue: Token Expired
```javascript
// Solution: Check token expiration in __authErrorHandler.js
// The handler will automatically redirect to login
```

#### Issue: API Call Not Working
```javascript
// 1. Check if axios instance is correct
// 2. Verify base URL in BaseUri.js
// 3. Check API endpoint path
// 4. Verify request method (GET, POST, PUT, DELETE)
// 5. Check request data/params structure
```

#### Issue: State Not Updating
```javascript
// 1. Verify ViewModel is registered in store.js
// 2. Check if set() is being called in ViewModel
// 3. Ensure component is subscribed to correct state
// 4. Check for typos in state variable names
```

---

## Summary

### Key Architectural Points

1. **Three-Layer Architecture**
   - Model (API calls)
   - ViewModel (Business logic + State)
   - View (UI components)

2. **State Management**
   - Centralized Zustand store
   - Multiple ViewModels composed into single store
   - Each ViewModel manages its domain state

3. **API Communication**
   - Multiple Axios instances for different microservices
   - Interceptors for authentication
   - Consistent error handling

4. **Authentication**
   - JWT token from URL params
   - Token stored in localStorage
   - Automatic token injection in requests
   - Auth error detection and handling

5. **Routing**
   - Role-based route rendering
   - Protected routes
   - Nested routes for complex features

### Development Checklist

When adding new features:
- [ ] Create Model API functions
- [ ] Create ViewModel with state and actions
- [ ] Register ViewModel in store.js
- [ ] Create View components
- [ ] Add routes in Routers.jsx
- [ ] Test API calls
- [ ] Handle errors appropriately
- [ ] Add loading states
- [ ] Implement user feedback (toasts)

---

## Conclusion

This documentation provides a comprehensive guide to the Empleado v3 codebase structure. Use this as a reference when:
- Onboarding new developers
- Implementing new features
- Debugging issues
- Understanding data flow
- Making architectural decisions

For questions or clarifications, refer to specific code files mentioned in examples throughout this document.

**Last Updated**: Sunday, October 26, 2025

