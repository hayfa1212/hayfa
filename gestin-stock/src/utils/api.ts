
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xcsdjhbdkolbbmocabuj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjc2RqaGJka29sYmJtb2NhYnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwNjYyMzksImV4cCI6MjAyNTY0MjIzOX0.iI4z62A0IjOSNSr-SS-mC_ZW_7f0Bwyd7enRZX1laqU')
export default supabase