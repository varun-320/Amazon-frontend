import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct, getCategories } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ProductForm.css';

function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: []
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState([]);

    const loadProduct = useCallback(async () => {
        try {
            const product = await getProduct(id);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category?._id || '',
                images: product.images || []
            });
            setImagePreview(product.images || []);
        } catch (error) {
            setError('Failed to load product');
        }
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No auth token found, redirecting to login');
            navigate('/login');
            return;
        }
        
        if (!user?.isAdmin) {
            console.log('Non-admin user, redirecting to home');
            navigate('/');
            return;
        }

        console.log('Auth token found:', token);
        
        loadCategories();
        if (id) {
            loadProduct();
        }
    }, [id, navigate, user, loadProduct]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            console.log('Loaded categories (detailed):', JSON.stringify(data, null, 2));
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Failed to load categories');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Preview images
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            file: file
        }));
        
        setImagePreview(prev => [...prev, ...previews]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeImage = (index) => {
        setImagePreview(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Submitting form data:', formData);

            // Convert price and stock to numbers
            const price = Number(formData.price);
            const stock = Number(formData.stock);
            
            if (isNaN(price)) {
                throw new Error('Invalid price value');
            }

            if (isNaN(stock)) {
                throw new Error('Invalid stock value');
            }

            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: price,
                stock: stock,
                category: formData.category,
                images: formData.images.filter(image => image instanceof File)
            };

            console.log('Sending product data:', productData);

            if (id) {
                await updateProduct(id, productData);
            } else {
                await createProduct(productData);
            }

            navigate('/products');
        } catch (error) {
            console.error('Error creating product:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter product name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter product description"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="Enter stock quantity"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="images">Product Images</label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                    />
                    <div className="image-preview">
                        {imagePreview.map((image, index) => (
                            <div key={index} className="preview-item">
                                <img src={image.url || image} alt={`Preview ${index + 1}`} />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={() => removeImage(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
                </button>
            </form>
        </div>
    );
}

export default ProductForm;
