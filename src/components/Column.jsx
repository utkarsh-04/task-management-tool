import React, { useState } from 'react';
import Task from './Task';
import { useDrop } from 'react-dnd';

export default function Column({ columnId, column, columns, setColumns }) {
  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskInput.trim(),
    };
    const newColumn = {
      ...column,
      items: [...column.items, newTask],
    };
    setColumns({ ...columns, [columnId]: newColumn });
    setTaskInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  const handleClear = () => {
    if (confirm(`Clear all tasks in "${column.name}"?`)) {
      setColumns({ ...columns, [columnId]: { ...column, items: [] } });
    }
  };

  const [, drop] = useDrop({
    accept: 'task',
    drop: (item) => {
      if (item.fromColumn === columnId) return;

      const fromItems = columns[item.fromColumn].items.filter(
        (task) => task.id !== item.id
      );
      const droppedTask = columns[item.fromColumn].items.find(
        (task) => task.id === item.id
      );

      const updatedColumns = {
        ...columns,
        [item.fromColumn]: {
          ...columns[item.fromColumn],
          items: fromItems,
        },
        [columnId]: {
          ...column,
          items: [...column.items, droppedTask],
        },
      };
      setColumns(updatedColumns);
    },
  });

  const handleDelete = (taskId) => {
    const newItems = column.items.filter((task) => task.id !== taskId);
    setColumns({ ...columns, [columnId]: { ...column, items: newItems } });
  };

  const handleEdit = (taskId, newText) => {
    const updatedItems = column.items.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    setColumns({ ...columns, [columnId]: { ...column, items: updatedItems } });
  };

  return (
    <div
      ref={drop}
      className="bg-white rounded-xl shadow-md p-4 flex flex-col min-h-[400px]"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{column.name}</h2>
        <button
          onClick={handleClear}
          className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTask();
          }}
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="Add a task..."
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-all"
        >
          Add
        </button>
      </div>


      <div className="space-y-2 overflow-y-auto">
        {column.items.map((task) => (
          <Task
            key={task.id}
            task={task}
            columnId={columnId}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
