import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sseafcfolamxwbmmuaks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZWFmY2ZvbGFteHdibW11YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzQ3MTYsImV4cCI6MjA4MTAxMDcxNn0.Qq8EBxqIVnL9OJjifGgEW581PkXNi5J83Rnmz1X74jQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
