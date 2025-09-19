"use client";

import { RichTextEditor } from "@/components/editor";
import { UpdateBlogAction, UpdateDescription, UpdateTitle } from "./updateBlogAction";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export function BlogEditor({
  content,
  title,
  description,
  slug,
  isPublished,
}: {
  content: string;
  title: string;
  description: string;
  slug: string;
  isPublished?: boolean;
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

  const handlePublish = async (slug: string) => {
    if (!slug) {
      return;
    }
    await UpdateBlogAction(
      content.replace("language-typescriptreact", "typescript"),
      slug,
      user.data?.user?.id || "",
      !isPublished,
    );
  };
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">
        <input type="text" className="w-full border-0 bg-transparent p-0 text-2xl font-bold outline-none focus:ring-0" value={newTitle} onChange={async (e) => {
          setnewTitle(e.target.value);
          await UpdateTitle(e.target.value, slug);
        }} />
      </h1>
      <input type="text" className="w-full border-0 bg-transparent pb-2 text-xl  outline-none focus:ring-0" value={newDescription} onChange={async (e) => {
          setnewDescription(e.target.value);
          await UpdateDescription(e.target.value, slug);
      }} />
      <RichTextEditor
        content={content}
        onSubmit={handleSubmit}
        onSubmitButtonText="Save"
        onPublish={handlePublish}
        onPublishButtonText={isPublished ? "UnPublish" : "Publish"}
        slug={slug}
      />
    </>
  );
}
