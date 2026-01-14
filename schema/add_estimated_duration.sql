-- Add estimated_duration column to project_templates table
ALTER TABLE project_templates 
ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 0;
