"use server";

import { supabaseServer } from "@/shared/api/supabase-server";

const BUCKET = "transaction_images";

function sanitizeFileName(name: string): string {
  const ext = name.includes(".") ? name.split(".").pop()! : "";
  const base = ext ? name.slice(0, -(ext.length + 1)) : name;
  const safeBase = base
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "")
    || Date.now().toString();
  return ext ? `${safeBase}.${ext}` : safeBase;
}

export async function uploadTransactionImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("파일이 없습니다.");

  const path = `uploads/${Date.now()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseServer.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type });

  if (error) throw error;

  const { data } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
