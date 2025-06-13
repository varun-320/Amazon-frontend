import { API_BASE_URL } from '../config/api';

// Generic API call function
const fetchApi = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth functions
export const loginUser = (credentials) => {
    return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const registerUser = (userData) => {
    return fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = (email) => {
    return fetchApi(`/auth/user/${email}`, {
        method: 'DELETE'
    });
};

// Product functions
export const getProducts = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchApi(`/products?${queryString}`);
};

export const getProduct = (id) => {
    return fetchApi(`/products/${id}`);
};

export const createProduct = async (productData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (key === 'images') {
            if (Array.isArray(productData[key])) {
                productData[key].forEach(image => {
                    if (image instanceof File) {
                        formData.append('images', image);
                    }
                });
            }
        } else {
            formData.append(key, productData[key]);
        }
    });

    console.log('Creating product with data:', {
        ...productData,
        images: productData.images ? `${productData.images.length} images` : 'no images'
    });

    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('Failed to create product:', data);
        throw new Error(data.message || 'Failed to create product');
    }

    return data;
};

export const updateProduct = (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
            productData[key].forEach(image => {
                formData.append('images', image);
            });
        } else {
            formData.append(key, productData[key]);
        }
    });

    return fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
    }).then(res => {
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
    });
};

export const deleteProduct = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    return fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete product');
        }
        return data;
    });
};

export const addReview = (productId, reviewData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    return fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to add review');
        }
        return data;
    });
};

export const updateReview = (productId, reviewId, reviewData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    return fetch(`${API_BASE_URL}/products/${productId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to update review');
        }
        return data;
    });
};

export const deleteReview = (productId, reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    return fetch(`${API_BASE_URL}/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete review');
        }
        return data;
    });
};

// Category functions
export const getCategories = () => {
    return fetchApi('/categories');
};

export const getCategory = (id) => {
    return fetchApi(`/categories/${id}`);
};

export const createCategory = (categoryData) => {
    return fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
    });
};

export const updateCategory = (categoryId, categoryData) => {
    return fetchApi(`/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    });
};

export const deleteCategory = (categoryId) => {
    return fetchApi(`/categories/${categoryId}`, {
        method: 'DELETE'
    });
};

export const addSubcategory = (categoryId, subcategoryData) => {
    return fetchApi(`/categories/${categoryId}/subcategories`, {
        method: 'POST',
        body: JSON.stringify(subcategoryData)
    });
};

export const getMyOrders = async () => {
    const response = await fetchApi('/orders/my-orders', {
        method: 'GET',
    });
    return response;
};

export const getOrderDetails = async (orderId) => {
    const response = await fetchApi(`/orders/${orderId}`, {
        method: 'GET',
    });
    return response;
};

export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please log in to place an order');
        }

        // Log the request details
        console.log('Creating order with URL:', `${API_BASE_URL}/orders`);
        console.log('Order data:', JSON.stringify(orderData, null, 2));

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Server error response:', data);
            throw new Error(data.message || 'Failed to create order. Please try again.');
        }

        if (!data || !data._id) {
            console.error('Invalid response data:', data);
            throw new Error('Invalid response from server');
        }

        console.log('Order created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error in createOrder:', error);
        throw new Error(error.message || 'Failed to create order. Please try again.');
    }
};

// Admin order functions
export const getAllOrders = async () => {
  const response = await fetchApi('/orders/all', {
    method: 'GET',
  });
  return response;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetchApi(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ orderStatus: status }),
  });
  return response;
};

export const deleteOrder = async (orderId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please log in to delete the order');
    }

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.message || 'Failed to delete order');
    }

    return data;
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    throw new Error(error.message || 'Failed to delete order. Please try again.');
  }
};
