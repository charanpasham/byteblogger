"use client";
import type { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { EditorUploadAction } from "./editorUploadAction";

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/jpg",
];

export async function uploadImageIntoEditor(
  editor: Editor,
  file: File,
  pos?: number,
) {
  const upload = EditorUploadAction(file).then((data) => {
    if (!data) throw new Error("Upload failed");
    return data.ufsUrl;
  });

  toast.promise(upload, {
    loading: `Uploading ${file.name}…`,
    success: "Image added",
    error: "Image upload failed",
  });

  const src = await upload.catch(() => null);
  if (!src) return;

  const chain = editor.chain().focus();
  if (pos === undefined) {
    chain.setImage({ src, alt: file.name }).run();
  } else {
    chain.insertContentAt(pos, { type: "image", attrs: { src, alt: file.name } }).run();
  }
}

/** Opens the OS file picker and uploads the chosen image at the cursor. */
export function pickImageIntoEditor(editor: Editor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = IMAGE_MIME_TYPES.join(",");
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) void uploadImageIntoEditor(editor, file);
  };
  input.click();
}
