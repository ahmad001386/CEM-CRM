import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET /api/permissions/user-modules - Get current user's accessible modules
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'کاربر شناسایی نشد' },
        { status: 401 }
      );
    }

    let userModules;

    // CEO has access to all modules
    if (userRole === 'ceo' || userRole === 'مدیر') {
      userModules = await executeQuery(`
        SELECT 
          m.id,
          m.name,
          m.display_name,
          m.route,
          m.icon,
          m.sort_order,
          'manage' as permission_level
        FROM modules m
        WHERE m.is_active = true
        ORDER BY m.sort_order
      `);
    } else {
      // Get user's accessible modules
      userModules = await executeQuery(`
        SELECT DISTINCT
          m.id,
          m.name,
          m.display_name,
          m.route,
          m.icon,
          m.sort_order,
          GROUP_CONCAT(p.name) as permissions
        FROM modules m
        JOIN user_module_permissions ump ON m.id = ump.module_id
        JOIN permissions p ON ump.permission_id = p.id
        WHERE ump.user_id = ? 
          AND ump.granted = true
          AND m.is_active = true
        GROUP BY m.id, m.name, m.display_name, m.route, m.icon, m.sort_order
        ORDER BY m.sort_order
      `, [userId]);
    }

    return NextResponse.json({ success: true, data: userModules });
  } catch (error) {
    console.error('Get user modules API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت ماژول‌های کاربر' },
      { status: 500 }
    );
  }
}