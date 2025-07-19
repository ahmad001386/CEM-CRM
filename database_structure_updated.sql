-- =====================================================
-- UPDATED CRM Database Structure for MySQL
-- Updated to match ALL fields from mock-data.ts
-- =====================================================

-- Apply all corrections and additions to existing schema
USE crm_system;

-- =====================================================
-- SCHEMA UPDATES & CORRECTIONS
-- =====================================================

-- 1. Update user roles to support Persian role names
ALTER TABLE users MODIFY COLUMN role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent', 'مدیر', 'کارشناس فروش', 'مدیر فروش') DEFAULT 'sales_agent';

-- 2. Add password field for development (use password_hash in production)
ALTER TABLE users ADD COLUMN password VARCHAR(255) AFTER email;

-- 3. Update calendar events field names to match mock data
ALTER TABLE calendar_events CHANGE start_date startDate TIMESTAMP NOT NULL;
ALTER TABLE calendar_events CHANGE end_date endDate TIMESTAMP NOT NULL;

-- 4. Add missing fields to activities table
ALTER TABLE activities ADD COLUMN contact_id VARCHAR(36) AFTER customer_id;
ALTER TABLE activities ADD COLUMN attachments JSON AFTER outcome;
ALTER TABLE activities ADD FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL;

-- 5. Add denormalized customer names for performance
ALTER TABLE feedback ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;
ALTER TABLE tickets ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;
ALTER TABLE interactions ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;

-- 6. Add resolved_by to feedback
ALTER TABLE feedback ADD COLUMN resolved_by VARCHAR(36) AFTER resolved_at;
ALTER TABLE feedback ADD FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL;

-- 7. Add sales pipeline tracking fields to deals
ALTER TABLE deals ADD COLUMN product_selected BOOLEAN DEFAULT FALSE AFTER probability;
ALTER TABLE deals ADD COLUMN contact_made BOOLEAN DEFAULT FALSE AFTER product_selected;
ALTER TABLE deals ADD COLUMN purchased BOOLEAN DEFAULT FALSE AFTER contact_made;
ALTER TABLE deals ADD COLUMN next_action TEXT AFTER purchased;
ALTER TABLE deals ADD COLUMN contact_attempts INT DEFAULT 0 AFTER next_action;

-- =====================================================
-- NEW ANALYTICS & REPORTING TABLES
-- =====================================================

-- Analytics aggregations table
CREATE TABLE analytics_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    metric_type ENUM('csat', 'nps', 'customer_health', 'touchpoints', 'sales_performance') NOT NULL,
    period ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly') NOT NULL,
    period_date DATE NOT NULL,
    category VARCHAR(100), -- channel, department, product, etc.
    aggregated_data JSON NOT NULL,
    total_records INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_metric_period (metric_type, period, period_date, category),
    INDEX idx_metric_type (metric_type),
    INDEX idx_period (period_date),
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- Sentiment analysis results
CREATE TABLE sentiment_analysis (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    source_type ENUM('feedback', 'interaction', 'survey_response', 'note', 'ticket') NOT NULL,
    source_id VARCHAR(36) NOT NULL,
    text_content TEXT NOT NULL,
    sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0, -- 0.00 to 1.00
    sentiment_score DECIMAL(3,2) DEFAULT 0, -- -1.00 to 1.00
    keywords JSON,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_source_type_id (source_type, source_id),
    INDEX idx_sentiment (sentiment),
    INDEX idx_analyzed_at (analyzed_at)
) ENGINE=InnoDB;

