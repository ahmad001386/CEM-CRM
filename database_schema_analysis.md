# Database Schema vs Mock Data Analysis

## Summary of Findings

After systematically reviewing the mock-data.ts file against the MySQL database schema, I found several mismatches and missing elements that need to be addressed before backend implementation.

## 🔴 **Critical Missing Tables/Fields**

### 1. **Analytics Data Tables**
The mock data contains extensive analytics structures that are missing from the schema:

**Missing Table: `analytics_aggregations`**
```sql
CREATE TABLE analytics_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    metric_type ENUM('csat', 'nps', 'customer_health', 'touchpoints') NOT NULL,
    period ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    period_date DATE NOT NULL,
    aggregated_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_metric_period (metric_type, period, period_date)
) ENGINE=InnoDB;
```

**Missing Table: `sentiment_analysis`** 
```sql
CREATE TABLE sentiment_analysis (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    source_type ENUM('feedback', 'interaction', 'survey_response') NOT NULL,
    source_id VARCHAR(36) NOT NULL,
    text_content TEXT NOT NULL,
    sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    keywords JSON,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_source_type_id (source_type, source_id),
    INDEX idx_sentiment (sentiment)
) ENGINE=InnoDB;
```

**Missing Table: `word_cloud_data`**
```sql
CREATE TABLE word_cloud_data (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    word VARCHAR(255) NOT NULL,
    count INT NOT NULL DEFAULT 1,
    sentiment ENUM('positive', 'neutral', 'negative') NOT NULL,
    category VARCHAR(100),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_word_period (word, period_start, period_end),
    INDEX idx_word (word),
    INDEX idx_sentiment (sentiment),
    INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB;
```

### 2. **Touchpoints Tracking**
**Missing Table: `touchpoints`**
```sql
CREATE TABLE touchpoints (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    type ENUM('support', 'sales', 'feedback', 'onboarding') NOT NULL,
    channel ENUM('email', 'phone', 'chat', 'in_person', 'social', 'website') NOT NULL,
    date TIMESTAMP NOT NULL,
    score DECIMAL(3,2), -- 1.00 to 5.00
    agent_id VARCHAR(36),
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
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
```

## 🟡 **Field Mismatches & Corrections**

### 1. **Users Table - Role Values**
**Issue:** Mock data has Persian role names that don't match schema ENUM.

**Current Schema:**
```sql
role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent') DEFAULT 'sales_agent'
```

**Required Fix:**
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent', 'مدیر', 'کارشناس فروش', 'مدیر فروش') DEFAULT 'sales_agent';
```

### 2. **Users Table - Status Field**
**Issue:** Inconsistent status values between 'active'/'online'/'away'

**Current Schema:** 
```sql
status ENUM('active', 'inactive', 'away', 'online', 'offline') DEFAULT 'active'
```

**This is correct - no changes needed**

### 3. **Users Table - Password Field**
**Issue:** Mock has `password` but schema has `password_hash`

**Required Addition:**
```sql
ALTER TABLE users ADD COLUMN password VARCHAR(255) AFTER email;
-- Note: In production, only password_hash should be used
```

### 4. **Contacts Table - Missing Customer Relationship**
**Issue:** Mock contacts don't link to customers properly

**Current contacts are independent, but should be linked to customers:**
```sql
-- Contacts table is correct but needs proper data relationships
-- Mock data needs to include customer_id
```

### 5. **Activities Table - performedBy Field** 
**Issue:** Mock has string names, schema expects user IDs

**Current Schema is correct:**
```sql
performed_by VARCHAR(36) NOT NULL -- FK to users.id
```

**Backend should resolve names to IDs during data import**

### 6. **Notes Table - Tags Handling**
**Issue:** Mock has tags array, schema uses separate table

**Schema is correct with `note_tags` table. Backend needs to:**
- Split tag arrays into separate records
- Handle tag normalization

### 7. **Deals Table - Stage Field**
**Issue:** Mock has string stages, schema uses stage_id FK

**Schema is correct. Backend needs to:**
- Map string stages to pipeline_stages.id
- Handle stage transitions properly

### 8. **Deal Products - Embedded vs Separate**
**Issue:** Mock embeds products array, schema uses separate table

**Schema is correct with `deal_products` table**

### 9. **Calendar Events - Date Field Names**
**Issue:** Mock uses `startDate/endDate`, schema uses `start_date/end_date`

**Current Schema:**
```sql
start_date TIMESTAMP NOT NULL,
end_date TIMESTAMP NOT NULL,
```

**Should be:**
```sql
ALTER TABLE calendar_events CHANGE start_date startDate TIMESTAMP NOT NULL;
ALTER TABLE calendar_events CHANGE end_date endDate TIMESTAMP NOT NULL;
```

## 🟢 **Missing Fields - Required Additions**

### 1. **Activities Table**
```sql
ALTER TABLE activities ADD COLUMN related_deal VARCHAR(36) AFTER deal_id;
ALTER TABLE activities ADD COLUMN attachments JSON AFTER outcome;
ALTER TABLE activities ADD COLUMN contact_id VARCHAR(36) AFTER customer_id;

