import React, { useState } from 'react';
import { Target } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import TaskStats from './components/TaskStats';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import SearchAndFilter from './components/SearchAndFilter';
import { Task, Priority, FilterType } from './types/Task';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import { useDarkMode } from './hooks/useDarkMode';
import { isOverdue, isDueToday, isDueThisWeek } from './utils/dateUtils';

function App() {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  // Get unique categories
  const categories = ['General', ...Array.from(new Set(tasks.map(task => task.category).filter(cat => cat !== 'General')))];

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setShowTaskForm(false);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    
    // Status/Priority filter
    let matchesFilter = true;
    switch (filterType) {
      case 'completed':
        matchesFilter = task.completed;
        break;
      case 'pending':
        matchesFilter = !task.completed;
        break;
      case 'high':
        matchesFilter = task.priority === 'high';
        break;
      case 'medium':
        matchesFilter = task.priority === 'medium';
        break;
      case 'low':
        matchesFilter = task.priority === 'low';
        break;
      case 'overdue':
        matchesFilter = !task.completed && task.dueDate && isOverdue(task.dueDate);
        break;
      case 'today':
        matchesFilter = !task.completed && task.dueDate && isDueToday(task.dueDate);
        break;
      case 'week':
        matchesFilter = !task.completed && task.dueDate && isDueThisWeek(task.dueDate);
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with User Info */}
        <Header 
          username={user!.username}
          onAddTask={() => setShowTaskForm(true)}
          onLogout={logout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-all duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl animate-slideIn transition-colors duration-300">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? updateTask : addTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
                categories={categories}
              />
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        <main>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 animate-slideIn">
              <div className="mb-4">
                <Target className="mx-auto text-gray-400 dark:text-gray-500 transition-colors duration-300" size={64} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your criteria'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-300">
                {tasks.length === 0 
                  ? 'Create your first task to get started on your productivity journey'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary transform hover:scale-105 transition-all duration-300"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TaskCard
                    task={task}
                    onToggle={() => toggleTaskCompletion(task.id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;