-- Word cloud and keyword tracking
CREATE TABLE word_cloud_data (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    word VARCHAR(255) NOT NULL,
    count INT NOT NULL DEFAULT 1,
    sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
    category VARCHAR(100), -- support, product, sales, general
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_word_period (word, category, period_start, period_end),
    INDEX idx_word (word),
    INDEX idx_sentiment (sentiment),
    INDEX idx_category (category),
    INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB;

-- Customer touchpoints tracking
CREATE TABLE touchpoints (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(255),
    type ENUM('support', 'sales', 'feedback', 'onboarding', 'general') NOT NULL,
    channel ENUM('email', 'phone', 'chat', 'in_person', 'social', 'website') NOT NULL,
    date TIMESTAMP NOT NULL,
    score DECIMAL(3,2), -- 1.00 to 5.00
    agent_id VARCHAR(36),
    agent_name VARCHAR(255),
    description TEXT,
    status ENUM('completed', 'in_progress', 'scheduled', 'cancelled') DEFAULT 'completed',
    response_time INT, -- minutes
    resolution_time INT, -- minutes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_type (type),
    INDEX idx_channel (channel),
    INDEX idx_date (date),
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- CSAT specific aggregations
CREATE TABLE csat_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_date DATE NOT NULL,
    channel VARCHAR(50),
    department VARCHAR(50),
    product VARCHAR(100),
    
    -- Main metrics
    average_score DECIMAL(3,2) NOT NULL,
    total_responses INT NOT NULL,
    previous_score DECIMAL(3,2),
    target_score DECIMAL(3,2) DEFAULT 4.5,
    
    -- Distribution
    score_1 INT DEFAULT 0,
    score_2 INT DEFAULT 0,
    score_3 INT DEFAULT 0,
    score_4 INT DEFAULT 0,
    score_5 INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_csat_period (period_type, period_date, channel, department, product),
    INDEX idx_period (period_date),
    INDEX idx_channel (channel),
    INDEX idx_department (department),
    INDEX idx_average_score (average_score)
) ENGINE=InnoDB;

-- NPS specific aggregations  
CREATE TABLE nps_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_date DATE NOT NULL,
    channel VARCHAR(50),
    product VARCHAR(100),
    
    -- Main metrics
    nps_score INT NOT NULL, -- -100 to 100
    total_responses INT NOT NULL,
    previous_score INT,
    target_score INT DEFAULT 50,
    
    -- Distribution
    promoters INT NOT NULL DEFAULT 0, -- 9-10
    passives INT NOT NULL DEFAULT 0,  -- 7-8  
    detractors INT NOT NULL DEFAULT 0, -- 0-6
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_nps_period (period_type, period_date, channel, product),
    INDEX idx_period (period_date),
    INDEX idx_channel (channel),
    INDEX idx_product (product),
    INDEX idx_nps_score (nps_score)
) ENGINE=InnoDB;

-- Customer health score tracking
CREATE TABLE customer_health_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    
    -- Health scores
    overall_score INT NOT NULL, -- 0-100
    usage_score INT DEFAULT 50,
    csat_score INT DEFAULT 50,
    nps_score INT DEFAULT 50,
    financial_score INT DEFAULT 50,
    support_score INT DEFAULT 50,
    
    -- Status and trend
    health_status ENUM('green', 'yellow', 'red') NOT NULL,
    trend_direction ENUM('improving', 'stable', 'declining') DEFAULT 'stable',
    
    -- Risk assessment
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    risk_factors JSON,
    
    -- Metadata
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    
    INDEX idx_customer_id (customer_id),
    INDEX idx_overall_score (overall_score),
    INDEX idx_health_status (health_status),
    INDEX idx_calculated_at (calculated_at),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dashboard statistics cache
