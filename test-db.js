const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    console.log('🔗 در حال اتصال به دیتابیس...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'crm_system',
    });

    console.log('✅ اتصال به دیتابیس موفق بود!');

    // Test if users table exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'crm_system' AND TABLE_NAME = 'users'"
    );

    if (tables.length > 0) {
      console.log('✅ جدول users موجود است');

      // Check if default CEO user exists
      const [users] = await connection.execute(
        'SELECT id, name, email, role FROM users WHERE role = "ceo" LIMIT 1'
      );

      if (users.length > 0) {
        console.log('✅ کاربر مدیر عامل پیدا شد:', users[0]);
      } else {
        console.log('⚠️  کاربر مدیر عامل پیدا نشد');
        console.log('📝 ایجاد کاربر مدیر عامل...');
        
        await connection.execute(`
          INSERT INTO users (id, name, email, password_hash, password, role, status) 
          VALUES ('ceo-001', 'مدیر عامل سیستم', 'ceo@company.com', 'hashed', 'admin123', 'ceo', 'active')
          ON DUPLICATE KEY UPDATE email = email
        `);
        
        console.log('✅ کاربر مدیر عامل ایجاد شد');
        console.log('📧 ایمیل: ceo@company.com');
        console.log('🔑 رمز عبور: admin123');
      }
    } else {
      console.log('❌ جدول users وجود ندارد. لطفاً اسکریپت دیتابیس را اجرا کنید.');
    }

    await connection.end();
    console.log('🔚 اتصال دیتابیس بسته شد');

  } catch (error) {
    console.error('❌ خطا در اتصال دیتابیس:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 دیتابیس "crm_system" وجود ندارد. آیا می‌خواهید آن را ایجاد کنید؟');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 دسترسی رد شد. لطفاً username/password را بررسی کنید');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 MySQL server در حال اجرا نیست یا در پورت دیگری است');
    }
  }
}

testDatabaseConnection();