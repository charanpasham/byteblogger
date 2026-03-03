"use client";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";
import { ThumbsUp, ViewIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ToggleLikeAction } from "../toggleLikeAction";
import { IncrementPostViewCount } from "../incrementPostViewCountAction";
import { useTheme } from "next-themes";

export default function ViewBlogPage({ content, author, likedByUsers, postId, slugName, viewCount }: { content: string, author: string, likedByUsers: string[], postId: number, slugName: string, viewCount: number }) {
 const user = useSession();
 const { theme } = useTheme();
 const isDarkMode = theme === "dark";
 const currentUserLikedThePost = user.data?.user?.id == undefined ? false : likedByUsers.includes(user.data?.user?.id);
 const viewIncrementd = useRef(false);
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    // highlight function
    const applyHighlight = () => {
      hljs.highlightAll();
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

  useEffect(() => {
    if (!viewIncrementd.current) {
      IncrementPostViewCount(postId, slugName);
      viewIncrementd.current = true;
    }
  }, [postId, slugName]);

  const fill = isDarkMode ? "#99a1af" : "#364153";
  const LikeButton = () => (
        <form className="self-center" action= {async (data: FormData) => {
          const postId = data.get("postId") as string;
          const userId = data.get("userId") as string;
          const slugName = data.get("slugName") as string;
          // Call the server action to like the post
          await ToggleLikeAction(Number(postId), userId, slugName);
        }}>
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="userId" value={user.data?.user?.id ?? ""} />
          <input type="hidden" name="slugName" value={slugName} />
          <div className="flex gap-1">
            <button type="submit" className="cursor-pointer" aria-label="Like Button">
              <ThumbsUp className="text-gray-700 dark:text-gray-300 h-5 w-5" fill={currentUserLikedThePost ? fill : "none"} />
            </button>
            {likedByUsers.length > 0 && <span className="text-sm dark:text-gray-300 self-center">{likedByUsers.length} {likedByUsers.length === 1 ? "Like" : "Likes"}</span>}
          </div>
        </form>
  )

  const PostViews = () => (
    <div className="flex gap-1">
      <ViewIcon className="h-5 w-5 self-center text-gray-700 dark:text-gray-300" />
      <span className="self-center text-sm text-gray-700 dark:text-gray-300">
        {viewCount} {viewCount === 1 ? "View" : "Views"}
      </span>
    </div>
  );
  return (
    <div className="w-full min-w-0 overflow-x-clip rounded-2xl border bg-card/80 px-2 pb-8 pt-6 shadow-sm sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
        <p className="min-w-0 text-sm text-muted-foreground">
          Written by{" "}
          <span className="font-medium text-foreground">
            {author || "Unknown author"}
          </span>
        </p>
        <div className="flex shrink-0 gap-4">
          <LikeButton />
          <PostViews />
        </div>
      </div>
      <div className="w-full min-w-0 overflow-x-clip">
        <article
          className="tiptap proseMirror mt-6 mb-4 min-h-full w-full min-w-0 !text-[0.95rem] leading-relaxed md:!text-[1.02rem]"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </div>
  );
}
