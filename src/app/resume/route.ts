import { getCurrentResume } from "@/server/resume";
import { NextResponse } from "next/server";

// Stable, shareable link (e.g. https://yoursite.com/resume) that always points at
// the latest uploaded resume, so links already sent keep working after a replace.
// It works even when the resume is hidden from the home page.
export const dynamic = "force-dynamic";

export async function GET() {
  const resume = await getCurrentResume();
  if (!resume) {
    return new NextResponse("No resume is available right now.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const response = NextResponse.redirect(resume.url, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
