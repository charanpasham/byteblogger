"use client";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

// For GitHub dark theme (better for your dark editor background)
import "highlight.js/styles/github-dark.css";

export default function ViewBlogPage({ content }: { content: string }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  return (
    <>
      <article
        className="tiptap proseMirror my-10 min-h-full"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </>
  );
}
