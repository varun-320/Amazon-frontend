import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, deleteProduct, addReview, updateReview, deleteReview } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../styles/ProductDetail.css';
import { useWishlist } from "../../context/WishlistContext";
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
     const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [editingReview, setEditingReview] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    const loadProduct = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getProduct(id);
            setProduct(data);
            console.log(data);
        } catch (error) {
            console.error('Error loading product:', error);
            setError(error.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);
    console.log(loadProduct);

    useEffect(() => {
        if (addedToCart) {
            const timer = setTimeout(() => {
                setAddedToCart(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [addedToCart]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setError('');
                await deleteProduct(id);
                navigate('/products');
            } catch (error) {
                console.error('Error deleting product:', error);
                setError(error.message || 'Failed to delete product');
            }
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (!reviewForm.rating || !reviewForm.comment.trim()) {
                setError('Rating and comment are required');
                return;
            }

            if (editingReview) {
                await updateReview(id, editingReview._id, reviewForm);
                setEditingReview(null);
            } else {
                await addReview(id, reviewForm);
            }

            await loadProduct();
            setReviewForm({ rating: 5, comment: '' });
        } catch (error) {
            console.error('Error with review:', error);
            setError(error.message || 'Failed to submit review');
        }
    };

    const handleEditReview = (review) => {
        setReviewForm({
            rating: review.rating,
            comment: review.comment
        });
        setEditingReview(review);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                setError('');
                await deleteReview(id, reviewId);
                await loadProduct();
            } catch (error) {
                console.error('Error deleting review:', error);
                setError(error.message || 'Failed to delete review');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setReviewForm({ rating: 5, comment: '' });
    };

    const handleAddToCart = () => {
        const productWithImage = {
            ...product,
            image: product.images[0]?.url || '/images/placeholder.png'
        };
        addToCart(productWithImage);
        setAddedToCart(true);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="not-found">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="product-images">
                    <div className="main-image">
                        <img 
                            src={product.images[currentImageIndex]?.url || '/images/placeholder.png'} 
                            alt={product.name} 
                        />
                    </div>
                    <div className="image-thumbnails">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={index === currentImageIndex ? 'active' : ''}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <div className="rating">
                        {'★'.repeat(Math.round(product.rating))}
                        {'☆'.repeat(5 - Math.round(product.rating))}
                        <span>({product.numReviews} reviews)</span>
                    </div>
                    <div className="price">₹{product.price}</div>
                    <div className="stock">
                        Stock: {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                    </div>
                    <div className="category">
                        Category: {product.category.name}
                        {product.subcategory && ` > ${product.subcategory.name}`}
                    </div>
                    <p className="description">{product.description}</p>
                    {wishlist.some((item) => item._id === product._id) ? (
                        <button className="wishlist-btn remove" onClick={() => removeFromWishlist(product._id)}>
                            ❌ Remove from Wishlist
                        </button>
                    ) : (
                        <button className="wishlist-btn add" onClick={() => addToWishlist(product)}>
                            ❤️ Add to Wishlist
                        </button>
                    )}

                    <div className="product-actions">
                        <button 
                            onClick={handleAddToCart}
                            className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                        >
                            {addedToCart ? 'Added! ✓' : 'Add to Cart'}
                        </button>
                        {user?.isAdmin && (
                            <>
                                <button onClick={() => navigate(`/products/edit/${id}`)} className="edit-button">
                                    Edit Product
                                </button>
                                <button onClick={handleDelete} className="delete-button">
                                    Delete Product
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                
                {user && (
                    <form onSubmit={handleReviewSubmit} className="review-form">
                        <h3>{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                        <div className="rating-input">
                            <label>Rating:</label>
                            <select
                                value={reviewForm.rating}
                                onChange={(e) => setReviewForm(prev => ({
                                    ...prev,
                                    rating: Number(e.target.value)
                                }))}
                            >
                                {[5, 4, 3, 2, 1].map(num => (
                                    <option key={num} value={num}>{num} stars</option>
                                ))}
                            </select>
                        </div>
                        <div className="comment-input">
                            <label>Comment:</label>
                            <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm(prev => ({
                                    ...prev,
                                    comment: e.target.value
                                }))}
                                placeholder="Write your review here..."
                                required
                            />
                        </div>
                        <div className="review-actions">
                            <button type="submit" className="submit-button">
                                {editingReview ? 'Update Review' : 'Submit Review'}
                            </button>
                            {editingReview && (
                                <button 
                                    type="button" 
                                    onClick={handleCancelEdit}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}

                <div className="reviews-list">
                    {product.reviews && product.reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <div className="review-header">
                                <div className="review-rating">
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                                <div className="review-user">
                                    by {review.user?.name || 'Anonymous'}
                                </div>
                                <div className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                                {user?.isAdmin && (
                                    <div className="review-actions">
                                        <button 
                                            onClick={() => handleEditReview(review)}
                                            className="edit-review-btn"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="delete-review-btn"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="review-comment">{review.comment}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
