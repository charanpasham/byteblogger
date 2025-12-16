import { db } from "@/server/db";
import { posts, posttagmapping, posttags } from "@/server/db/schema";
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
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!blog || blog.length === 0) {
    return <div className="container mx-auto px-4 py-16">Blog not found</div>;
  }

  const allTags = await db
    .select({
      id: posttags.id,
      name: posttags.name,
    })
    .from(posttags);

  const assignedTags = await db
    .select({
      id: posttags.id,
      name: posttags.name,
    })
    .from(posttagmapping)
    .leftJoin(posttags, eq(posttagmapping.tagId, posttags.id))
    .where(eq(posttagmapping.postId, blog[0]?.id ?? 0));

  return (
    <BlogEditor
      id={blog[0]?.id || 0}
      content={blog[0]?.content ?? ""}
      title={blog[0]?.title ?? ""}
      description={blog[0]?.description ?? ""}
      slug={slug ?? ""}
      isPublished={blog[0]?.isPublished ?? false}
      assignedTags={assignedTags}
      allTags={allTags}
    />
  );
}
