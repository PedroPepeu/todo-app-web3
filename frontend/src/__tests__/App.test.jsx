import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock the components
vi.mock('../components/Login', () => ({
  default: ({ onLogin, onSwitchToSignup }) => (
    <div data-testid="login-component">
      <button onClick={() => onLogin({ email: 'test@example.com', wallet: {} })}>
        Mock Login
      </button>
      <button onClick={onSwitchToSignup}>Switch to Signup</button>
    </div>
  )
}))

vi.mock('../components/Signup', () => ({
  default: ({ onSignup, onSwitchToLogin }) => (
    <div data-testid="signup-component">
      <button onClick={() => onSignup({ email: 'new@example.com', wallet: {} })}>
        Mock Signup
      </button>
      <button onClick={onSwitchToLogin}>Switch to Login</button>
    </div>
  )
}))

vi.mock('../components/TodoList', () => ({
  default: ({ contract, isConnected }) => (
    <div data-testid="todo-list">
      <p>Contract: {contract ? 'Connected' : 'Not Connected'}</p>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
    </div>
  )
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login page when no user is authenticated', () => {
    render(<App />)
    
    expect(screen.getByText('Todo App Web3')).toBeInTheDocument()
    expect(screen.getByTestId('login-component')).toBeInTheDocument()
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument()
  })

  it('switches between login and signup components', () => {
    render(<App />)
    
    // Should start with login
    expect(screen.getByTestId('login-component')).toBeInTheDocument()
    
    // Switch to signup
    const switchToSignupButton = screen.getByText('Switch to Signup')
    fireEvent.click(switchToSignupButton)
    
    expect(screen.getByTestId('signup-component')).toBeInTheDocument()
    
    // Switch back to login
    const switchToLoginButton = screen.getByText('Switch to Login')
    fireEvent.click(switchToLoginButton)
    
    expect(screen.getByTestId('login-component')).toBeInTheDocument()
  })

  it('authenticates user and shows todo list', async () => {
    render(<App />)
    
    // Click login button
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    })
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Generated Wallet User')).toBeInTheDocument()
  })

  it('creates new user account and shows todo list', async () => {
    render(<App />)
    
    // Switch to signup
    const switchToSignupButton = screen.getByText('Switch to Signup')
    fireEvent.click(switchToSignupButton)
    
    // Click signup button
    const signupButton = screen.getByText('Mock Signup')
    fireEvent.click(signupButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    })
    
    expect(screen.getByText('new@example.com')).toBeInTheDocument()
  })

  it('loads user session from localStorage on mount', () => {
    const mockUser = {
      email: 'saved@example.com',
      address: '0x1234567890123456789012345678901234567890',
      privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    }
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser))
    
    render(<App />)
    
    expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    expect(screen.getByText('saved@example.com')).toBeInTheDocument()
  })

  it('handles invalid user session in localStorage', () => {
    localStorage.setItem('currentUser', 'invalid-json')
    
    render(<App />)
    
    expect(screen.getByTestId('login-component')).toBeInTheDocument()
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser')
  })

  it('logs out user and returns to login', async () => {
    // First authenticate
    render(<App />)
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    })
    
    // Then logout
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(screen.getByTestId('login-component')).toBeInTheDocument()
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser')
  })

  it('displays user information in header when authenticated', async () => {
    render(<App />)
    
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
    
    // Check if user info is displayed
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('passes correct props to TodoList component', async () => {
    render(<App />)
    
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Contract: Connected')).toBeInTheDocument()
      expect(screen.getByText('Connected: Yes')).toBeInTheDocument()
    })
  })

  it('handles contract initialization with user wallet', async () => {
    render(<App />)
    
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Contract: Connected')).toBeInTheDocument()
    })
  })

  it('shows footer with correct information', async () => {
    render(<App />)
    
    expect(screen.getByText('Built with React + Hardhat + Web3')).toBeInTheDocument()
    
    // Login and check footer updates
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Generated Wallet User')).toBeInTheDocument()
    })
  })

  it('maintains authentication state across component updates', async () => {
    const { rerender } = render(<App />)
    
    // Login
    const loginButton = screen.getByText('Mock Login')
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    })
    
    // Rerender component
    rerender(<App />)
    
    // Should still be authenticated
    expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })
}) 