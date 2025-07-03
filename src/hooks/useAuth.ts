import { useState, useEffect } from 'react';
import { User } from '../types/User';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('taskTracker_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          loginTime: new Date(userData.loginTime)
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('taskTracker_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    const userData: User = {
      username,
      loginTime: new Date()
    };
    
    localStorage.setItem('taskTracker_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskTracker_user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}