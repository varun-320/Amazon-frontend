import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginUser({ email, password });
      login(response.token, response.user);
      navigate(from);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="main-container">
      <div className="logo">
        <img src="/images/amazon.png" alt="Amazon Logo" />
      </div>
      <div className="login-container">
        <h1>Sign in</h1>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email or mobile phone number</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="primary-button">
            Sign In
          </button>

          <div className="terms">
            By continuing, you agree to Amazon's{' '}
            <Link to="#">Conditions of Use</Link> and{' '}
            <Link to="#">Privacy Notice</Link>.
          </div>

          <div className="help-section">
            <details>
              <summary>Need help?</summary>
              <div className="help-content">
                <Link to="#">Forgot Password</Link>
                <Link to="#">Other issues with Sign-In</Link>
              </div>
            </details>
          </div>
        </form>
        
      </div>

      <div className="divider">
        <h5>New to Amazon?</h5>
      </div>

      <Link to="/signup" className="secondary-button">
        Create your Amazon account
      </Link>

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

export default Login;
