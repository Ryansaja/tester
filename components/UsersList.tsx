'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

interface UsersListProps {
  onBack: () => void;
}

export default function UsersList({ onBack }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
        setMessage(`Successfully loaded ${data.totalUsers} users`);
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to load users');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error occurred while fetching users');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Registered Users
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Total registered users: <span className="font-bold">{totalUsers}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={onBack} variant="outline">
              ← Back to Login
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPasswords(!showPasswords)}
                variant="outline"
                size="sm"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPasswords ? 'Hide' : 'Show'} Passwords
              </Button>
              <Button
                onClick={fetchUsers}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {message && (
            <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50 mb-4' : 'border-red-200 bg-red-50 mb-4'}>
              <AlertCircle className={`h-4 w-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`} />
              <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No users registered yet</p>
              <p className="text-sm">Users will appear here after registration</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <Card key={user.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">User #{index + 1}</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Password</p>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                          {showPasswords ? user.password : '••••••••'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Registered: {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Warning */}
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Security Warning:</strong> This endpoint exposes user passwords in plain text for educational purposes. 
          In production, passwords should be hashed and never exposed through APIs.
        </AlertDescription>
      </Alert>
    </div>
  );
}