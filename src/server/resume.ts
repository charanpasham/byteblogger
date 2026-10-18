import { desc, eq, ne } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { db } from "@/server/db";
import { resumes } from "@/server/db/schema";

const utapi = new UTApi();

export type Resume = typeof resumes.$inferSelect;

export async function getCurrentResume(): Promise<Resume | null> {
  try {
    const [resume] = await db
      .select()
      .from(resumes)
      .orderBy(desc(resumes.uploadedAt), desc(resumes.id))
      .limit(1);
    return resume ?? null;
  } catch (error) {
    // Never take the home page down over the resume (e.g. table not migrated yet).
    console.error("Failed to load resume", error);
    return null;
  }
}

/** Saves a newly uploaded resume and deletes every older one (rows and files). */
export async function setCurrentResume(file: {
  url: string;
  key: string;
  name: string;
  size: number;
}) {
  // A replacement keeps the current visibility, so a hidden resume stays hidden.
  const previous = await getCurrentResume();
  const [saved] = await db
    .insert(resumes)
    .values({
      url: file.url,
      fileKey: file.key,
      fileName: file.name,
      fileSize: file.size,
      isVisible: previous?.isVisible ?? true,
    })
    .returning({ id: resumes.id });
  if (!saved) return;

  const older = await db
    .delete(resumes)
    .where(ne(resumes.id, saved.id))
    .returning({ fileKey: resumes.fileKey });
  if (older.length) {
    await utapi.deleteFiles(older.map((r) => r.fileKey));
  }
}

export async function removeAllResumes() {
  const removed = await db
    .delete(resumes)
    .where(ne(resumes.id, -1))
    .returning({ fileKey: resumes.fileKey });
  if (removed.length) {
    await utapi.deleteFiles(removed.map((r) => r.fileKey));
  }
}

export async function setResumeVisibility(isVisible: boolean) {
  const current = await getCurrentResume();
  if (!current) return false;
  await db.update(resumes).set({ isVisible }).where(eq(resumes.id, current.id));
  return true;
}
