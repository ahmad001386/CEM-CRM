-- =====================================================
-- CRM Database Structure for MySQL
-- Supports: CEO + Sales Team roles, Customer Management, 
-- Sales Pipeline, Support, Analytics, Projects
-- Scale: Medium Business (100-10K customers)
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS crm_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE crm_system;

-- =====================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Users table (CEO and Sales team)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent') DEFAULT 'sales_agent',
    status ENUM('active', 'inactive', 'away', 'online', 'offline') DEFAULT 'active',
    avatar VARCHAR(500),
    phone VARCHAR(50),
    team VARCHAR(100),
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- User sessions (for authentication tracking)
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User permissions (role-based access control)
CREATE TABLE user_permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    resource VARCHAR(100) NOT NULL, -- customers, deals, reports, settings, etc.
    action VARCHAR(50) NOT NULL,    -- read, write, delete, manage
    granted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_permission (user_id, resource, action),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 2. CUSTOMER MANAGEMENT
-- =====================================================

-- Customers/Companies table
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Iran',
    postal_code VARCHAR(20),
    
    -- Business Info
    industry VARCHAR(100),
    company_size ENUM('1-10', '11-50', '51-200', '201-1000', '1000+'),
    annual_revenue DECIMAL(15,2),
    
    -- CRM Specific
    status ENUM('active', 'inactive', 'follow_up', 'rejected', 'prospect', 'customer') DEFAULT 'prospect',
    segment ENUM('enterprise', 'small_business', 'individual') DEFAULT 'small_business',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    assigned_to VARCHAR(36),
    
    -- Metrics
    total_tickets INT DEFAULT 0,
    satisfaction_score DECIMAL(3,2), -- 0.00 to 5.00
    potential_value DECIMAL(15,2),
    actual_value DECIMAL(15,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_interaction TIMESTAMP,
    last_contact_date TIMESTAMP,
    contact_attempts INT DEFAULT 0,
    
    INDEX idx_status (status),
    INDEX idx_segment (segment),
    INDEX idx_priority (priority),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Individual contacts within companies
CREATE TABLE contacts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_email (email),
    INDEX idx_is_primary (is_primary),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Customer tags (for categorization)
CREATE TABLE customer_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_customer_tag (customer_id, tag),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 3. PRODUCTS & PRICING
-- =====================================================

-- Products catalog
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    specifications TEXT,
    base_price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IRR',
    is_active BOOLEAN DEFAULT TRUE,
    inventory INT DEFAULT 999,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- Product discounts
CREATE TABLE product_discounts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_quantity INT DEFAULT 1,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 4. SALES PIPELINE & DEALS
-- =====================================================

-- Pipeline stage definitions
CREATE TABLE pipeline_stages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- new_lead, contacted, needs_analysis, etc.
    description TEXT,
    stage_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color for UI
    
    UNIQUE KEY unique_stage_order (stage_order)
) ENGINE=InnoDB;

-- Insert default pipeline stages
INSERT INTO pipeline_stages (name, code, stage_order) VALUES
('سرنخ جدید', 'new_lead', 1),
('تماس برقرار شده', 'contacted', 2),
('تحلیل نیازمندی', 'needs_analysis', 3),
('پیشنهاد ارسال شده', 'proposal_sent', 4),
('مذاکره', 'negotiation', 5),
('بسته شده - موفق', 'closed_won', 6),
('بسته شده - ناموفق', 'closed_lost', 7);

