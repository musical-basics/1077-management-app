import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for admin tasks or handling logic securely on server

if (!supabaseUrl || !supabaseKey) {
    // console.warn('Supabase URL or Key is missing. Database operations will fail.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
