'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import UsersList from '@/components/UsersList';

type ViewType = 'login' | 'register' | 'users';

export default function AuthApp() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');
  const switchToUsers = () => setCurrentView('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {currentView === 'login' && (
        <LoginForm 
          onSwitchToRegister={switchToRegister}
          onViewUsers={switchToUsers}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
      {currentView === 'users' && (
        <UsersList onBack={switchToLogin} />
      )}
    </div>
  );
}