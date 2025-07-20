import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hasPermission } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/permissions/user/[userId] - Get user permissions
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userRole = req.headers.get('x-user-role');

    // Only CEO can view user permissions
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const userPermissions = await executeQuery(`
      SELECT 
        m.id as module_id,
        m.name as module_name,
        m.display_name as module_display_name,
        m.route,
        m.icon,
        p.id as permission_id,
        p.name as permission_name,
        p.display_name as permission_display_name,
        COALESCE(ump.granted, FALSE) as granted,
        ump.created_at
      FROM modules m
      CROSS JOIN permissions p
      LEFT JOIN user_module_permissions ump ON (
        m.id = ump.module_id AND 
        p.id = ump.permission_id AND 
        ump.user_id = ?
      )
      WHERE m.is_active = true
      ORDER BY m.sort_order, p.name
    `, [params.userId]);

    // Group by module
    const groupedPermissions: any = {};
    userPermissions.forEach((row: any) => {
      if (!groupedPermissions[row.module_id]) {
        groupedPermissions[row.module_id] = {
          module_id: row.module_id,
          module_name: row.module_name,
          module_display_name: row.module_display_name,
          route: row.route,
          icon: row.icon,
          permissions: []
        };
      }

      groupedPermissions[row.module_id].permissions.push({
        permission_id: row.permission_id,
        permission_name: row.permission_name,
        permission_display_name: row.permission_display_name,
        granted: Boolean(row.granted)
      });
    });

    return NextResponse.json({ 
      success: true, 
      data: Object.values(groupedPermissions) 
    });
  } catch (error) {
    console.error('Get user permissions API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت دسترسی‌های کاربر' },
      { status: 500 }
    );
  }
}

// POST /api/permissions/user/[userId] - Update user permissions
export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    // Only CEO can update user permissions
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { permissions } = body;

    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, message: 'داده‌های دسترسی نامعتبر' },
        { status: 400 }
      );
    }

    // Delete existing permissions for this user
    await executeSingle(
      'DELETE FROM user_module_permissions WHERE user_id = ?',
      [params.userId]
    );

    // Insert new permissions
    for (const perm of permissions) {
      if (perm.granted) {
        await executeSingle(`
          INSERT INTO user_module_permissions (
            id, user_id, module_id, permission_id, granted, created_by
          ) VALUES (?, ?, ?, ?, true, ?)
        `, [
          uuidv4(),
          params.userId,
          perm.module_id,
          perm.permission_id,
          currentUserId
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'دسترسی‌های کاربر بروزرسانی شد'
    });
  } catch (error) {
    console.error('Update user permissions API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بروزرسانی دسترسی‌های کاربر' },
      { status: 500 }
    );
  }
}