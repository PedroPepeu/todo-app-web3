import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '../Login'

describe('Login Component', () => {
  const mockOnLogin = vi.fn()
  const mockOnSwitchToSignup = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(JSON.stringify([
      {
        email: 'test@example.com',
        password: 'password123',
        privateKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        address: '0x1234567890123456789012345678901234567890'
      }
    ]))
  })

  it('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
  })

  it('allows user to input email and password', () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('shows error message for invalid credentials', async () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
    
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  it('successfully logs in with valid credentials', async () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123',
          wallet: expect.any(Object)
        })
      )
    })
  })

  it('shows loading state during login', async () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByRole('button', { name: 'Signing In...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Signing In...' })).toBeDisabled()
  })

  it('handles login errors gracefully', async () => {
    localStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument()
    })
  })

  it('switches to signup when signup link is clicked', () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const signupLink = screen.getByText('Sign up')
    fireEvent.click(signupLink)
    
    expect(mockOnSwitchToSignup).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)
    
    // HTML5 validation should prevent form submission
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  it('handles empty users array', async () => {
    localStorage.getItem.mockReturnValue('[]')
    
    render(<Login onLogin={mockOnLogin} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })
  })
}) 