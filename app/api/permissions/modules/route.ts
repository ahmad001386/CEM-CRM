import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { hasPermission } from '@/lib/auth';

// GET /api/permissions/modules - Get all modules
export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');

    // Only CEO can view all modules for permission management
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      return NextResponse.json(
        { success: false, message: 'عدم دسترسی' },
        { status: 403 }
      );
    }

    const modules = await executeQuery(`
      SELECT 
        m.id,
        m.name,
        m.display_name,
        m.description,
        m.parent_id,
        m.route,
        m.icon,
        m.sort_order,
        m.is_active,
        parent.display_name as parent_name
      FROM modules m
      LEFT JOIN modules parent ON m.parent_id = parent.id
      WHERE m.is_active = true
      ORDER BY m.sort_order, m.display_name
    `);

    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    console.error('Get modules API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت ماژول‌ها' },
      { status: 500 }
    );
  }
}