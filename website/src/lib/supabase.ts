import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wupmcvhzstgsdrvcigtm.supabase.co';
// Anon key — safe in client code; access restricted by RLS.
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cG1jdmh6c3Rnc2RydmNpZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODkzNDMsImV4cCI6MjA4NzM2NTM0M30.D8Zbzblj0oyP28ACJystGWSmqmwdBIyp7mMQmwqtPjM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Hide billing/storage UI until Boojy Cloud storage launches. */
export const CLOUD_LAUNCHED = false;
