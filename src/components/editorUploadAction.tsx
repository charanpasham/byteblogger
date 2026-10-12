"use server";

import { UTApi } from "uploadthing/server";
import { requireAdmin } from "@/lib/authGuard";

export async function EditorUploadAction(file: File | null) {
  await requireAdmin();
  if (!file) return null;
  const utapi = new UTApi();
  const uploaded = await utapi.uploadFiles(file);
  return uploaded.data;
}
