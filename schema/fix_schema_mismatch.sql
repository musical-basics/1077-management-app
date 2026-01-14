-- Robust migration to fix schema mismatches for Project Library
-- Handles renaming columns and adding missing fields safely

DO $$ 
BEGIN 
    -- 1. Fix project_templates: Check for 'title' and rename to 'name'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_templates' AND column_name = 'title') THEN
        ALTER TABLE project_templates RENAME COLUMN title TO name;
    END IF;

    -- 2. Fix project_templates: Add 'created_at' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_templates' AND column_name = 'created_at') THEN
        ALTER TABLE project_templates ADD COLUMN created_at timestamp with time zone default now();
    END IF;
    
    -- 3. Fix project_templates: Handle 'estimated_minutes' vs 'estimated_duration'
    -- If 'estimated_minutes' exists...
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_templates' AND column_name = 'estimated_minutes') THEN
        -- ...and 'estimated_duration' ALSO exists (e.g. from previous manual fix), drop 'estimated_minutes'
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_templates' AND column_name = 'estimated_duration') THEN
            ALTER TABLE project_templates DROP COLUMN estimated_minutes;
        ELSE
            -- ...otherwise, just rename 'estimated_minutes' to 'estimated_duration'
            ALTER TABLE project_templates RENAME COLUMN estimated_minutes TO estimated_duration;
        END IF;
    ELSE
        -- If 'estimated_minutes' doesn't exist, ensure 'estimated_duration' does
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_templates' AND column_name = 'estimated_duration') THEN
            ALTER TABLE project_templates ADD COLUMN estimated_duration INTEGER DEFAULT 0;
         END IF;
    END IF;

    -- 4. Fix template_tasks: Start by checking for 'description' vs 'title'
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'template_tasks' AND column_name = 'description') THEN
        ALTER TABLE template_tasks RENAME COLUMN description TO title;
    END IF;

    -- 5. Fix template_tasks: Add 'duration' column (text string like "5 min")
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'template_tasks' AND column_name = 'duration') THEN
        ALTER TABLE template_tasks ADD COLUMN duration text;
    END IF;
    
    -- 6. Fix template_tasks: Add 'created_at' column
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'template_tasks' AND column_name = 'created_at') THEN
        ALTER TABLE template_tasks ADD COLUMN created_at timestamp with time zone default now();
    END IF;

END $$;
