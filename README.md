# Vulnerable Auth System - Educational Security Testing

This is a **deliberately vulnerable** authentication system built with Next.js and Supabase for educational security testing purposes.

## ⚠️ SECURITY WARNING

**This application is intentionally insecure and should NEVER be used in production environments.**

## Features

- 🔓 Vulnerable login system with multiple security flaws
- 📝 User registration with plain text password storage
- 👥 User enumeration endpoint
- 🗄️ Supabase database integration for production deployment
- 🚀 Ready for deployment on Vercel/Netlify

## Intentional Vulnerabilities

### Authentication Vulnerabilities
- No rate limiting or brute force protection
- No CAPTCHA or request delays
- Clear response differentiation for valid/invalid credentials
- No input sanitization
- Plain text password storage
- No session management
- Public database access

### Database Vulnerabilities
- Row Level Security (RLS) disabled for public access
- Plain text password storage in database
- No data encryption
- Exposed user enumeration

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API to get your credentials
3. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Run the migration script from `supabase/migrations/create_users_table.sql`
3. This will create the `vulnerable_users` table with intentionally insecure configuration

### 3. Local Development

```bash
npm install
npm run dev
```

### 4. Production Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your Supabase environment variables in Vercel dashboard
4. Deploy!

#### Netlify
- Not compatible due to Next.js API routes

## Default Credentials

- **Email:** admin@test.com
- **Password:** Password123!

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/register` - User registration  
- `GET /api/users` - List all users (with passwords!)

## Security Testing

This application is designed to be compatible with:
- Burp Suite Intruder
- OWASP ZAP
- Custom security testing scripts
- Manual penetration testing

## Educational Use Cases

- Learning about authentication vulnerabilities
- Practicing with security testing tools
- Understanding database security misconfigurations
- Demonstrating the importance of proper security measures

## Production Security Measures (NOT Implemented)

In a real application, you should implement:
- Password hashing (bcrypt, Argon2)
- Rate limiting and brute force protection
- Input validation and sanitization
- Proper session management
- CAPTCHA systems
- Database encryption
- Proper RLS policies
- Security headers
- HTTPS enforcement
- Audit logging

## License

This project is for educational purposes only. Use responsibly and never deploy vulnerable code to production environments.# tester
