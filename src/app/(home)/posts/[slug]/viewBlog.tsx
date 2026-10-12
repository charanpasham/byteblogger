"use client";
import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";
import { ThumbsUp, ViewIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ToggleLikeAction } from "../toggleLikeAction";
import { IncrementPostViewCount } from "../incrementPostViewCountAction";
import { useTheme } from "next-themes";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-sky-500 to-indigo-500"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

export default function ViewBlogPage({ content, author, likedByUsers, postId, slugName, viewCount, publishedAt, readingMinutes, isDraft, title, description }: { title: string | null, description: string | null, content: string, author: string, likedByUsers: string[], postId: number, slugName: string, viewCount: number, publishedAt: string, readingMinutes: number, isDraft: boolean }) {
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
  }, [postId, slugName, isDraft]);

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
    <div className="w-full min-w-0 overflow-x-clip rounded-2xl border bg-card/80 px-4 pb-10 pt-6 shadow-sm sm:px-8 md:px-12">
      <ReadingProgress />
      {isDraft && (
        <p className="mb-4 rounded-md bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
          Draft preview — only admins can see this page until it&apos;s published.
        </p>
      )}
      {title && (
        <header className="mb-6">
          <h1 className="font-serif text-[2rem] font-bold leading-[1.15] tracking-[-0.015em] text-foreground [text-wrap:balance] md:text-[2.375rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 font-serif text-lg leading-snug text-muted-foreground [text-wrap:pretty]">
              {description}
            </p>
          )}
        </header>
      )}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 pb-3">
        <p className="min-w-0 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {author || "Unknown author"}
          </span>
          <span className="mx-1.5">·</span>
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </time>
          <span className="mx-1.5">·</span>
          {readingMinutes} min read
        </p>
        <div className="flex shrink-0 gap-4">
          <LikeButton />
          <PostViews />
        </div>
      </div>
      <div className="w-full min-w-0 overflow-x-clip">
        <article
          className="tiptap proseMirror mt-8 mb-4 min-h-full w-full min-w-0"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      </div>
    </div>
  );
}
