import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface EmailRecord {
  id?: number;
  recipient_email: string;
  recipient_name?: string;
  recipient_company?: string;
  template_name: string;
  template_id: string;
  subject: string;
  sent_at: string;
  status: 'sent' | 'failed';
  error_message?: string;
  campaign_name?: string;
  created_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at?: string;
}
