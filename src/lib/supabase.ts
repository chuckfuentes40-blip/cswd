import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const DEFAULT_URL = 'https://gfnvmbxzmxxsguaqihvz.supabase.co';
const DEFAULT_KEY = 'sb_publishable_dBrlQfriRIdMPW8ueyhh4Q_IGKMtkIz';

const sanitizeUrl = (url?: string) => {
  if (!url || typeof url !== 'string' || !url.trim()) return DEFAULT_URL;
  const cleanUrl = url.trim().replace(/['"]/g, '');
  
  // Guard against literal variable names accidentally pasted in environment settings
  if (cleanUrl.toLowerCase().includes('next_public_supabase_url')) return DEFAULT_URL;
  
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return `https://${cleanUrl}`;
  }
  return cleanUrl;
};

const sanitizeKey = (key?: string) => {
  if (!key || typeof key !== 'string' || !key.trim()) return DEFAULT_KEY;
  if (key.toLowerCase().includes('next_public_supabase_anon_key')) return DEFAULT_KEY;
  return key.trim().replace(/['"]/g, '');
};

export const supabase = createClient(sanitizeUrl(rawUrl), sanitizeKey(rawKey));