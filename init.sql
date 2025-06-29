-- Database initialization script for meditation tracker
-- This file is optional since TypeORM will handle schema creation

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a simple log entry
INSERT INTO pg_stat_database_conflicts (datid) VALUES (0) ON CONFLICT DO NOTHING; 