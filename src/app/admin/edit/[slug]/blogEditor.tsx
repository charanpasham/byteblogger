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

  return (
    <>
    <div className="flex justify-center flex-col mx-auto max-w-lg">
      <div className="flex space-between">
        <h1>
          <input type="text" className="border-0 bg-transparent text-xl font-bold outline-none focus:ring-0" placeholder="Blog Heading ..." value={newTitle} onChange={async (e) => {
            setnewTitle(e.target.value);
            await UpdateTitle(e.target.value, slug);
          }} />
        </h1>
        <span className="text-sm self-center">:Heading</span>
      </div>
        <div className="flex space-between ">
          <input type="text" className="border-0 bg-transparent pb-2 text-xl  outline-none focus:ring-0" placeholder="Blog Subheading ..." value={newDescription} onChange={async (e) => {
              setnewDescription(e.target.value);
              await UpdateDescription(e.target.value, slug);
          }} />
          <span className="text-xs self-center">:Subheading</span>
        </div>

    </div>

      <RichTextEditor
        content={content}
        onSubmit={handleSubmit}
      />
    </>
  );
}
