import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hasPermission } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/tasks - Get all tasks
export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const assigned_to = searchParams.get('assigned_to') || '';

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (status) {
      whereClause += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      whereClause += ' AND t.priority = ?';
      params.push(priority);
    }

    if (assigned_to) {
      whereClause += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }

    // If not CEO, only show assigned tasks or created tasks
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      whereClause += ' AND (t.assigned_to = ? OR t.assigned_by = ?)';
      params.push(userId, userId);
    }

    const tasks = await executeQuery(`
      SELECT 
        t.*,
        c.name as customer_name,
        u1.name as assigned_to_name,
        u2.name as assigned_by_name
      FROM tasks t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.assigned_by = u2.id
      ${whereClause}
      ORDER BY t.due_date ASC, t.priority DESC
    `, params);

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Get tasks API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت وظایف' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(req: NextRequest) {
  try {
    const currentUserId = req.headers.get('x-user-id');
    const body = await req.json();
    const {
      title, description, customer_id, deal_id, assigned_to,
      priority, category, due_date
    } = body;

    if (!title || !assigned_to) {
      return NextResponse.json(
        { success: false, message: 'عنوان و فرد مسئول الزامی است' },
        { status: 400 }
      );
    }

    const taskId = uuidv4();

    await executeSingle(`
      INSERT INTO tasks (
        id, title, description, customer_id, deal_id, assigned_to,
        assigned_by, priority, category, status, due_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
    `, [taskId, title, description, customer_id, deal_id, assigned_to,
        currentUserId, priority || 'medium', category || 'follow_up', due_date]);

    return NextResponse.json({
      success: true,
      message: 'وظیفه با موفقیت ایجاد شد'
    });
  } catch (error) {
    console.error('Create task API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد وظیفه' },
      { status: 500 }
    );
  }
}