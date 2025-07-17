import React, { useState, useEffect } from 'react';
import Column from './components/Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const defaultData = {
  todo: { name: 'To Do', items: [] },
  inProgress: { name: 'In Progress', items: [] },
  done: { name: 'Done', items: [] },
};

export default function App() {
  const [columns, setColumns] = useState(() => {
    const stored = localStorage.getItem('task-columns');
    return stored ? JSON.parse(stored) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('task-columns', JSON.stringify(columns));
  }, [columns]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6 font-sans">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 drop-shadow-lg">
          📝 Task Management Tool
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              column={column}
              columns={columns}
              setColumns={setColumns}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
