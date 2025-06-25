import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoList from './components/TodoList';
import './App.css';

// TodoList contract ABI - you'll need to replace this with your actual ABI
const TODO_ABI = [
  "function taskCount() external view returns (uint256)",
  "function getTask(uint256 _id) external view returns (tuple(uint256 id, string content, bool completed))",
  "function addTask(string calldata _content) external",
  "function updateTask(uint256 _id, string calldata _newContent) external",
  "function toggleComplete(uint256 _id) external",
  "function deleteTask(uint256 _id) external"
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

function App() {
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState('login'); // 'login', 'signup', or null

  // Check for existing user session
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        if (userData.privateKey) {
          const wallet = new ethers.Wallet(userData.privateKey);
          setUser({ ...userData, wallet });
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Initialize contract when user is logged in
  useEffect(() => {
    const initializeContract = async () => {
      if (user && user.wallet) {
        // Use user's generated wallet
        const todoContract = new ethers.Contract(CONTRACT_ADDRESS, TODO_ABI, user.wallet);
        setContract(todoContract);
      } else {
        setContract(null);
      }
    };

    initializeContract();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowAuth(null);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowAuth(null);
  };

  const handleLogout = () => {
    setUser(null);
    setContract(null);
    localStorage.removeItem('currentUser');
    setShowAuth('login');
  };

  const isAuthenticated = user;

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Todo App Web3</h1>
          </div>
        </header>
        
        <main className="app-main">
          {showAuth === 'login' ? (
            <Login 
              onLogin={handleLogin} 
              onSwitchToSignup={() => setShowAuth('signup')} 
            />
          ) : (
            <Signup 
              onSignup={handleSignup} 
              onSwitchToLogin={() => setShowAuth('login')} 
            />
          )}
        </main>
      </div>
    );
  }

  // Show main app when authenticated
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Todo App Web3</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              {user.address && (
                <span className="user-address">
                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                </span>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <TodoList contract={contract} isConnected={isAuthenticated} />
      </main>
      
      <footer className="app-footer">
        <p>Built with React + Hardhat + Web3</p>
        <p className="wallet-info">
          Generated Wallet User
        </p>
      </footer>
    </div>
  );
}

export default App;
