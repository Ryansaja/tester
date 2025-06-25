'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Shield, Users, Database } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onViewUsers: () => void;
}

export default function LoginForm({ onSwitchToRegister, onViewUsers }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - required fields only
    if (!email || !password) {
      setMessage('Please fill in all required fields');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error occurred');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Security Warning Banner */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Educational Purpose Only:</strong> This login system is intentionally vulnerable for security testing and learning purposes. Never use in production.
        </AlertDescription>
      </Alert>

      {/* Database Status Banner */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Production Ready:</strong> Now using Supabase database - can be deployed to Vercel/Netlify with proper database persistence.
        </AlertDescription>
      </Alert>

      <Card className="shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>

            {message && (
              <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {messageType === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
            
            <div className="text-center">
              <Button
                onClick={onViewUsers}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                View Registered Users
              </Button>
            </div>
          </div>
          
          {/* Testing Credentials Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Default Admin Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><span className="font-medium">Email:</span> admin@test.com</div>
              <div><span className="font-medium">Password:</span> Password123!</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details for Security Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Testing Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <div><strong>Vulnerabilities:</strong></div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>No rate limiting or brute force protection</li>
            <li>No CAPTCHA or request delays</li>
            <li>Clear response differentiation for valid/invalid credentials</li>
            <li>No input sanitization or advanced validation</li>
            <li>No session management or token security</li>
            <li>Plain text password storage for registered users</li>
            <li>Public database access (RLS disabled for educational purposes)</li>
          </ul>
          <div className="mt-3">
            <strong>Compatible with:</strong> Burp Suite Intruder, OWASP ZAP, custom scripts
          </div>
          <div className="mt-2">
            <strong>Database:</strong> Supabase PostgreSQL with intentionally vulnerable configuration
          </div>
        </CardContent>
      </Card>
    </div>
  );
}