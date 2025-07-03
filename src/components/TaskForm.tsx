import React, { useState } from 'react';
import { X, Calendar, Tag, Hash } from 'lucide-react';
import { Task, Priority } from '../types/Task';
import { formatDateInput } from '../utils/dateUtils';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Task | Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onCancel: () => void;
  categories: string[];
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, categories }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? formatDateInput(task.dueDate) : ''
  );
  const [category, setCategory] = useState(task?.category || 'General');
  const [tags, setTags] = useState(task?.tags?.join(', ') || '');
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = newCategory.trim() || category;
    const taskTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (task) {
      onSubmit({
        ...task,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        category: finalCategory,
        tags: taskTags,
      });
    } else {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        category: finalCategory,
        tags: taskTags,
      });
    }
  };

  const getPriorityColor = (priorityLevel: Priority) => {
    switch (priorityLevel) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300';
    }
  };

  return (
    <div className="animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="input-field"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['high', 'medium', 'low'] as Priority[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`
                    px-4 py-3 rounded-lg border-2 text-sm font-medium capitalize transition-all duration-200 transform hover:scale-105
                    ${priority === level 
                      ? getPriorityColor(level) 
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Or create new category..."
              className="input-field mt-2"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Hash size={16} className="inline mr-1" />
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas..."
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="btn-primary flex-1 transform hover:scale-105 transition-all duration-300"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-secondary transform hover:scale-105 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;