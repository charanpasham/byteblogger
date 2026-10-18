"use server";
import { requireAdmin } from "@/lib/authGuard";
import { removeAllResumes, setResumeVisibility } from "@/server/resume";
import { revalidatePath } from "next/cache";

export async function RemoveResumeAction(): Promise<void> {
  await requireAdmin();
  await removeAllResumes();
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function SetResumeVisibilityAction(isVisible: boolean): Promise<void> {
  await requireAdmin();
  if (!(await setResumeVisibility(isVisible))) throw new Error("No resume uploaded");
  revalidatePath("/");
  revalidatePath("/admin");
}