-- Deals/Opportunities
CREATE TABLE deals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Financial
    total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'IRR',
    
    -- Pipeline
    stage_id VARCHAR(36) NOT NULL,
    probability INT DEFAULT 50, -- 0-100%
    
    -- Timeline
    expected_close_date DATE,
    actual_close_date DATE,
    
    -- Assignment
    assigned_to VARCHAR(36) NOT NULL,
    
    -- Outcome (for closed deals)
    loss_reason TEXT,
    won_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_stage_id (stage_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_expected_close_date (expected_close_date),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB;

-- Deal products (many-to-many with quantities)
CREATE TABLE deal_products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    deal_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    total_price DECIMAL(15,2) NOT NULL,
    
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- Deal stage history (tracking progression)
CREATE TABLE deal_stage_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    deal_id VARCHAR(36) NOT NULL,
    stage_id VARCHAR(36) NOT NULL,
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exited_at TIMESTAMP NULL,
    changed_by VARCHAR(36),
    notes TEXT,
    
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id),
    FOREIGN KEY (changed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- =====================================================
-- 5. ACTIVITIES & INTERACTIONS
-- =====================================================

-- Customer activities (calls, meetings, emails, etc.)
CREATE TABLE activities (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    deal_id VARCHAR(36),
    type ENUM('call', 'meeting', 'email', 'sms', 'whatsapp', 'follow_up', 'system_task') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Timing
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration INT, -- minutes
    
    -- Details
    performed_by VARCHAR(36) NOT NULL,
    outcome ENUM('successful', 'follow_up_needed', 'no_response', 'completed', 'cancelled') DEFAULT 'completed',
    location VARCHAR(255),
    attendees JSON, -- for meetings
    
    -- Attachments
    attachments JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_type (type),
    INDEX idx_performed_by (performed_by),
    INDEX idx_start_time (start_time),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Customer interactions (broader tracking)
CREATE TABLE interactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    type ENUM('email', 'phone', 'chat', 'meeting', 'website', 'social') NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    direction ENUM('inbound', 'outbound') NOT NULL,
    channel VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT, -- minutes
    outcome TEXT,
    sentiment ENUM('positive', 'neutral', 'negative'),
    
    performed_by VARCHAR(36),
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_type (type),
    INDEX idx_date (date),
    INDEX idx_performed_by (performed_by),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- =====================================================
-- 6. NOTES & TASKS
-- =====================================================

-- Notes (customer insights, objections, etc.)
CREATE TABLE notes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36),
    deal_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('customer_need', 'sales_tip', 'objection', 'general', 'technical', 'pricing') DEFAULT 'general',
    is_private BOOLEAN DEFAULT FALSE,
    
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_category (category),
    INDEX idx_created_by (created_by),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Note tags
CREATE TABLE note_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    note_id VARCHAR(36) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    
    UNIQUE KEY unique_note_tag (note_id, tag),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tasks and follow-ups
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    customer_id VARCHAR(36),
    deal_id VARCHAR(36),
    
    -- Assignment
    assigned_to VARCHAR(36) NOT NULL,
    assigned_by VARCHAR(36) NOT NULL,
    
    -- Priority & Status
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    category ENUM('call', 'meeting', 'follow_up', 'proposal', 'admin', 'other') DEFAULT 'follow_up',
    
    -- Timeline
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_customer_id (customer_id),
    INDEX idx_deal_id (deal_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- =====================================================
-- 7. SUPPORT SYSTEM
-- =====================================================

-- Support tickets
CREATE TABLE tickets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'waiting_customer', 'closed') DEFAULT 'open',
    category VARCHAR(100),
    
    -- Assignment
    assigned_to VARCHAR(36),
    created_by VARCHAR(36),
    
    -- Resolution
    resolution TEXT,
    resolution_time INT, -- minutes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Ticket updates/comments
CREATE TABLE ticket_updates (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('comment', 'status_change', 'assignment_change', 'priority_change') DEFAULT 'comment',
    content TEXT,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- =====================================================
-- 8. FEEDBACK & SURVEYS
-- =====================================================

-- Customer feedback
CREATE TABLE feedback (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    type ENUM('csat', 'nps', 'ces', 'complaint', 'suggestion', 'praise') NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    score DECIMAL(3,2), -- 0.00 to 10.00 (for NPS) or 1.00 to 5.00 (for CSAT)
    
    -- Context
    product VARCHAR(255),
    channel ENUM('email', 'website', 'phone', 'chat', 'sms', 'survey') DEFAULT 'website',
    category VARCHAR(100),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'dismissed') DEFAULT 'pending',
    
    -- Sentiment analysis
    sentiment ENUM('positive', 'neutral', 'negative'),
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    INDEX idx_sentiment (sentiment),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Survey campaigns
CREATE TABLE surveys (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('csat', 'nps', 'custom', 'product', 'employee') DEFAULT 'csat',
    status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
    
    target_responses INT DEFAULT 100,
    actual_responses INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    
    created_by VARCHAR(36),
    
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Survey questions
CREATE TABLE survey_questions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    survey_id VARCHAR(36) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('rating', 'text', 'multiple_choice', 'yes_no') NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    options JSON, -- for multiple choice
    order_index INT NOT NULL,
    
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Survey responses
CREATE TABLE survey_responses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    survey_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36),
    response_text TEXT,
    response_value DECIMAL(3,2),
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- 9. PROJECT MANAGEMENT
-- =====================================================

-- Customer projects
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Financial
    budget DECIMAL(15,2),
    spent DECIMAL(15,2) DEFAULT 0,
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Progress
    progress DECIMAL(5,2) DEFAULT 0, -- 0.00 to 100.00%
    
    -- Assignment
    manager_id VARCHAR(36),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_manager_id (manager_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Project team members
CREATE TABLE project_team (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role VARCHAR(100) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_project_user (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Project milestones
CREATE TABLE project_milestones (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    order_index INT,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Project tags
CREATE TABLE project_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id VARCHAR(36) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    
    UNIQUE KEY unique_project_tag (project_id, tag),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 10. CALENDAR & SCHEDULING
-- =====================================================

-- Calendar events
CREATE TABLE calendar_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Timing
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    
    -- Type and context
    type ENUM('call', 'meeting', 'follow_up', 'task', 'reminder', 'personal') DEFAULT 'meeting',
    customer_id VARCHAR(36),
    deal_id VARCHAR(36),
    project_id VARCHAR(36),
    
    -- Location
    location VARCHAR(255),
    meeting_link VARCHAR(500),
    
    -- Assignment
    assigned_to VARCHAR(36) NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    
    -- Reminders
    reminder_minutes INT DEFAULT 15,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_customer_id (customer_id),
    INDEX idx_start_date (start_date),
    INDEX idx_type (type),
    INDEX idx_status (status),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB;

-- Event attendees
CREATE TABLE event_attendees (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    contact_id VARCHAR(36),
    email VARCHAR(255),
    name VARCHAR(255),
    response ENUM('pending', 'accepted', 'declined', 'maybe') DEFAULT 'pending',
    
    FOREIGN KEY (event_id) REFERENCES calendar_events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 11. ANALYTICS & REPORTING
-- =====================================================

-- User targets and quotas
CREATE TABLE user_targets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    period ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Targets
    sales_count_target INT DEFAULT 0,
    sales_amount_target DECIMAL(15,2) DEFAULT 0,
    call_count_target INT DEFAULT 0,
    deal_count_target INT DEFAULT 0,
    meeting_count_target INT DEFAULT 0,
    
    -- Current progress
    current_sales_count INT DEFAULT 0,
    current_sales_amount DECIMAL(15,2) DEFAULT 0,
    current_call_count INT DEFAULT 0,
    current_deal_count INT DEFAULT 0,
    current_meeting_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_period (user_id, period, start_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Customer health scores
CREATE TABLE customer_health (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    
    -- Health metrics
    overall_score INT DEFAULT 50, -- 0-100
    usage_score INT DEFAULT 50,
    satisfaction_score INT DEFAULT 50,
    financial_score INT DEFAULT 50,
    support_score INT DEFAULT 50,
    
    -- Risk indicators
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    risk_factors JSON,
    
    -- Calculations
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_customer_health (customer_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- System alerts and notifications
CREATE TABLE alerts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('info', 'warning', 'error', 'success') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    
    -- Targeting
    user_id VARCHAR(36), -- specific user, NULL for all
    customer_id VARCHAR(36), -- related customer
    deal_id VARCHAR(36), -- related deal
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Voice of Customer analysis
CREATE TABLE voc_insights (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    impact ENUM('low', 'medium', 'high') NOT NULL,
    category VARCHAR(100),
    status ENUM('new', 'in_progress', 'completed', 'dismissed') DEFAULT 'new',
    source VARCHAR(100), -- 'feedback', 'tickets', 'surveys'
    frequency INT DEFAULT 1,
    
    -- Data
    keywords JSON,
    sentiment_trend JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_impact (impact)
) ENGINE=InnoDB;

-- =====================================================
-- 12. SYSTEM CONFIGURATION
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- can non-CEO users see this?
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    
    FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Activity log (audit trail)
CREATE TABLE activity_log (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    resource_type VARCHAR(50) NOT NULL, -- 'customer', 'deal', 'user', etc.
    resource_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_resource_type (resource_type),
    INDEX idx_resource_id (resource_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default CEO user (password should be hashed in real application)
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
('ceo-001', 'مدیر کل سیستم', 'ceo@company.com', '$2b$10$defaulthashedpassword', 'ceo', 'active');

-- Insert default permissions for CEO (full access)
INSERT INTO user_permissions (user_id, resource, action) VALUES
('ceo-001', 'users', 'manage'),
('ceo-001', 'customers', 'manage'),
('ceo-001', 'deals', 'manage'),
('ceo-001', 'products', 'manage'),
('ceo-001', 'tickets', 'manage'),
('ceo-001', 'feedback', 'manage'),
('ceo-001', 'projects', 'manage'),
('ceo-001', 'reports', 'manage'),
('ceo-001', 'settings', 'manage'),
('ceo-001', 'analytics', 'manage');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('company_name', 'شرکت CRM', 'string', 'نام شرکت', TRUE),
('currency', 'IRR', 'string', 'واحد پول پیش‌فرض', TRUE),
('timezone', 'Asia/Tehran', 'string', 'منطقه زمانی', TRUE),
('language', 'fa', 'string', 'زبان پیش‌فرض', TRUE),
('max_file_size', '10485760', 'number', 'حداکثر اندازه فایل (بایت)', FALSE);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Customer summary view
CREATE VIEW customer_summary AS
SELECT 
    c.*,
    u.name as assigned_user_name,
    COUNT(DISTINCT d.id) as total_deals,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT a.id) as total_activities,
    SUM(CASE WHEN d.stage_id IN (SELECT id FROM pipeline_stages WHERE code = 'closed_won') THEN d.total_value ELSE 0 END) as won_value,
    AVG(f.score) as avg_feedback_score
FROM customers c
LEFT JOIN users u ON c.assigned_to = u.id
LEFT JOIN deals d ON c.id = d.customer_id
LEFT JOIN tickets t ON c.id = t.customer_id
LEFT JOIN activities a ON c.id = a.customer_id
LEFT JOIN feedback f ON c.id = f.customer_id
GROUP BY c.id;

-- Sales pipeline view
CREATE VIEW sales_pipeline AS
SELECT 
    d.*,
    c.name as customer_name,
    c.segment as customer_segment,
    u.name as assigned_user_name,
    ps.name as stage_name,
    ps.stage_order,
    DATEDIFF(NOW(), d.created_at) as days_in_pipeline,
    CASE 
        WHEN d.expected_close_date < NOW() AND ps.code NOT IN ('closed_won', 'closed_lost') THEN 'overdue'
        WHEN d.expected_close_date < DATE_ADD(NOW(), INTERVAL 7 DAY) AND ps.code NOT IN ('closed_won', 'closed_lost') THEN 'due_soon'
        ELSE 'on_track'
    END as timeline_status
FROM deals d
LEFT JOIN customers c ON d.customer_id = c.id
LEFT JOIN users u ON d.assigned_to = u.id
LEFT JOIN pipeline_stages ps ON d.stage_id = ps.id;

-- User performance view
CREATE VIEW user_performance AS
SELECT 
    u.id,
    u.name,
    u.role,
    COUNT(DISTINCT c.id) as assigned_customers,
    COUNT(DISTINCT d.id) as total_deals,
    SUM(CASE WHEN ps.code = 'closed_won' THEN d.total_value ELSE 0 END) as won_amount,
    COUNT(CASE WHEN ps.code = 'closed_won' THEN 1 END) as won_deals,
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(DISTINCT t.id) as assigned_tickets,
    AVG(f.score) as avg_customer_satisfaction
FROM users u
LEFT JOIN customers c ON u.id = c.assigned_to
LEFT JOIN deals d ON u.id = d.assigned_to
LEFT JOIN pipeline_stages ps ON d.stage_id = ps.id
LEFT JOIN activities a ON u.id = a.performed_by
LEFT JOIN tickets t ON u.id = t.assigned_to
LEFT JOIN feedback f ON c.id = f.customer_id
WHERE u.role != 'ceo'
GROUP BY u.id;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional performance indexes
CREATE INDEX idx_deals_stage_assigned ON deals (stage_id, assigned_to);
CREATE INDEX idx_activities_customer_date ON activities (customer_id, start_time);
CREATE INDEX idx_feedback_customer_type ON feedback (customer_id, type);
CREATE INDEX idx_tasks_assigned_status ON tasks (assigned_to, status);
CREATE INDEX idx_tickets_customer_status ON tickets (customer_id, status);

-- Full-text search indexes (for Persian text)
ALTER TABLE customers ADD FULLTEXT(name, address);
ALTER TABLE deals ADD FULLTEXT(title, description);
ALTER TABLE notes ADD FULLTEXT(title, content);
ALTER TABLE feedback ADD FULLTEXT(comment);

-- =====================================================
-- TRIGGERS FOR DATA CONSISTENCY
-- =====================================================

-- Update customer last_interaction when activity is added
DELIMITER //
CREATE TRIGGER update_customer_last_interaction
AFTER INSERT ON activities
FOR EACH ROW
BEGIN
    UPDATE customers 
    SET last_interaction = NEW.start_time,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
END //
DELIMITER ;

-- Update deal stage history when deal stage changes
DELIMITER //
CREATE TRIGGER update_deal_stage_history
AFTER UPDATE ON deals
FOR EACH ROW
BEGIN
    IF OLD.stage_id != NEW.stage_id THEN
        -- Close previous stage
        UPDATE deal_stage_history 
        SET exited_at = CURRENT_TIMESTAMP 
        WHERE deal_id = NEW.id AND exited_at IS NULL;
        
        -- Add new stage entry
        INSERT INTO deal_stage_history (deal_id, stage_id, entered_at)
        VALUES (NEW.id, NEW.stage_id, CURRENT_TIMESTAMP);
    END IF;
END //
DELIMITER ;

-- Update target progress when deal is won
DELIMITER //
CREATE TRIGGER update_target_progress
AFTER UPDATE ON deals
FOR EACH ROW
BEGIN
    IF OLD.stage_id != NEW.stage_id THEN
        -- Check if deal moved to closed_won
        IF NEW.stage_id IN (SELECT id FROM pipeline_stages WHERE code = 'closed_won') THEN
            UPDATE user_targets 
            SET 
                current_deal_count = current_deal_count + 1,
                current_sales_amount = current_sales_amount + NEW.total_value,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = NEW.assigned_to 
            AND start_date <= CURRENT_DATE 
            AND end_date >= CURRENT_DATE;
        END IF;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Show database summary
SELECT 'CRM Database Structure Created Successfully!' as Status;
SELECT COUNT(*) as Total_Tables FROM information_schema.tables WHERE table_schema = 'crm_system';