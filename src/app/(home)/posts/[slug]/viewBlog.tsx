"use client";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";
import { ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { ToggleLikeAction } from "../toggleLikeAction";
import { useTheme } from "next-themes";

export default function ViewBlogPage({ content, author, likedByUsers, postId, slugName }: { content: string, author: string, likedByUsers: string[], postId: number, slugName: string }) {
 const user = useSession();
 const { theme } = useTheme();
 const isDarkMode = theme === "dark";
 const currentUserLikedThePost = user.data?.user?.id == undefined ? false : likedByUsers.includes(user.data?.user?.id);
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    // highlight function
    const applyHighlight = () => {
      hljs.highlightAll();
      // const preBlocks = article.querySelectorAll("pre");

      // preBlocks.forEach((pre) => {
      //   if (pre.querySelector(".copy-button")) return;

      //   const button = document.createElement("button");
      //   button.textContent = "Copy";
      //   button.className =
      //     "copy-button absolute top-2 right-2 bg-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-600 text-white";
      //   button.addEventListener("click", () => {
      //     const code = (pre as HTMLElement).innerText;
      //     navigator.clipboard.writeText(code);
      //     button.textContent = "Copied!";
      //     setTimeout(() => (button.textContent = "Copy"), 2000);
      //   });

      //   (pre as HTMLElement).style.position = "relative";
      //   pre.appendChild(button);
      // });
    };

    // watch for DOM updates inside <article>
    const observer = new MutationObserver(() => {
      applyHighlight();
    });

    observer.observe(article, {
      childList: true,
      subtree: true,
    });

    // apply immediately if already loaded
    applyHighlight();

    return () => observer.disconnect();
  }, [content, theme]);
  const fill = isDarkMode ? "#99a1af" : "#364153";
  return (
    <>
      <h2 className="pt-4 text-base italic font-thin">- {author}</h2>
      <div className="flex mt-2 gap-2">
        <form action= {async (data: FormData) => {
          const postId = data.get("postId") as string;
          const userId = data.get("userId") as string;
          const slugName = data.get("slugName") as string;
          // Call the server action to like the post
          await ToggleLikeAction(Number(postId), userId, slugName);
        }}>
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="userId" value={user.data?.user?.id ?? ""} />
          <input type="hidden" name="slugName" value={slugName} />
          <button type="submit" className="cursor-pointer">
            <ThumbsUp className="text-gray-700 dark:text-gray-300 h-5 w-5" fill={currentUserLikedThePost ? fill : "none"} />
          </button>
        </form>
        {likedByUsers.length > 0 && <span className="text-sm dark:text-gray-300">{likedByUsers.length} {likedByUsers.length === 1 ? "Like" : "Likes"}</span>}
      </div>

      <article
        className={`tiptap proseMirror mt-5 mb-10 min-h-full`}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </>
  );
}
