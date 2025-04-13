"use server";

import { UTApi } from "uploadthing/server";

export async function EditorUploadAction(file: File | null) {
  // process this file and reduce the size.
  const utapi = new UTApi();
  if (!file) return null;
  const uploaded = await utapi.uploadFiles(file);
  return uploaded.data;
}
