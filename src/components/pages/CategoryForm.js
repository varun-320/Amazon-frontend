import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, getCategories, updateCategory, getCategory } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/CategoryForm.css';

const CategoryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parentCategory: ''
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                if (!isAuthenticated) {
                    navigate('/login');
                    return;
                }

                if (!user?.isAdmin) {
                    navigate('/');
                    return;
                }

                const data = await getCategories();
                setCategories(data.filter(cat => cat._id !== id));

                // If editing, load the current category data
                if (id) {
                    const categoryData = await getCategory(id);
                    setFormData({
                        name: categoryData.name,
                        description: categoryData.description,
                        parentCategory: categoryData.parentCategory?._id || ''
                    });
                }
            } catch (error) {
                setError('Failed to load categories');
            }
        };
        loadCategories();
    }, [navigate, id, isAuthenticated, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!isAuthenticated || !user?.isAdmin) {
                navigate('/');
                return;
            }

            const categoryData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                parentCategory: formData.parentCategory || null
            };

            if (id) {
                await updateCategory(id, categoryData);
            } else {
                await createCategory(categoryData);
            }
            navigate('/categories');
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 400) {
                setError(error.response.data.message || 'Invalid category data');
            } else {
                setError('Failed to save category. Please try again.');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isAuthenticated || !user?.isAdmin) {
        return null;
    }

    return (
        <div className="category-form-container">
            <h2>{id ? 'Edit Category' : 'Create New Category'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                    <label htmlFor="name">Category Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter category name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter category description"
                        rows="4"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="parentCategory">Parent Category (Optional):</label>
                    <select
                        id="parentCategory"
                        name="parentCategory"
                        value={formData.parentCategory}
                        onChange={handleChange}
                    >
                        <option value="">None</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        {id ? 'Update Category' : 'Create Category'}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => navigate('/categories')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