CREATE TABLE dashboard_cache (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(36), -- NULL for global stats
    cache_data JSON NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_cache_key (cache_key),
    INDEX idx_expires (expires_at),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Voice of Customer insights
CREATE TABLE voc_data (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('request', 'complaint', 'compliment', 'suggestion') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_review', 'in_progress', 'completed', 'dismissed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high') NOT NULL,
    source VARCHAR(100) NOT NULL, -- 'feedback', 'survey', 'tickets', etc.
    department VARCHAR(100),
    category VARCHAR(100),
    frequency INT DEFAULT 1,
    
    -- Customer impact
    customer_count INT DEFAULT 1,
    revenue_impact DECIMAL(15,2),
    
    -- Analysis data
    keywords JSON,
    sentiment_data JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_source (source),
    INDEX idx_department (department),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Survey templates and reusable questions
CREATE TABLE survey_templates (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    type ENUM('csat', 'nps', 'ces', 'custom') NOT NULL,
    description TEXT,
    questions JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    
    INDEX idx_type (type),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Emotion and mood tracking
CREATE TABLE emotion_analysis (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    source_type ENUM('feedback', 'interaction', 'survey', 'ticket') NOT NULL,
    source_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36),
    
    -- Emotion data
    primary_emotion ENUM('joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation', 'neutral') NOT NULL,
    emotion_intensity DECIMAL(3,2) DEFAULT 0.5, -- 0.00 to 1.00
    emotion_scores JSON, -- detailed breakdown of all emotions
    
    -- Context
    text_analyzed TEXT,
    channel VARCHAR(50),
    date_analyzed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_source_type_id (source_type, source_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_primary_emotion (primary_emotion),
    INDEX idx_date_analyzed (date_analyzed),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- UPDATED VIEWS WITH NEW FIELDS
-- =====================================================

-- Drop existing views
DROP VIEW IF EXISTS customer_summary;
DROP VIEW IF EXISTS sales_pipeline;  
DROP VIEW IF EXISTS user_performance;

-- Updated customer summary view
CREATE VIEW customer_summary AS
SELECT 
    c.*,
    u.name as assigned_user_name,
    COUNT(DISTINCT d.id) as total_deals,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(DISTINCT tp.id) as total_touchpoints,
    SUM(CASE WHEN ps.code = 'closed_won' THEN d.total_value ELSE 0 END) as won_value,
    AVG(f.score) as avg_feedback_score,
    ch.overall_score as health_score,
    ch.health_status
FROM customers c
LEFT JOIN users u ON c.assigned_to = u.id
LEFT JOIN deals d ON c.id = d.customer_id
LEFT JOIN tickets t ON c.id = t.customer_id
LEFT JOIN activities a ON c.id = a.customer_id
LEFT JOIN touchpoints tp ON c.id = tp.customer_id
LEFT JOIN feedback f ON c.id = f.customer_id
LEFT JOIN customer_health ch ON c.id = ch.customer_id
LEFT JOIN pipeline_stages ps ON d.stage_id = ps.id
GROUP BY c.id;

-- Updated sales pipeline view
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
    END as timeline_status,
    COUNT(dp.id) as product_count,
    ch.overall_score as customer_health_score
FROM deals d
LEFT JOIN customers c ON d.customer_id = c.id
LEFT JOIN users u ON d.assigned_to = u.id
LEFT JOIN pipeline_stages ps ON d.stage_id = ps.id
LEFT JOIN deal_products dp ON d.id = dp.deal_id
LEFT JOIN customer_health ch ON c.id = ch.customer_id
GROUP BY d.id;

-- Updated user performance view
CREATE VIEW user_performance AS
SELECT 
    u.id,
    u.name,
    u.role,
    u.team,
    COUNT(DISTINCT c.id) as assigned_customers,
    COUNT(DISTINCT d.id) as total_deals,
    SUM(CASE WHEN ps.code = 'closed_won' THEN d.total_value ELSE 0 END) as won_amount,
    COUNT(CASE WHEN ps.code = 'closed_won' THEN 1 END) as won_deals,
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(DISTINCT t.id) as assigned_tickets,
    COUNT(DISTINCT tp.id) as total_touchpoints,
    AVG(f.score) as avg_customer_satisfaction,
    
    -- Current targets
    ut.current_sales_count,
    ut.sales_count_target,
    ut.current_sales_amount,
    ut.sales_amount_target,
    ut.current_call_count,
    ut.call_count_target,
    
    -- Performance ratios
    CASE WHEN ut.sales_count_target > 0 THEN (ut.current_sales_count / ut.sales_count_target * 100) ELSE 0 END as sales_target_progress,
    CASE WHEN ut.call_count_target > 0 THEN (ut.current_call_count / ut.call_count_target * 100) ELSE 0 END as call_target_progress

FROM users u
LEFT JOIN customers c ON u.id = c.assigned_to
LEFT JOIN deals d ON u.id = d.assigned_to
LEFT JOIN pipeline_stages ps ON d.stage_id = ps.id
LEFT JOIN activities a ON u.id = a.performed_by
LEFT JOIN tickets t ON u.id = t.assigned_to
LEFT JOIN touchpoints tp ON u.id = tp.agent_id
LEFT JOIN feedback f ON c.id = f.customer_id
LEFT JOIN user_targets ut ON u.id = ut.user_id AND ut.start_date <= CURRENT_DATE AND ut.end_date >= CURRENT_DATE
WHERE u.role != 'ceo'
GROUP BY u.id;

-- =====================================================
-- ADDITIONAL INDEXES FOR NEW ANALYTICS
-- =====================================================

-- Performance indexes for analytics queries
CREATE INDEX idx_feedback_score_date ON feedback (score, created_at);
CREATE INDEX idx_feedback_type_channel ON feedback (type, channel);
CREATE INDEX idx_survey_responses_score ON survey_responses (response_value, submitted_at);
CREATE INDEX idx_touchpoints_score_date ON touchpoints (score, date);
CREATE INDEX idx_activities_outcome_date ON activities (outcome, start_time);

-- Composite indexes for common analytics queries
CREATE INDEX idx_customers_segment_priority ON customers (segment, priority, status);
CREATE INDEX idx_deals_stage_value ON deals (stage_id, total_value, expected_close_date);
CREATE INDEX idx_tickets_status_priority_date ON tickets (status, priority, created_at);

-- =====================================================
-- ADDITIONAL TRIGGERS FOR ANALYTICS
-- =====================================================

-- Update customer health when activities change
DELIMITER //
CREATE TRIGGER update_customer_health_on_activity
AFTER INSERT ON activities
FOR EACH ROW
BEGIN
    -- Recalculate customer health score
    INSERT INTO customer_health_history (customer_id, overall_score, calculated_at)
    SELECT 
        NEW.customer_id,
        50 + COALESCE(AVG(f.score) * 10 - 30, 0) + 
        CASE WHEN COUNT(a.id) > 10 THEN 10 ELSE COUNT(a.id) END -
        CASE WHEN COUNT(t.id) > 5 THEN COUNT(t.id) ELSE 0 END,
        NOW()
    FROM customers c
    LEFT JOIN feedback f ON c.id = f.customer_id AND f.created_at > DATE_SUB(NOW(), INTERVAL 3 MONTH)
    LEFT JOIN activities a ON c.id = a.customer_id AND a.start_time > DATE_SUB(NOW(), INTERVAL 1 MONTH)
    LEFT JOIN tickets t ON c.id = t.customer_id AND t.status = 'open'
    WHERE c.id = NEW.customer_id
    GROUP BY c.id
    ON DUPLICATE KEY UPDATE 
        overall_score = VALUES(overall_score),
        calculated_at = VALUES(calculated_at);
END //
DELIMITER ;

-- Update analytics when feedback is added
DELIMITER //
CREATE TRIGGER update_analytics_on_feedback
AFTER INSERT ON feedback
FOR EACH ROW
BEGIN
    -- Update CSAT aggregations for current month
    INSERT INTO csat_aggregations (
        period_type, period_date, channel, department, 
        average_score, total_responses, score_1, score_2, score_3, score_4, score_5
    )
    SELECT 
        'monthly',
        LAST_DAY(NEW.created_at),
        NEW.channel,
        NEW.category,
        AVG(score),
        COUNT(*),
        SUM(CASE WHEN score = 1 THEN 1 ELSE 0 END),
        SUM(CASE WHEN score = 2 THEN 1 ELSE 0 END),
        SUM(CASE WHEN score = 3 THEN 1 ELSE 0 END),
        SUM(CASE WHEN score = 4 THEN 1 ELSE 0 END),
        SUM(CASE WHEN score = 5 THEN 1 ELSE 0 END)
    FROM feedback 
    WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NEW.created_at, '%Y-%m')
    AND channel = NEW.channel 
    AND category = NEW.category
    AND type = 'csat'
    ON DUPLICATE KEY UPDATE
        average_score = VALUES(average_score),
        total_responses = VALUES(total_responses),
        score_1 = VALUES(score_1),
        score_2 = VALUES(score_2), 
        score_3 = VALUES(score_3),
        score_4 = VALUES(score_4),
        score_5 = VALUES(score_5),
        updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- =====================================================
-- FINAL SUMMARY
-- =====================================================

SELECT 'Updated CRM Database Structure - All Mock Data Fields Covered!' as Status;

SELECT 
    'Core Tables' as Category, COUNT(*) as Count
FROM information_schema.tables 
WHERE table_schema = 'crm_system' 
AND table_name IN ('users', 'customers', 'deals', 'activities', 'feedback', 'tickets', 'projects')

UNION ALL

SELECT 
    'Analytics Tables' as Category, COUNT(*) as Count
FROM information_schema.tables 
WHERE table_schema = 'crm_system' 
AND table_name LIKE '%aggregation%' OR table_name LIKE '%analytic%' OR table_name LIKE '%health%'

UNION ALL

SELECT 
    'Total Tables' as Category, COUNT(*) as Count
FROM information_schema.tables 
WHERE table_schema = 'crm_system';