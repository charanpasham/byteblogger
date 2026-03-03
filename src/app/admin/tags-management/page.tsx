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
      return (
        <p className="text-sm text-muted-foreground">
          No tags yet. Create your first tag to organize posts.
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <Badge variant={"secondary"} className="text-sm">
                {tag.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Used {tag.count ?? 0} {tag.count === 1 ? "time" : "times"}
              </span>
            </div>
            <DeleteTagForm tagId={tag.id} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tags management</h1>
        <p className="text-sm text-muted-foreground">
          Create, view, and delete tags used to organize your posts.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
        <div className="rounded-xl border bg-card/80 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Create tag
          </h2>
          <CreatePostTagForm />
        </div>
        <div className="rounded-xl border bg-card/80 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Existing tags
          </h2>
          <TagNames />
        </div>
      </div>
    </div>
  );
}