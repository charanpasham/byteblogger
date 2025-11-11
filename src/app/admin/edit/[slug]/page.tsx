import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { BlogEditor } from "./blogEditor";

interface EditProps {
  params: Promise<{
    slug: string;
  }>;
}
export default async function CreateEditBlog({ params }: EditProps) {
  const { slug } = await params;
  const blog = await db
    .select()
    .from(posts)
    .where((table) => eq(table.slug, slug))
    .limit(1);
  if (blog.length === 0) {
    return <div className="container mx-auto px-4 py-16">Blog not found</div>;
  } else {
    return (
      <BlogEditor
        content={blog[0]?.content ?? ""}
        title={blog[0]?.title ?? ""}
        description={blog[0]?.description ?? ""}
        slug={slug ?? ""}
        isPublished={blog[0]?.isPublished ?? false}
      />
    );
  }
}
