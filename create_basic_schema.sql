-- Basic CRM Database Schema
USE crm_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password VARCHAR(255), -- For development only
  role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent', 'مدیر', 'کارشناس فروش', 'مدیر فروش') DEFAULT 'sales_agent',
  status ENUM('active', 'inactive') DEFAULT 'active',
  team VARCHAR(100),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  last_login TIMESTAMP NULL,
  last_active TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Iran',
  industry VARCHAR(100),
  company_size ENUM('1-10', '11-50', '51-200', '201-1000', '1000+'),
  annual_revenue DECIMAL(15,2),
  segment ENUM('enterprise', 'small_business', 'individual') DEFAULT 'small_business',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('prospect', 'active', 'inactive', 'follow_up', 'rejected') DEFAULT 'prospect',
  assigned_to VARCHAR(36),
  source VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  customer_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(100),
  department VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  type ENUM('call', 'meeting', 'email', 'sms', 'whatsapp', 'follow_up', 'system_task') NOT NULL,
  customer_id VARCHAR(36),
  contact_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INT, -- in minutes
  performed_by VARCHAR(36),
  outcome ENUM('successful', 'follow_up_needed', 'no_response', 'completed', 'cancelled') DEFAULT 'completed',
  notes TEXT,
  attachments JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  customer_id VARCHAR(36) NOT NULL,
  type ENUM('csat', 'nps', 'ces', 'complaint', 'suggestion', 'praise') NOT NULL,
  score DECIMAL(3,2) NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  category VARCHAR(100),
  product VARCHAR(100),
  channel ENUM('email', 'website', 'phone', 'chat') DEFAULT 'website',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'inProgress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(36),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Modules table for permission system
CREATE TABLE IF NOT EXISTS modules (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User module permissions table
CREATE TABLE IF NOT EXISTS user_module_permissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  module_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  granted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_module_permission (user_id, module_id, permission_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Insert basic modules
INSERT IGNORE INTO modules (id, name, display_name) VALUES
(UUID(), 'dashboard', 'داشبورد'),
(UUID(), 'customers', 'مشتریان'),
(UUID(), 'contacts', 'مخاطبین'),
(UUID(), 'users', 'کاربران'),
(UUID(), 'activities', 'فعالیت‌ها'),
(UUID(), 'feedback', 'بازخوردها'),
(UUID(), 'reports', 'گزارش‌ها'),
(UUID(), 'settings', 'تنظیمات');

-- Insert basic permissions
INSERT IGNORE INTO permissions (id, name, display_name) VALUES
(UUID(), 'read', 'مشاهده'),
(UUID(), 'create', 'ایجاد'),
(UUID(), 'update', 'ویرایش'),
(UUID(), 'delete', 'حذف'),
(UUID(), 'manage', 'مدیریت');

-- Insert default admin user with hashed password
INSERT IGNORE INTO users (id, name, email, password_hash, password, role, status) VALUES
(UUID(), 'مدیر سیستم', 'ceo@company.com', '$2b$10$rXUOKh9zNYCvuWKkWPTTme.U3gYV5YchP.vEY6rRz1YkQaAHNJ8CG', 'admin123', 'ceo', 'active');

-- Insert sample users for testing
INSERT IGNORE INTO users (id, name, email, password_hash, password, role, status, team) VALUES
(UUID(), 'مریم احمدی', 'maryam@company.com', '$2b$10$rXUOKh9zNYCvuWKkWPTTme.U3gYV5YchP.vEY6rRz1YkQaAHNJ8CG', '123456', 'sales_agent', 'active', 'فروش'),
(UUID(), 'حسن محمدی', 'hassan@company.com', '$2b$10$rXUOKh9zNYCvuWKkWPTTme.U3gYV5YchP.vEY6rRz1YkQaAHNJ8CG', '123456', 'sales_manager', 'active', 'فروش'),
(UUID(), 'زهرا کریمی', 'zahra@company.com', '$2b$10$rXUOKh9zNYCvuWKkWPTTme.U3gYV5YchP.vEY6rRz1YkQaAHNJ8CG', '123456', 'agent', 'active', 'پشتیبانی');

-- Insert sample customers
INSERT IGNORE INTO customers (id, name, email, phone, segment, priority, status) VALUES
(UUID(), 'شرکت آکمه', 'contact@acme.com', '021-12345678', 'enterprise', 'high', 'active'),
(UUID(), 'راه‌حل‌های فناوری پارس', 'info@parstech.com', '021-87654321', 'small_business', 'medium', 'prospect');

SELECT 'Database schema created successfully!' as Status;