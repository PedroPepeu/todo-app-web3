import { useState } from 'react';

export default function TodoItem({ 
  todo, 
  onToggle, 
  onUpdate, 
  onDelete, 
  isUpdating = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);

  const handleUpdate = () => {
    if (editContent.trim() !== '') {
      onUpdate(todo.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(todo.content);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-actions">
            <button onClick={handleUpdate} className="save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <button
              onClick={() => onToggle(todo.id)}
              className={`toggle-btn ${todo.completed ? 'checked' : ''}`}
              disabled={isUpdating}
            >
              {todo.completed ? '✓' : ''}
            </button>
            <span className="todo-text">{todo.content}</span>
          </div>
          <div className="todo-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              disabled={isUpdating}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-btn"
              disabled={isUpdating}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
} 