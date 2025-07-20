import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.get('auth-token')?.value ||
                  req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'توکن یافت نشد' },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);

    if (user) {
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get current user API error:', error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور داخلی' },
      { status: 500 }
    );
  }
}