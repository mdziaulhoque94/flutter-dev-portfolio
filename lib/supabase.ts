
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vslviaeoyfikdwlmegbq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbHZpYWVveWZpa2R3bG1lZ2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODkyODksImV4cCI6MjA4NTE2NTI4OX0.C229KAQsxgjG3ShfTirDCKaumDMzcbMpkU5wLPb2ia4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
