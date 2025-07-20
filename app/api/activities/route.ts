import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hasPermission } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/activities - Get all activities
export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    const { searchParams } = new URL(req.url);
    const customer_id = searchParams.get('customer_id') || '';
    const deal_id = searchParams.get('deal_id') || '';
    const type = searchParams.get('type') || '';

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (customer_id) {
      whereClause += ' AND a.customer_id = ?';
      params.push(customer_id);
    }

    if (deal_id) {
      whereClause += ' AND a.deal_id = ?';
      params.push(deal_id);
    }

    if (type) {
      whereClause += ' AND a.type = ?';
      params.push(type);
    }

    // If not CEO, only show own activities
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      whereClause += ' AND a.performed_by = ?';
      params.push(userId);
    }

    const activities = await executeQuery(`
      SELECT 
        a.*,
        c.name as customer_name,
        u.name as performed_by_name
      FROM activities a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN users u ON a.performed_by = u.id
      ${whereClause}
      ORDER BY a.start_time DESC
      LIMIT 50
    `, params);

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Get activities API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت فعالیت‌ها' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create new activity  
export async function POST(req: NextRequest) {
  try {
    const currentUserId = req.headers.get('x-user-id');
    const body = await req.json();
    const {
      customer_id, deal_id, type, title, description,
      start_time, end_time, outcome, location
    } = body;

    if (!customer_id || !type || !title) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات فعالیت کامل نیست' },
        { status: 400 }
      );
    }

    const activityId = uuidv4();

    await executeSingle(`
      INSERT INTO activities (
        id, customer_id, deal_id, type, title, description,
        start_time, end_time, performed_by, outcome, location, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [activityId, customer_id, deal_id, type, title, description,
        start_time, end_time, currentUserId, outcome || 'completed', location]);

    return NextResponse.json({
      success: true,
      message: 'فعالیت با موفقیت ایجاد شد'
    });
  } catch (error) {
    console.error('Create activity API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد فعالیت' },
      { status: 500 }
    );
  }
}