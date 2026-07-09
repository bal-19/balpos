import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export const supabase: SupabaseClient | null =
  env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

export async function uploadReportFile(path: string, buffer: Buffer, contentType: string): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY kosong)");
  }
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
