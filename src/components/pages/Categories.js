import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const loadCategories = useCallback(async () => {
        try {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
            const data = await getCategories();
            setCategories(data);
            console.log(data);
        } catch (error) {
            setError('Failed to load categories');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleDelete = async (id) => {
        if (!user?.isAdmin) {
            setError('Only administrators can delete categories');
            return;
        }

        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                loadCategories();
            } catch (error) {
                setError('Failed to delete category');
            }
        }
    };

    const getParentName = (category) => {
        if (!category.parentCategory) return 'None';
        return category.parentCategory.name;
    };

    return (
        <div className="categories-container">
            <div className="categories-header">
                <h2>Categories</h2>
                {user?.isAdmin && (
                    <Link to="/categories/new" className="add-category-button">
                        Add Category
                    </Link>
                )}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="categories-list">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Parent Category</th>
                            {user?.isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>{getParentName(category)}</td>
                                {user?.isAdmin && (
                                    <td className="action-buttons">
                                        <Link
                                            to={`/categories/edit/${category._id}`}
                                            className="edit-button"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;
