import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// SECURITY WARNING: This implementation is intentionally vulnerable for educational purposes only

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword } = await request.json();

    // Basic validation only - no input sanitization
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { 
          message: 'All fields are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          message: 'Passwords do not match',
          code: 'PASSWORD_MISMATCH'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('vulnerable_users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { 
          message: 'Server error occurred during registration',
          code: 'SERVER_ERROR'
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'User with this email already exists',
          code: 'USER_EXISTS'
        },
        { status: 409 }
      );
    }

    // Create new user - intentionally vulnerable (no password hashing)
    const { data: newUser, error: insertError } = await supabase
      .from('vulnerable_users')
      .insert([
        {
          email: email,
          password: password, // VULNERABLE: Storing plain text password
          role: 'user'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { 
          message: 'Server error occurred during registration',
          code: 'SERVER_ERROR'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Registration successful! You can now login.',
        code: 'REGISTER_SUCCESS',
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: 'Server error occurred during registration',
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