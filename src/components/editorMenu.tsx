"use client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Image,
  Italic,
  Link2,
  List,
  Quote,
  Redo2,
  Undo2,
  Video,
} from "lucide-react";
import { Button } from "./ui/button";
import { useCurrentEditor } from "@tiptap/react";
import { useCallback } from "react";

export const EditorMenu = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = () => {
    const url = window.prompt("YouTube Video URL");

    if (url) {
      editor?.commands.setYoutubeVideo({
        src: url,
        width: 520,
        height: 480,
      });
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href || "";
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (error) {
      console.error("Error setting link:", error);
    }
  };
  return (
    <div className="mb-4 grid grid-cols-7 gap-2">
      <Button
        type="button"
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        className={editor?.isActive("blockquote") ? "bg-gray-500" : ""}
      >
        <Quote />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-gray-500" : ""}
      >
        <Code2 />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-500" : ""}
      >
        <Bold />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-500" : ""}
      >
        <Italic />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <List />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? "bg-gray-500" : ""
        }
      >
        H1
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? "bg-gray-500" : ""
        }
      >
        H2
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 }) ? "bg-gray-500" : ""
        }
      >
        H3
      </Button>

      <Button
        type="button"
        onClick={addImage}
        className={editor.isActive("image") ? "bg-gray-500" : ""}
      >
        <Image />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        <AlignLeft />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        <AlignCenter />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        <AlignRight />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setEmoji("zap").run()}
      >
        ⚡
      </Button>
      <Button type="button" onClick={addYoutubeVideo}>
        <Video />
      </Button>

      <Button
        type="button"
        onClick={setLink}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        <Link2 />
      </Button>
    </div>
  );
};
