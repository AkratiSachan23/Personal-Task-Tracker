import React from 'react';
import { Plus, LogOut, User, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  username: string;
  onAddTask: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  username, 
  onAddTask, 
  onLogout, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  return (
    <header className="mb-8 animate-slideIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
            Personal Task Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Stay organized and boost your productivity
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* User Info */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm transition-all duration-300">
            <User size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-200 font-medium">{username}</span>
          </div>
          
          {/* Add Task Button */}
          <button
            onClick={onAddTask}
            className="btn-primary flex items-center gap-2 px-6 py-3 text-lg transform hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            Add Task
          </button>
          
          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;