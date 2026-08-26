import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://gfnvmbxzmxxsguaqihvz.supabase.co';
const DEFAULT_KEY = 'sb_publishable_dBrlQfriRIdMPW8ueyhh4Q_IGKMtkIz';

const getValidUrl = (url?: string) => {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return DEFAULT_URL;
  return url.trim().replace(/['"]/g, '');
};

const getValidKey = (key?: string) => {
  if (!key || typeof key !== 'string' || !key.trim()) return DEFAULT_KEY;
  return key.trim().replace(/['"]/g, '');
};

export const supabase = createClient(
  getValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
  getValidKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);