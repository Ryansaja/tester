import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// SECURITY WARNING: This endpoint exposes user data for educational purposes only

export async function GET(request: NextRequest) {
  try {
    const { data: users, error } = await supabase
      .from('vulnerable_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving users:', error);
      return NextResponse.json(
        { 
          message: 'Server error occurred while retrieving users',
          code: 'SERVER_ERROR'
        },
        { status: 500 }
      );
    }

    // Return user data (intentionally exposing sensitive info for educational purposes)
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      password: user.password, // VULNERABLE: Exposing passwords
      role: user.role,
      createdAt: user.created_at
    }));

    return NextResponse.json(
      { 
        message: 'Users retrieved successfully',
        code: 'USERS_RETRIEVED',
        totalUsers: users.length,
        users: userList
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json(
      { 
        message: 'Server error occurred while retrieving users',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { status: 200 });
}