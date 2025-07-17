import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

export default function Task({ task, columnId, handleDelete, handleEdit }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { ...task, fromColumn: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSave = () => {
    if (!text.trim()) return;
    handleEdit(task.id, text.trim());
    setEditing(false);
  };

  return (
    <div
      ref={drag}
      className={`p-3 rounded bg-gray-100 border flex items-center justify-between ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {editing ? (
        <input
          className="flex-1 mr-2 p-1 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
          autoFocus
        />
      ) : (
        <span
          className="flex-1 cursor-pointer"
          onDoubleClick={() => setEditing(true)}
        >
          {task.text}
        </span>
      )}
      <button
        onClick={() => handleDelete(task.id)}
        className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
