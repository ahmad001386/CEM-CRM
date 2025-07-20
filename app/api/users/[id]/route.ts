import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hashPassword, hasPermission } from '@/lib/auth';

// GET /api/users/[id] - Get specific user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    // Users can view their own profile, or CEO can view any profile
    if (currentUserId !== params.id && !hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const users = await executeQuery(`
      SELECT 
        id, name, email, role, status, team, avatar, phone,
        last_active, last_login, created_at
      FROM users 
      WHERE id = ?
    `, [params.id]);

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت کاربر' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    // Users can update their own profile, or CEO can update any profile
    if (currentUserId !== params.id && !hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role, status, team, phone } = body;

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [params.id]
    );

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Prepare update query
    let updateQuery = 'UPDATE users SET updated_at = NOW()';
    const updateParams: any[] = [];

    if (name !== undefined) {
      updateQuery += ', name = ?';
      updateParams.push(name);
    }

    if (email !== undefined) {
      updateQuery += ', email = ?';
      updateParams.push(email);
    }

    if (password !== undefined && password.trim() !== '') {
      const hashedPassword = await hashPassword(password);
      updateQuery += ', password_hash = ?, password = ?';
      updateParams.push(hashedPassword, password);
    }

    // Only CEO can change role and status
    if (hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      if (role !== undefined) {
        updateQuery += ', role = ?';
        updateParams.push(role);
      }

      if (status !== undefined) {
        updateQuery += ', status = ?';
        updateParams.push(status);
      }
    }

    if (team !== undefined) {
      updateQuery += ', team = ?';
      updateParams.push(team);
    }

    if (phone !== undefined) {
      updateQuery += ', phone = ?';
      updateParams.push(phone);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(params.id);

    await executeSingle(updateQuery, updateParams);

    // Get updated user data
    const [updatedUser] = await executeQuery(`
      SELECT id, name, email, role, status, team, phone, updated_at
      FROM users WHERE id = ?
    `, [params.id]);

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت بروزرسانی شد',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بروزرسانی کاربر' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (CEO only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    // Only CEO can delete users
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    // Prevent CEO from deleting themselves
    if (currentUserId === params.id) {
      return NextResponse.json(
        { success: false, message: 'نمی‌توانید خودتان را حذف کنید' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [params.id]
    );

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Instead of hard delete, we'll set status to inactive
    await executeSingle(
      'UPDATE users SET status = "inactive", updated_at = NOW() WHERE id = ?',
      [params.id]
    );

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت غیرفعال شد'
    });
  } catch (error) {
    console.error('Delete user API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف کاربر' },
      { status: 500 }
    );
  }
}