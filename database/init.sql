-- Team Collaboration Hub Database Schema
-- PostgreSQL initialization script

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create whiteboards table
CREATE TABLE IF NOT EXISTS whiteboards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    scene_id VARCHAR(255) UNIQUE NOT NULL, -- References MongoDB document
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create whiteboard_collaborators table (for future use)
CREATE TABLE IF NOT EXISTS whiteboard_collaborators (
    id SERIAL PRIMARY KEY,
    whiteboard_id INTEGER NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(50) DEFAULT 'view', -- view, edit, admin
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(whiteboard_id, user_id)
);

-- Create projects table (for future use)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project_whiteboards table (for future use)
CREATE TABLE IF NOT EXISTS project_whiteboards (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    whiteboard_id INTEGER NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, whiteboard_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whiteboards_owner_id ON whiteboards(owner_id);
CREATE INDEX IF NOT EXISTS idx_whiteboards_scene_id ON whiteboards(scene_id);
CREATE INDEX IF NOT EXISTS idx_whiteboard_collaborators_whiteboard_id ON whiteboard_collaborators(whiteboard_id);
CREATE INDEX IF NOT EXISTS idx_whiteboard_collaborators_user_id ON whiteboard_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whiteboards_updated_at 
    BEFORE UPDATE ON whiteboards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for development
INSERT INTO users (name, email, password_hash) VALUES 
('John Doe', 'john@example.com', '$2a$12$example.hash.for.development'),
('Jane Smith', 'jane@example.com', '$2a$12$example.hash.for.development')
ON CONFLICT (email) DO NOTHING;
