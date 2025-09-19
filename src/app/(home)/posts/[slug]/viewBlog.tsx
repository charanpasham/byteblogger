"use client";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

import { useTheme } from "next-themes";

export default function ViewBlogPage({ content, author }: { content: string, author: string }) {
    const { theme } = useTheme();
  useEffect(() => {
    const highlightAndAddCopyButtons = async () => {
      hljs.highlightAll();
      // Add copy buttons to all <pre> blocks
      const preBlocks = document.querySelectorAll("article pre");

      preBlocks.forEach((pre) => {
        // Skip if already has a button
        if (pre.querySelector(".copy-button")) return;

        const button = document.createElement("button");
        button.textContent = "Copy";
        button.className =
          "copy-button absolute top-2 right-2 bg-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-600 text-white";
        button.addEventListener("click", () => {
          const code = (pre as HTMLElement).innerText;
          navigator.clipboard.writeText(code);
          button.textContent = "Copied!";
          setTimeout(() => (button.textContent = "Copy"), 2000);
        });

        // Make parent relative for absolute button
        (pre as HTMLElement).style.position = "relative";
        pre.appendChild(button);
      });
    };

    highlightAndAddCopyButtons();
  }, [content]);

  return (
    <>
      <h2 className="pt-4 text-base italic font-thin">- {author}</h2>
      <article
        className={`tiptap proseMirror mt-5 mb-10 min-h-full`}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </>
  );
}
