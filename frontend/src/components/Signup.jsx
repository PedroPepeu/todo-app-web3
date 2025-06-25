import { useState } from 'react';
import { ethers } from 'ethers';

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        setError('User with this email already exists');
        setIsLoading(false);
        return;
      }

      // Generate new wallet
      const wallet = ethers.Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;

      // Create user object
      const newUser = {
        email,
        password,
        address: walletAddress,
        privateKey: privateKey,
        createdAt: new Date().toISOString()
      };

      // Save user to localStorage (in production, use secure backend)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Show wallet info
      setWalletAddress(walletAddress);
      setShowWalletInfo(true);

      // Auto-login after successful signup
      setTimeout(() => {
        onSignup({ ...newUser, wallet });
      }, 3000);

    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showWalletInfo) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>🎉 Account Created Successfully!</h2>
          <p className="auth-subtitle">Your wallet has been generated</p>

          <div className="wallet-info-card">
            <h3>Your Wallet Address:</h3>
            <div className="wallet-address">
              {walletAddress}
            </div>
            
            <div className="wallet-warning">
              <h4>⚠️ Important Security Notice:</h4>
              <ul>
                <li>Your wallet has been created and saved locally</li>
                <li>You can now use this wallet for all your todo transactions</li>
                <li>For additional security, consider backing up your private key</li>
                <li>Never share your private key with anyone</li>
              </ul>
            </div>

            <div className="auto-login-notice">
              <p>You will be automatically logged in shortly...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join the Web3 Todo revolution</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-button primary"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="auth-link"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 