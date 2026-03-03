"use client";

import { RichTextEditor } from "@/components/editor";
import { UpdateBlogAction, UpdateDescription, UpdateTitle } from "./updateBlogAction";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToggleTagAction } from "./toggleTagAction";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function BlogEditor({
  id,
  content,
  title,
  description,
  slug,
  isPublished,
  assignedTags,
  allTags,
}: {
  id: number;
  content: string;
  title: string;
  description: string;
  slug: string;
  isPublished?: boolean;
  assignedTags?: { id: number | null; name: string | null }[];
  allTags?: { id: number; name: string }[];
}) {
  const user = useSession();
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const handleSubmit = async (content: string) => {
    await UpdateBlogAction(
      content.replace("language-typescriptreact", "typescript"),
      slug,
      user.data?.user?.id || "",
      isPublished || false,
    );
  };

  const handleToggleTag = async (tagId: number, isChecked: boolean) => {
    await ToggleTagAction(id, tagId, slug, isChecked);
    toast.success(`Tag ${isChecked ? "added" : "removed"}`);
  };

  const RenderTagCheckboxes = () => {
    if (!allTags?.length) {
      return (
        <p className="text-sm text-muted-foreground">
          You haven&apos;t created any tags yet.
        </p>
      );
    }

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {allTags.map((tag) => {
          const isChecked = assignedTags?.some(
            (assignedTag) => assignedTag.id === tag.id,
          );

          return (
            <label
              key={tag.id}
              htmlFor={`tag-${tag.id}`}
              className="flex items-center gap-2 text-sm"
            >
              <Checkbox
                id={`tag-${tag.id}`}
                checked={isChecked}
                onCheckedChange={async (checked) => {
                  await handleToggleTag(tag.id, Boolean(checked));
                }}
              />
              <span>{tag.name}</span>
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-3xl border border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Edit post
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[11px]">
              {isPublished ? "Published" : "Draft"}
            </Badge>
            <span className="break-all text-[11px] opacity-80">
              /posts/{slug}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              className="w-full"
              placeholder="Blog heading..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={async () => {
                try {
                  setIsSavingTitle(true);
                  await UpdateTitle(newTitle, slug);
                  toast.success("Title updated");
                } finally {
                  setIsSavingTitle(false);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              This appears as the main heading for your post.
              {isSavingTitle && " Saving..."}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              className="w-full"
              placeholder="Short summary shown in lists..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onBlur={async () => {
                try {
                  setIsSavingDescription(true);
                  await UpdateDescription(newDescription, slug);
                  toast.success("Description updated");
                } finally {
                  setIsSavingDescription(false);
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Keep it concise. It&apos;s shown on the homepage and admin list.
              {isSavingDescription && " Saving..."}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <p className="text-xs text-muted-foreground">
              Use tags to group related posts. Changes are saved immediately.
            </p>
            <RenderTagCheckboxes />
          </div>
        </CardContent>
      </Card>

      <div className="mx-auto max-w-3xl">
        <RichTextEditor content={content} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
