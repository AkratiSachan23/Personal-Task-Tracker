import React from 'react';
import { CheckCircle2, Circle, Edit3, Trash2, Calendar, AlertCircle, Clock, Tag, Hash } from 'lucide-react';
import { Task } from '../types/Task';
import { formatDate, isOverdue, isDueToday } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const getPriorityIcon = () => {
    if (task.priority === 'high') {
      return <AlertCircle size={16} className="text-red-500" />;
    }
    return null;
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
    }
  };

  const getPriorityBadgeClass = () => {
    switch (task.priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    if (isOverdue(task.dueDate) && !task.completed) {
      return 'overdue';
    } else if (isDueToday(task.dueDate)) {
      return 'today';
    }
    return 'normal';
  };

  const getDueDateClass = () => {
    const status = getDueDateStatus();
    switch (status) {
      case 'overdue': return 'text-red-600 dark:text-red-400 font-medium';
      case 'today': return 'text-orange-600 dark:text-orange-400 font-medium';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className={`
      task-card bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${getPriorityClass()}
      ${task.completed ? 'opacity-75' : ''}
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1
    `}>
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={onToggle}
          className="flex-shrink-0 mr-3 mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 transform hover:scale-110"
        >
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1">
          <h3 className={`
            font-semibold text-lg mb-2 leading-tight transition-colors duration-300
            ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}
          `}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`
              text-sm mb-3 leading-relaxed transition-colors duration-300
              ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}
            `}>
              {task.description}
            </p>
          )}
          
          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              <Tag size={12} className="mr-1" />
              {task.category}
            </span>
            {(task.tags || []).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Hash size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors duration-300
                ${getPriorityBadgeClass()}
              `}>
                {getPriorityIcon()}
                <span className="ml-1">{task.priority}</span>
              </span>
            </div>
            
            <div className="flex flex-col items-end text-xs">
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                <Calendar size={12} className="mr-1" />
                {formatDate(task.createdAt)}
              </div>
              {task.dueDate && (
                <div className={`flex items-center ${getDueDateClass()}`}>
                  <Clock size={12} className="mr-1" />
                  Due: {formatDate(task.dueDate)}
                  {getDueDateStatus() === 'overdue' && !task.completed && (
                    <span className="ml-1 text-red-600 dark:text-red-400">⚠️</span>
                  )}
                  {getDueDateStatus() === 'today' && (
                    <span className="ml-1">📅</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
          title="Edit task"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 transform hover:scale-110"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;