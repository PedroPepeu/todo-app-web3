import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AddTodo from '../AddTodo'

describe('AddTodo Component', () => {
  const mockOnAdd = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders add todo form correctly', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('allows user to input todo content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    fireEvent.change(input, { target: { value: 'New todo item' } })
    
    expect(input.value).toBe('New todo item')
  })

  it('submits form with valid content', async () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })

  it('submits form when Enter key is pressed', async () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    
    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })

  it('does not submit empty content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('does not submit whitespace-only content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('clears input after successful submission', async () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.click(submitButton)
    
    expect(input.value).toBe('')
  })

  it('shows loading state when isAdding is true', () => {
    render(<AddTodo onAdd={mockOnAdd} isAdding={true} />)
    
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeDisabled()
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeDisabled()
  })

  it('disables submit button when input is empty', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const submitButton = screen.getByRole('button', { name: 'Add' })
    expect(submitButton).toBeDisabled()
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    fireEvent.change(input, { target: { value: 'Some content' } })
    
    expect(submitButton).not.toBeDisabled()
  })

  it('disables submit button when input is only whitespace', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    
    expect(submitButton).toBeDisabled()
  })

  it('handles long todo content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const longContent = 'This is a very long todo item that should be handled properly by the component without breaking the layout or functionality'
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: longContent } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).toHaveBeenCalledWith(longContent)
  })

  it('handles special characters in todo content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const specialContent = 'Todo with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: specialContent } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).toHaveBeenCalledWith(specialContent)
  })

  it('handles unicode characters in todo content', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const unicodeContent = 'Todo with unicode: 🚀 📝 ✅ 🎯'
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: unicodeContent } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).toHaveBeenCalledWith(unicodeContent)
  })

  it('maintains focus on input after submission', async () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: 'New todo item' } })
    fireEvent.click(submitButton)
    
    // Focus should remain on input for better UX
    expect(input).toHaveFocus()
  })

  it('handles form submission with preventDefault', () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const form = screen.getByRole('form')
    const input = screen.getByPlaceholderText('Add a new todo...')
    
    fireEvent.change(input, { target: { value: 'New todo item' } })
    
    // Mock preventDefault
    const mockPreventDefault = vi.fn()
    fireEvent.submit(form, { preventDefault: mockPreventDefault })
    
    expect(mockPreventDefault).toHaveBeenCalled()
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })

  it('handles multiple rapid submissions', async () => {
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const submitButton = screen.getByRole('button', { name: 'Add' })
    
    fireEvent.change(input, { target: { value: 'First todo' } })
    fireEvent.click(submitButton)
    
    fireEvent.change(input, { target: { value: 'Second todo' } })
    fireEvent.click(submitButton)
    
    expect(mockOnAdd).toHaveBeenCalledTimes(2)
    expect(mockOnAdd).toHaveBeenNthCalledWith(1, 'First todo')
    expect(mockOnAdd).toHaveBeenNthCalledWith(2, 'Second todo')
  })
}) 