import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Signup from '../Signup'

describe('Signup Component', () => {
  const mockOnSignup = vi.fn()
  const mockOnSwitchToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue('[]')
    localStorage.setItem.mockImplementation(() => {})
  })

  it('renders signup form correctly', () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Join the Web3 Todo revolution')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
  })

  it('allows user to input form fields', () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
    expect(confirmPasswordInput.value).toBe('password123')
  })

  it('shows error when passwords do not match', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
    
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('shows error when password is too short', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
    
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('shows error when user already exists', async () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([
      { email: 'test@example.com', password: 'password123' }
    ]))
    
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('User with this email already exists')).toBeInTheDocument()
    })
    
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('successfully creates account with valid data', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('🎉 Account Created Successfully!')).toBeInTheDocument()
    })
    
    expect(localStorage.setItem).toHaveBeenCalledWith('users', expect.any(String))
  })

  it('shows wallet information after successful signup', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Your Wallet Address:')).toBeInTheDocument()
      expect(screen.getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument()
      expect(screen.getByText('⚠️ Important Security Notice:')).toBeInTheDocument()
      expect(screen.getByText('You will be automatically logged in shortly...')).toBeInTheDocument()
    })
  })

  it('shows loading state during signup', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByRole('button', { name: 'Creating Account...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Creating Account...' })).toBeDisabled()
  })

  it('handles signup errors gracefully', async () => {
    localStorage.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to create account. Please try again.')).toBeInTheDocument()
    })
  })

  it('switches to login when login link is clicked', () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const loginLink = screen.getByText('Sign in')
    fireEvent.click(loginLink)
    
    expect(mockOnSwitchToLogin).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)
    
    // HTML5 validation should prevent form submission
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('auto-logs in user after successful signup', async () => {
    vi.useFakeTimers()
    
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('🎉 Account Created Successfully!')).toBeInTheDocument()
    })
    
    // Fast-forward time to trigger auto-login
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    
    expect(mockOnSignup).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'newuser@example.com',
        password: 'password123',
        wallet: expect.any(Object)
      })
    )
    
    vi.useRealTimers()
  })

  it('disables submit button when form is invalid', () => {
    render(<Signup onSignup={mockOnSignup} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    
    // Button should be disabled when form is empty
    expect(submitButton).toBeDisabled()
    
    // Fill in email only
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    // Button should still be disabled
    expect(submitButton).toBeDisabled()
  })
}) 