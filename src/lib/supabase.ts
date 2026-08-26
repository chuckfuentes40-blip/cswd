import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfnvmbxzmxxsguaqihvz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dBrlQfriRIdMPW8ueyhh4Q_IGKMtkIz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);