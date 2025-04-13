"use client";

import { RichTextEditor } from "@/components/editor";
import { UpdateBlogAction } from "./updateBlogAction";
import { useSession } from "next-auth/react";

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
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <p className="mb-4 text-gray-600">{description}</p>
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
