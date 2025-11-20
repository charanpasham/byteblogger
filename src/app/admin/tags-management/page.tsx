import { db } from "@/server/db";
import { posttags, posttagmapping } from "@/server/db/schema";
import { CreatePostTagForm } from "./createPostTagForm";
import { Badge } from "@/components/ui/badge";
import { eq, sql } from "drizzle-orm";
import { DeleteTagForm } from "./deleteTagForm";

export default async function TagsManagementPage() {
const tags = await db
                    .select({
                        id: posttags.id,
                        name: posttags.name,
                        createdAt: posttags.createdAt,
                        count: sql<number>`COUNT(${posttagmapping.postId})`
                    })
                    .from(posttags)
                    .leftJoin(posttagmapping, eq(posttags.id, posttagmapping.tagId))
                    .groupBy(posttags.id)
                    .orderBy(posttags.createdAt);

 const TagNames = () => {
    if (tags.length === 0) {
      return <p>No tags available.</p>;
    }
    return (
      <div className="flex flex-col self-start gap-1">
        {tags.map((tag) => (
            <div key={tag.id} className="flex items-baseline gap-2">
                <Badge variant={"secondary"} className="mb-2 text-md">
                    {tag.name}
                </Badge>
                <span className="text-sm text-gray-500">Used {tag.count ?? 0} times</span>
                <DeleteTagForm tagId={tag.id} />
            </div>
        ))}
      </div>
    );
 };
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Tags Management</h1>
        <div className="flex flex-col gap-8">
            <CreatePostTagForm />
            <TagNames />
        </div>

    </div>
  );
}