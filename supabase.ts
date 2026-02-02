
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaqgodppfruxacdgxrah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcWdvZHBwZnJ1eGFjZGd4cmFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MzI5OTMsImV4cCI6MjA4NTUwODk5M30.WKIXAXktfgTUNJEym9YuX8m5sZ8rAhaFF0Qu-zdyKjU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
