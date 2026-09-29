import React, { useState, useEffect } from 'react';
import { BackIcon, TodoListIcon, TrashIcon, PlusIcon } from './Icons';
import type { TodoItem } from '../types';
import { useI18n } from '../contexts/i18nContext';

const TodoList: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todoList');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (e) {
      console.error("Failed to load to-do list:", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos));
  }, [todos]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo: TodoItem = {
        id: `todo-${Date.now()}`,
        text: input.trim(),
        completed: false,
      };
      setTodos([newTodo, ...todos]);
      setInput('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ).sort((a, b) => Number(a.completed) - Number(b.completed))
    );
  };
  
  const handleDeleteTask = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('todoHeader')}</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] px-6">
            <TodoListIcon className="w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold">{t('todoEmptyTitle')}</h2>
            <p className="text-center mt-2">{t('todoEmptySubtitle')}</p>
          </div>
        ) : (
          <ul className="p-4 space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-center bg-[var(--background-secondary)] p-3 rounded-lg transition-all"
              >
                <button 
                  onClick={() => handleToggleComplete(todo.id)} 
                  className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center mr-3"
                  aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.completed && <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full"></div>}
                </button>
                <span className={`flex-1 ${todo.completed ? 'line-through text-[var(--text-secondary)]' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDeleteTask(todo.id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--destructive)] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete task"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      
      <div className="p-4 bg-[var(--background-primary)] border-t border-[var(--border-color)]">
        <form onSubmit={handleAddTask} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('todoPlaceholder')}
            className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-3 pl-4 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
            aria-label={t('todoAddTask')}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoList;
