import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// SECURITY WARNING: This implementation is intentionally vulnerable for educational purposes only
// Valid test credentials - hardcoded for security testing
const VALID_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'Password123!'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation only - no input sanitization
    if (!email || !password) {
      return NextResponse.json(
        { 
          message: 'Email and password are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check hardcoded admin credentials first
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      return NextResponse.json(
        { 
          message: 'Login successful! Welcome back, Admin.',
          code: 'LOGIN_SUCCESS',
          user: {
            email: email,
            role: 'admin'
          }
        },
        { status: 200 }
      );
    }

    // Check database users
    const { data: users, error } = await supabase
      .from('vulnerable_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          message: 'Server error occurred',
          code: 'SERVER_ERROR'
        },
        { status: 500 }
      );
    }

    if (users) {
      // VULNERABLE: Plain text password comparison
      if (users.password === password) {
        return NextResponse.json(
          { 
            message: 'Login successful! Welcome back.',
            code: 'LOGIN_SUCCESS',
            user: {
              id: users.id,
              email: users.email,
              role: users.role
            }
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { 
            message: 'Invalid password. Please try again.',
            code: 'INVALID_PASSWORD'
          },
          { status: 401 }
        );
      }
    }

    // Different response for invalid email
    return NextResponse.json(
      { 
        message: 'User not found. Please check your email address.',
        code: 'USER_NOT_FOUND'
      },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        message: 'Server error occurred',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Allow OPTIONS for CORS (if needed for testing)
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}