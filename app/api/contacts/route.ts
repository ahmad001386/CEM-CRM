import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeSingle } from '@/lib/database';
import { hasPermission } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET /api/contacts - Get all contacts
export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const customer_id = searchParams.get('customer_id') || '';

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (customer_id) {
      whereClause += ' AND c.customer_id = ?';
      params.push(customer_id);
    }

    // If not CEO, only show contacts of assigned customers
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      whereClause += ' AND cust.assigned_to = ?';
      params.push(userId);
    }

    const contacts = await executeQuery(`
      SELECT 
        c.*,
        cust.name as customer_name
      FROM contacts c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get total count
    const [countResult] = await executeQuery(`
      SELECT COUNT(c.id) as total
      FROM contacts c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      ${whereClause}
    `, params);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت مخاطبین' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact
export async function POST(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');
    const currentUserId = req.headers.get('x-user-id');

    const body = await req.json();
    const {
      customer_id, name, email, phone, role, department, is_primary, notes
    } = body;

    if (!customer_id || !name) {
      return NextResponse.json(
        { success: false, message: 'مشتری و نام مخاطب الزامی است' },
        { status: 400 }
      );
    }

    // Check if user has access to this customer
    if (!hasPermission(userRole || '', ['ceo', 'مدیر'])) {
      const [customer] = await executeQuery(
        'SELECT id FROM customers WHERE id = ? AND assigned_to = ?',
        [customer_id, currentUserId]
      );

      if (!customer) {
        return NextResponse.json(
          { success: false, message: 'عدم دسترسی به این مشتری' },
          { status: 403 }
        );
      }
    }

    const contactId = uuidv4();

    await executeSingle(`
      INSERT INTO contacts (
        id, customer_id, name, email, phone, role, department, is_primary, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `, [
      contactId, customer_id, name, email, phone, role, department, 
      is_primary || false, notes
    ]);

    const [newContact] = await executeQuery(`
      SELECT c.*, cust.name as customer_name
      FROM contacts c
      LEFT JOIN customers cust ON c.customer_id = cust.id
      WHERE c.id = ?
    `, [contactId]);

    return NextResponse.json({
      success: true,
      message: 'مخاطب با موفقیت ایجاد شد',
      data: newContact
    });
  } catch (error) {
    console.error('Create contact API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد مخاطب' },
      { status: 500 }
    );
  }
}