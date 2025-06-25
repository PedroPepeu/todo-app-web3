import { useState } from 'react';

export default function AddTodo({ onAdd, isAdding = false }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() !== '') {
      onAdd(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="input-group">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
          disabled={isAdding}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={isAdding || !content.trim()}
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
} 