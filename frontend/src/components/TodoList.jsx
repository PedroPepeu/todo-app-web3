import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

export default function TodoList({ contract, isConnected }) {
  const [todos, setTodos] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load todos from contract
  const loadTodos = async () => {
    if (!contract || !isConnected) return;
    
    setLoading(true);
    try {
      const count = await contract.taskCount();
      setTaskCount(Number(count));
      
      const todoList = [];
      for (let i = 0; i < count; i++) {
        const task = await contract.getTask(i);
        todoList.push({
          id: Number(task.id),
          content: task.content,
          completed: task.completed
        });
      }
      setTodos(todoList);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const handleAddTodo = async (content) => {
    if (!contract || !isConnected) return;
    
    setIsAdding(true);
    try {
      const tx = await contract.addTask(content);
      await tx.wait();
      await loadTodos(); // Reload todos after adding
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id) => {
    if (!contract || !isConnected) return;
    
    setIsUpdating(true);
    try {
      const tx = await contract.toggleComplete(id);
      await tx.wait();
      await loadTodos(); // Reload todos after updating
    } catch (error) {
      console.error('Error toggling todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update todo content
  const handleUpdateTodo = async (id, newContent) => {
    if (!contract || !isConnected) return;
    
    setIsUpdating(true);
    try {
      const tx = await contract.updateTask(id, newContent);
      await tx.wait();
      await loadTodos(); // Reload todos after updating
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    if (!contract || !isConnected) return;
    
    setIsUpdating(true);
    try {
      const tx = await contract.deleteTask(id);
      await tx.wait();
      await loadTodos(); // Reload todos after deleting
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Load todos when contract or connection changes
  useEffect(() => {
    loadTodos();
  }, [contract, isConnected]);

  if (!isConnected) {
    return (
      <div className="todo-list-container">
        <div className="connect-prompt">
          <h2>Connect Your Wallet</h2>
          <p>Please connect your wallet to manage your todos on the blockchain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h2>My Todos ({taskCount})</h2>
        <button 
          onClick={loadTodos} 
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <AddTodo onAdd={handleAddTodo} isAdding={isAdding} />
      
      <div className="todos-container">
        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <p>No todos yet. Add your first todo above!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleTodo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              isUpdating={isUpdating}
            />
          ))
        )}
      </div>
    </div>
  );
} 