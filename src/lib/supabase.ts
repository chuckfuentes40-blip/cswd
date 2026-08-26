import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const sanitizeUrl = (url?: string) => {
  const fallback = 'https://gfnvmbxzmxxsguaqihvz.supabase.co';
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const cleanUrl = url.trim().replace(/['"]/g, '');
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return `https://${cleanUrl}`;
  }
  return cleanUrl;
};

const sanitizeKey = (key?: string) => {
  const fallback = 'sb_publishable_dBrlQfriRIdMPW8ueyhh4Q_IGKMtkIz';
  if (!key || typeof key !== 'string' || !key.trim()) return fallback;
  return key.trim().replace(/['"]/g, '');
};

export const supabase = createClient(sanitizeUrl(rawUrl), sanitizeKey(rawKey));