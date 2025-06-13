import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../../utils/api';
import '../../styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    adminCode: ''
  });
  const [showAdminField, setShowAdminField] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Attempting to register with:', formData);
    
    try {
      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message === 'User already exists') {
        setError('An account with this email already exists. Please try logging in instead.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="main-container">
      <div className="logo">
        <img src="/images/amazon.png" alt="Amazon Logo" />
      </div>
      <div className="signup-container">
        <h1>Create account</h1>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="First and last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile number</label>
            <input 
              type="tel" 
              id="mobile" 
              name="mobile" 
              value={formData.mobile}
              onChange={handleChange}
              required 
              placeholder="Mobile number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
              placeholder="At least 6 characters"
              minLength="6"
            />
            <div className="password-hint">
              <i className="info-icon">i</i>
              Passwords must be at least 6 characters.
            </div>
          </div>

          <div className="form-group admin-toggle">
            <button 
              type="button" 
              className="link-button"
              onClick={() => setShowAdminField(!showAdminField)}
            >
              {showAdminField ? 'Hide Admin Registration' : 'Register as Admin'}
            </button>
          </div>

          {showAdminField && (
            <div className="form-group">
              <label htmlFor="adminCode">Admin Code</label>
              <input 
                type="password" 
                id="adminCode" 
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter admin code"
              />
            </div>
          )}

          <div className="terms">
            By creating an account, you agree to Amazon's{' '}
            <Link to="#">Conditions of Use</Link> and{' '}
            <Link to="#">Privacy Notice</Link>.
          </div>

          <button type="submit" className="primary-button">
            Continue
          </button>

          <div className="divider"></div>

          <div className="signin-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>

      <footer>
        <div className="footer-links">
          <Link to="#">Conditions of Use</Link>
          <Link to="#">Privacy Notice</Link>
          <Link to="#">Help</Link>
        </div>
        <div className="copyright">
          1996-2024, Amazon.com, Inc. or its affiliates
        </div>
      </footer>
    </div>
  );
}

export default Signup;
