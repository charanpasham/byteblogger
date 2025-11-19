"use client";

import { RichTextEditor } from "@/components/editor";
import { UpdateBlogAction, UpdateDescription, UpdateTitle } from "./updateBlogAction";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToggleTagAction } from "./toggleTagAction";

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
  const [ newTitle, setnewTitle ] = useState(title);
  const [ newDescription, setnewDescription ] = useState(description);
  const handleSubmit = async (content: string) => {
    await UpdateBlogAction(
      content.replace("language-typescriptreact", "typescript"),
      slug,
      user.data?.user?.id || "",
      isPublished || false,
    );
  };

  const handleToggleTag = async (tagId: number, isChecked: boolean) => {
    // Call the server action to toggle the tag
    // You need to implement ToggleTagAction in a similar way to ToggleLikeAction
    await ToggleTagAction(id, tagId, slug, isChecked);
  }

  const RenderTagCheckboxes = () => {
    return allTags?.map((tag) => {
      const isChecked = assignedTags?.some((assignedTag) => assignedTag.id === tag.id);
      return (
        <div key={tag.id} className="flex items-center gap-2 mb-2">
          <Input
            type="checkbox"
            id={`tag-${tag.id}`}
            name="tags"
            value={tag.id}
            defaultChecked={isChecked}
            className="h-4 w-4"
            onChange={async (e) => {
              await handleToggleTag(tag.id, e.target.checked);
            }}
          />
          <label htmlFor={`tag-${tag.id}`} className="text-sm">
            {tag.name}
          </label>
        </div>
      );
    });
  }

  return (
    <>
    <div className="flex justify-center flex-col mx-auto max-w-lg">
      <div className="flex space-between">
          <Input type="text" className="border-0 bg-transparent font-bold outline-none focus:ring-0 w-full" placeholder="Blog Heading ..." value={newTitle} onChange={async (e) => {
            setnewTitle(e.target.value);
            await UpdateTitle(e.target.value, slug);
          }} />
      </div>
        <div className="flex space-between ">
          <Input className="border-0 bg-transparent pb-2 outline-none focus:ring-0 w-full" placeholder="Blog Subheading ..." value={newDescription} onChange={async (e) => {
              setnewDescription(e.target.value);
              await UpdateDescription(e.target.value, slug);
          }} />
        </div>
        <div>
          <div className="flex gap-1">
           <RenderTagCheckboxes />
          </div>

        </div>
    </div>

      <RichTextEditor
        content={content}
        onSubmit={handleSubmit}
      />
    </>
  );
}
