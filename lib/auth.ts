import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { executeQuery } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  team?: string;
  avatar?: string;
  last_active?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Login function
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Get user from database - removed status filter for debugging
    const users = await executeQuery<any>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('🔍 User search result:', users.length > 0 ? 'User found' : 'User not found');
    console.log('📧 Email searched:', email);

    if (users.length === 0) {
      return {
        success: false,
        message: 'کاربری با این ایمیل یافت نشد'
      };
    }

    const user = users[0];
    console.log('👤 User found:', { id: user.id, email: user.email, status: user.status, role: user.role });

    // Check if user is active
    if (user.status !== 'active') {
      return {
        success: false,
        message: 'حساب کاربری غیرفعال است'
      };
    }

    // Check password - for development, check both hashed and plain text
    let passwordValid = false;
    
    console.log('🔑 Password check - Input:', password);
    console.log('🔑 Password in DB:', user.password);
    
    if (user.password_hash) {
      passwordValid = await verifyPassword(password, user.password_hash);
      console.log('🔍 Hash password check:', passwordValid);
    }
    
    // For development - also check plain text password
    if (!passwordValid && user.password) {
      passwordValid = password === user.password;
      console.log('🔍 Plain password check:', passwordValid);
    }

    if (!passwordValid) {
      return {
        success: false,
        message: 'رمز عبور اشتباه است'
      };
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW(), last_active = NOW() WHERE id = ?',
      [user.id]
    );

    // Prepare user data (without sensitive info)
    const userData: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      team: user.team,
      avatar: user.avatar,
      last_active: user.last_active,
    };

    // Generate token
    const token = generateToken(userData);

    console.log('✅ Login successful for:', user.email);

    return {
      success: true,
      user: userData,
      token,
      message: 'ورود موفق'
    };
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: 'خطا در سیستم'
    };
  }
}

// Get current user by token
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const users = await executeQuery<any>(
      'SELECT id, name, email, role, status, team, avatar, last_active FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    return users.length > 0 ? users[0] : null;
  } catch (error) {
    return null;
  }
}

// Check if user has permission
export function hasPermission(userRole: string, requiredRole: string[]): boolean {
  const roleHierarchy: { [key: string]: number } = {
    'agent': 1,
    'sales_agent': 2,
    'کارشناس فروش': 2,
    'sales_manager': 3,
    'مدیر فروش': 3,
    'مدیر': 4,
    'ceo': 5
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const minRequiredLevel = Math.min(...requiredRole.map(role => roleHierarchy[role] || 0));

  return userLevel >= minRequiredLevel;
}