"use client";
import { EditorContent, Extension, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import FileHandler from "@tiptap/extension-file-handler";
import Typography from "@tiptap/extension-typography";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
import { SlashCommand } from "./slashCommand";
import { IMAGE_MIME_TYPES, uploadImageIntoEditor } from "./editorImageUpload";
import { promptForLink } from "./editorMenu";
import { EditorBubbleMenu, OPEN_LINK_EDITOR_EVENT } from "./editorBubbleMenu";

const lowlight = createLowlight(all);

// Mod-K opens the inline link field when text is selected, otherwise a prompt.
const LinkShortcut = Extension.create({
  name: "linkShortcut",
  addKeyboardShortcuts() {
    return {
      "Mod-k": () => {
        if (this.editor.state.selection.empty) {
          promptForLink(this.editor);
        } else {
          this.editor.view.dom.dispatchEvent(new CustomEvent(OPEN_LINK_EDITOR_EVENT));
        }
        return true;
      },
    };
  },
});

const extensions = [
  StarterKit.configure({
    codeBlock: false, // replaced by CodeBlockLowlight
    heading: { levels: [1, 2, 3] },
    dropcursor: { color: "var(--ring)", width: 3 },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
    },
  }),
  CodeBlockLowlight.configure({ lowlight, defaultLanguage: "javascript" }),
  Highlight.configure({ multicolor: true }),
  // No TextStyle/FontFamily: inline fonts from pasted content are dropped so
  // every post uses the site's reading typography.
  Markdown,
  Typography,
  Emoji.configure({ emojis: gitHubEmojis, enableEmoticons: true }),
  Image,
  Youtube.configure({ controls: false, nocookie: true }),
  TextAlign.configure({ types: ["heading", "paragraph", "blockquote"] }),
  CharacterCount,
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === "heading") return `Heading ${node.attrs.level as number}`;
      if (node.type.name === "codeBlock") return "";
      return "Write something, or press “/” for blocks…";
    },
  }),
  FileHandler.configure({
    allowedMimeTypes: IMAGE_MIME_TYPES,
    onDrop: (editor, files, pos) => {
      for (const file of files) void uploadImageIntoEditor(editor, file, pos);
    },
    onPaste: (editor, files, htmlContent) => {
      // Pasted HTML that already references the image is handled by the editor.
      if (htmlContent) return;
      for (const file of files) void uploadImageIntoEditor(editor, file);
    },
  }),
  SlashCommand,
  LinkShortcut,
];

export function useBlogEditor({
  content,
  onCreate,
  onUpdate,
}: {
  content: string;
  onCreate: (editor: Editor) => void;
  onUpdate: (editor: Editor) => void;
}) {
  return useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "editor-canvas focus:outline-none",
        spellcheck: "true",
      },
    },
    onCreate: ({ editor }) => onCreate(editor),
    onUpdate: ({ editor }) => onUpdate(editor),
  });
}

export function EditorCanvas({ editor }: { editor: Editor }) {
  return (
    <>
      <EditorContent editor={editor} />
      <EditorBubbleMenu editor={editor} />
    </>
  );
}

export function getWordCount(editor: Editor) {
  return editor.storage.characterCount.words();
}
