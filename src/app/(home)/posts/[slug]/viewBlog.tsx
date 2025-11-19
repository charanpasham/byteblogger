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
        <ViewIcon className="text-gray-700 dark:text-gray-300 h-5 w-5 self-center" />
        <span className="text-sm dark:text-gray-300 self-center">{viewCount} {viewCount === 1 ? "View" : "Views"}</span>
    </div>

  )
  return (
    <>
      <h2 className="pt-4 text-base italic font-thin">- {author}</h2>
      <div className="flex mt-2 gap-5">
        <LikeButton />
        <PostViews />
      </div>
      <article
        className={`tiptap proseMirror mt-5 mb-10 min-h-full !text-md md:!text-lg`}
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </>
  );
}
