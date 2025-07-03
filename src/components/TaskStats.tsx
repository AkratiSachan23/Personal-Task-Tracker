import React from 'react';
import { CheckCircle, Clock, TrendingUp, Target, AlertTriangle, Calendar } from 'lucide-react';
import { Task } from '../types/Task';
import { isOverdue, isDueToday, isDueThisWeek } from '../utils/dateUtils';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueTasks = tasks.filter(task => !task.completed && task.dueDate && isOverdue(task.dueDate)).length;
  const dueTodayTasks = tasks.filter(task => !task.completed && task.dueDate && isDueToday(task.dueDate)).length;
  const dueThisWeekTasks = tasks.filter(task => !task.completed && task.dueDate && isDueThisWeek(task.dueDate)).length;

  const priorityCounts = {
    high: tasks.filter(task => task.priority === 'high' && !task.completed).length,
    medium: tasks.filter(task => task.priority === 'medium' && !task.completed).length,
    low: tasks.filter(task => task.priority === 'low' && !task.completed).length,
  };

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
  ];

  const dueDateStats = [
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
    },
    {
      label: 'Due Today',
      value: dueTodayTasks,
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
    {
      label: 'Due This Week',
      value: dueThisWeekTasks,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
    },
  ];

  return (
    <div className="mb-8 animate-slideIn">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor} transition-colors duration-300`}>
                {stat.value}
              </span>
            </div>
            <p className={`text-sm font-medium ${stat.textColor} transition-colors duration-300`}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Due Date Stats */}
      {(overdueTasks > 0 || dueTodayTasks > 0 || dueThisWeekTasks > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dueDateStats.map((stat) => (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon size={16} className="text-white" />
                </div>
                <span className={`text-xl font-bold ${stat.textColor} transition-colors duration-300`}>
                  {stat.value}
                </span>
              </div>
              <p className={`text-xs font-medium ${stat.textColor} transition-colors duration-300`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Priority Breakdown */}
      {pendingTasks > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Pending Tasks by Priority
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-2 transition-colors duration-300">
                <span className="text-2xl font-bold text-red-700 dark:text-red-300">{priorityCounts.high}</span>
              </div>
              <p className="text-sm font-medium text-red-700 dark:text-red-300 transition-colors duration-300">High Priority</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-2 transition-colors duration-300">
                <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{priorityCounts.medium}</span>
              </div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 transition-colors duration-300">Medium Priority</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-2 transition-colors duration-300">
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">{priorityCounts.low}</span>
              </div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300 transition-colors duration-300">Low Priority</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;