"use server";

import { UTApi } from "uploadthing/server";

export async function EditorUploadAction(file: File | null) {
  if (!file) return null;
  const utapi = new UTApi();
  const uploaded = await utapi.uploadFiles(file);
  return uploaded.data;
}
