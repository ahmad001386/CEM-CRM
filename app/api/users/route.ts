import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hashPassword, hasPermission } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/users - Get all users (CEO only)
export async function GET(req: NextRequest) {
  try {
    // Get token from header
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.headers.get('x-token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'توکن نامعتبر' },
        { status: 401 }
      );
    }

    // Check permission - only CEO can view all users
    if (!hasPermission(decoded.role || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const users = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        role,
        status,
        team,
        avatar,
        phone,
        last_active,
        last_login,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت کاربران' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (CEO only)
export async function POST(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    // Check permission - only CEO can create users
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role, team, phone } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'لطفاً تمام فیلدهای اجباری را پر کنید' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: 'کاربر با این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();

    // Insert new user
    await executeSingle(`
      INSERT INTO users (
        id, name, email, password_hash, password, role, status, team, phone, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
    `, [userId, name, email, hashedPassword, password, role, team || null, phone || null, currentUserId]);

    // Get the created user (without sensitive data)
    const [newUser] = await executeQuery(`
      SELECT id, name, email, role, status, team, phone, created_at
      FROM users WHERE id = ?
    `, [userId]);

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      data: newUser
    });
  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد کاربر' },
      { status: 500 }
    );
  }
}