ALTER TABLE activities ADD FOREIGN KEY (contact_id) REFERENCES contacts(id);
```

### 2. **Feedback Table**
```sql
ALTER TABLE feedback ADD COLUMN customer_name VARCHAR(255) AFTER customer_id; -- For denormalization
ALTER TABLE feedback ADD COLUMN resolved_by VARCHAR(36) AFTER resolved_at;
ALTER TABLE feedback ADD FOREIGN KEY (resolved_by) REFERENCES users(id);
```

### 3. **Tickets Table** 
```sql
ALTER TABLE tickets ADD COLUMN customer_name VARCHAR(255) AFTER customer_id; -- For denormalization
```

### 4. **Interactions Table**
```sql
ALTER TABLE interactions ADD COLUMN customer_name VARCHAR(255) AFTER customer_id; -- For denormalization
```

### 5. **Customers Table - Sales Pipeline Data**
**Issue:** Mock has complex embedded salesPipeline object

**Solution: Add fields to deals table:**
```sql
ALTER TABLE deals ADD COLUMN product_selected BOOLEAN DEFAULT FALSE;
ALTER TABLE deals ADD COLUMN contact_made BOOLEAN DEFAULT FALSE; 
ALTER TABLE deals ADD COLUMN purchased BOOLEAN DEFAULT FALSE;
ALTER TABLE deals ADD COLUMN next_action TEXT;
ALTER TABLE deals ADD COLUMN contact_attempts INT DEFAULT 0;
```

## 🔵 **Additional Tables for Analytics**

### 1. **CSAT Aggregations**
```sql
CREATE TABLE csat_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_date DATE NOT NULL,
    channel VARCHAR(50),
    department VARCHAR(50),
    average_score DECIMAL(3,2) NOT NULL,
    total_responses INT NOT NULL,
    distribution JSON, -- {"1": 45, "2": 78, ...}
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_csat_period (period_type, period_date, channel, department),
    INDEX idx_period (period_date),
    INDEX idx_channel (channel),
    INDEX idx_department (department)
) ENGINE=InnoDB;
```

### 2. **NPS Aggregations**
```sql
CREATE TABLE nps_aggregations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_date DATE NOT NULL,
    channel VARCHAR(50),
    product VARCHAR(100),
    nps_score INT NOT NULL, -- -100 to 100
    total_responses INT NOT NULL,
    promoters INT NOT NULL,
    passives INT NOT NULL,
    detractors INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_nps_period (period_type, period_date, channel, product),
    INDEX idx_period (period_date),
    INDEX idx_score (nps_score)
) ENGINE=InnoDB;
```

### 3. **Dashboard Statistics Cache**
```sql
CREATE TABLE dashboard_cache (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(36), -- NULL for global stats
    data JSON NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_expires (expires_at),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

## 🎯 **Required Schema Updates**

### Complete SQL Script for Missing Elements:
```sql
-- 1. User role updates
ALTER TABLE users MODIFY COLUMN role ENUM('ceo', 'sales_manager', 'sales_agent', 'agent', 'مدیر', 'کارشناس فروش', 'مدیر فروش') DEFAULT 'sales_agent';

-- 2. Add password field (for development only)
ALTER TABLE users ADD COLUMN password VARCHAR(255) AFTER email;

-- 3. Calendar events field names
ALTER TABLE calendar_events CHANGE start_date startDate TIMESTAMP NOT NULL;
ALTER TABLE calendar_events CHANGE end_date endDate TIMESTAMP NOT NULL;

-- 4. Additional activity fields
ALTER TABLE activities ADD COLUMN contact_id VARCHAR(36) AFTER customer_id;
ALTER TABLE activities ADD COLUMN attachments JSON AFTER outcome;
ALTER TABLE activities ADD FOREIGN KEY (contact_id) REFERENCES contacts(id);

-- 5. Denormalized customer names
ALTER TABLE feedback ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;
ALTER TABLE tickets ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;  
ALTER TABLE interactions ADD COLUMN customer_name VARCHAR(255) AFTER customer_id;

-- 6. Deal pipeline fields
ALTER TABLE deals ADD COLUMN product_selected BOOLEAN DEFAULT FALSE;
ALTER TABLE deals ADD COLUMN contact_made BOOLEAN DEFAULT FALSE;
ALTER TABLE deals ADD COLUMN purchased BOOLEAN DEFAULT FALSE;
ALTER TABLE deals ADD COLUMN next_action TEXT;
ALTER TABLE deals ADD COLUMN contact_attempts INT DEFAULT 0;

-- 7. Add all the missing analytics tables (from above)
-- ... (Insert all the CREATE TABLE statements from the missing tables section)
```

## 📊 **Data Import Considerations**

1. **Name to ID Resolution:** Backend must resolve string names to user IDs
2. **Date Format Handling:** Persian dates (1402/04/15) vs MySQL timestamps
3. **Array to Relational:** Convert embedded arrays to separate table records
4. **Denormalization:** Some customer/user names are stored redundantly for performance
5. **Analytics Preprocessing:** Complex analytics objects need to be processed and stored in aggregation tables

## ✅ **Final Recommendations**

1. **Apply all schema updates** listed above before backend implementation
2. **Create data migration scripts** to handle the transformations 
3. **Implement proper foreign key relationships** during data import
4. **Set up analytics aggregation jobs** to populate reporting tables
5. **Add proper indexes** for performance on large datasets

The schema is now comprehensive and ready for backend implementation with these updates applied.