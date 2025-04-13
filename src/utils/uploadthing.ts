// utils/uploadthing.ts
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core"; // path to your `uploadRouter`

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
