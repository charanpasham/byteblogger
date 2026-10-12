"use client";
import { useEditorState, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Check,
  Code,
  Heading2,
  Highlighter,
  Italic,
  Link2,
  Strikethrough,
  Unlink,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ToolbarButton, modKey } from "./editorMenu";

export const OPEN_LINK_EDITOR_EVENT = "byteblogger:open-link-editor";

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const [linkDraft, setLinkDraft] = useState<string | null>(null);

  useEffect(() => {
    const dom = editor.view.dom;
    const open = () => setLinkDraft((editor.getAttributes("link").href as string | undefined) ?? "");
    dom.addEventListener(OPEN_LINK_EDITOR_EVENT, open);
    return () => dom.removeEventListener(OPEN_LINK_EDITOR_EVENT, open);
  }, [editor]);

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      highlight: editor.isActive("highlight"),
      h2: editor.isActive("heading", { level: 2 }),
      link: editor.isActive("link"),
      href: editor.getAttributes("link").href as string | undefined,
    }),
  });

  const applyLink = () => {
    const href = linkDraft?.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href) chain.setLink({ href }).run();
    else chain.unsetLink().run();
    setLinkDraft(null);
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor, state: { selection } }) =>
        !selection.empty && !editor.isActive("codeBlock") && !editor.isActive("image")
      }
      className="flex items-center gap-0.5 rounded-xl border border-border bg-popover p-1 font-sans text-popover-foreground shadow-xl"
    >
      {linkDraft !== null ? (
        <form
          className="flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            applyLink();
          }}
        >
          <input
            autoFocus
            type="url"
            placeholder="Paste or type a link…"
            value={linkDraft}
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setLinkDraft(null);
                editor.commands.focus();
              }
            }}
            className="h-8 w-60 rounded-md bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <ToolbarButton icon={Check} label="Apply link" onClick={applyLink} />
          {state.link && (
            <ToolbarButton
              icon={Unlink}
              label="Remove link"
              onClick={() => {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                setLinkDraft(null);
              }}
            />
          )}
        </form>
      ) : (
        <>
          <ToolbarButton icon={Bold} label="Bold" shortcut={`${modKey}B`} isActive={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
          <ToolbarButton icon={Italic} label="Italic" shortcut={`${modKey}I`} isActive={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
          <ToolbarButton icon={Strikethrough} label="Strikethrough" isActive={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()} />
          <ToolbarButton icon={Code} label="Inline code" isActive={state.code} onClick={() => editor.chain().focus().toggleCode().run()} />
          <ToolbarButton icon={Highlighter} label="Highlight" isActive={state.highlight} onClick={() => editor.chain().focus().toggleHighlight().run()} />
          <ToolbarButton icon={Heading2} label="Turn into heading" isActive={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <span className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton icon={Link2} label="Link" shortcut={`${modKey}K`} isActive={state.link} onClick={() => setLinkDraft(state.href ?? "")} />
        </>
      )}
    </BubbleMenu>
  );
}
