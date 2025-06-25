import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TodoItem from '../TodoItem'

describe('TodoItem Component', () => {
  const mockTodo = {
    id: 1,
    content: 'Test todo item',
    completed: false
  }
  
  const mockOnToggle = vi.fn()
  const mockOnUpdate = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders todo item correctly', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText('Test todo item')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument() // Toggle button
  })

  it('displays completed todo with correct styling', () => {
    const completedTodo = { ...mockTodo, completed: true }
    
    render(
      <TodoItem 
        todo={completedTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const todoItem = screen.getByText('Test todo item').closest('.todo-item')
    expect(todoItem).toHaveClass('completed')
    
    const toggleButton = screen.getByRole('button', { name: '✓' })
    expect(toggleButton).toHaveClass('checked')
  })

  it('calls onToggle when toggle button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const toggleButton = screen.getByRole('button', { name: '' })
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalledWith(1)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('enters edit mode when edit button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    expect(screen.getByDisplayValue('Test todo item')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('allows editing todo content', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    fireEvent.change(editInput, { target: { value: 'Updated todo content' } })
    
    expect(editInput.value).toBe('Updated todo content')
  })

  it('saves changes when save button is clicked', async () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    fireEvent.change(editInput, { target: { value: 'Updated todo content' } })
    
    const saveButton = screen.getByRole('button', { name: 'Save' })
    fireEvent.click(saveButton)
    
    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'Updated todo content')
    
    await waitFor(() => {
      expect(screen.getByText('Updated todo content')).toBeInTheDocument()
    })
  })

  it('cancels editing when cancel button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    fireEvent.change(editInput, { target: { value: 'Changed content' } })
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(mockOnUpdate).not.toHaveBeenCalled()
    expect(screen.getByText('Test todo item')).toBeInTheDocument()
  })

  it('does not save empty content', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    fireEvent.change(editInput, { target: { value: '   ' } })
    
    const saveButton = screen.getByRole('button', { name: 'Save' })
    fireEvent.click(saveButton)
    
    expect(mockOnUpdate).not.toHaveBeenCalled()
  })

  it('disables buttons when isUpdating is true', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        isUpdating={true}
      />
    )
    
    const toggleButton = screen.getByRole('button', { name: '' })
    const editButton = screen.getByRole('button', { name: 'Edit' })
    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    
    expect(toggleButton).toBeDisabled()
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('handles long todo content with word break', () => {
    const longTodo = {
      ...mockTodo,
      content: 'This is a very long todo item that should wrap to multiple lines and not break the layout of the todo item component'
    }
    
    render(
      <TodoItem 
        todo={longTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    expect(screen.getByText(longTodo.content)).toBeInTheDocument()
  })

  it('focuses edit input when entering edit mode', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    expect(editInput).toHaveFocus()
  })

  it('handles keyboard events in edit mode', () => {
    render(
      <TodoItem 
        todo={mockTodo}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )
    
    const editButton = screen.getByRole('button', { name: 'Edit' })
    fireEvent.click(editButton)
    
    const editInput = screen.getByDisplayValue('Test todo item')
    
    // Test Enter key
    fireEvent.keyDown(editInput, { key: 'Enter' })
    expect(mockOnUpdate).toHaveBeenCalledWith(1, 'Test todo item')
    
    // Test Escape key
    fireEvent.change(editInput, { target: { value: 'Changed content' } })
    fireEvent.keyDown(editInput, { key: 'Escape' })
    expect(screen.getByText('Test todo item')).toBeInTheDocument()
  })
}) 