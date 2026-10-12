"use client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { pickImageIntoEditor } from "./editorImageUpload";

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
export const modKey = isMac ? "⌘" : "Ctrl";

export function ToolbarButton({
  icon: Icon,
  label,
  shortcut,
  isActive,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={isActive}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()} // keep the editor selection
          onClick={onClick}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35",
            isActive && "bg-accent text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="font-sans">
        {label}
        {shortcut && <span className="ml-2 opacity-60">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-border" />;

export function promptForLink(editor: Editor) {
  const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
  const url = window.prompt("Link URL (leave empty to remove)", previousUrl);
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

export const EditorMenu = ({ editor }: { editor: Editor }) => {
  // Re-render only when the formatting state under the cursor changes.
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      h1: editor.isActive("heading", { level: 1 }),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      code: editor.isActive("code"),
      highlight: editor.isActive("highlight"),
      link: editor.isActive("link"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      codeBlock: editor.isActive("codeBlock"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-border/70 bg-background/90 px-1.5 py-1 shadow-sm backdrop-blur [scrollbar-width:none]"
    >
      <ToolbarButton icon={Undo2} label="Undo" shortcut={`${modKey}Z`} disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <ToolbarButton icon={Redo2} label="Redo" shortcut={`${modKey}⇧Z`} disabled={!state.canRedo} onClick={() => chain().redo().run()} />
      <Divider />
      <ToolbarButton icon={Heading1} label="Heading 1" shortcut="# " isActive={state.h1} onClick={() => chain().toggleHeading({ level: 1 }).run()} />
      <ToolbarButton icon={Heading2} label="Heading 2" shortcut="## " isActive={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton icon={Heading3} label="Heading 3" shortcut="### " isActive={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <Divider />
      <ToolbarButton icon={Bold} label="Bold" shortcut={`${modKey}B`} isActive={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton icon={Italic} label="Italic" shortcut={`${modKey}I`} isActive={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolbarButton icon={Underline} label="Underline" shortcut={`${modKey}U`} isActive={state.underline} onClick={() => chain().toggleUnderline().run()} />
      <ToolbarButton icon={Strikethrough} label="Strikethrough" shortcut={`${modKey}⇧S`} isActive={state.strike} onClick={() => chain().toggleStrike().run()} />
      <ToolbarButton icon={Code} label="Inline code" shortcut={`${modKey}E`} isActive={state.code} onClick={() => chain().toggleCode().run()} />
      <ToolbarButton icon={Highlighter} label="Highlight" shortcut={`${modKey}⇧H`} isActive={state.highlight} onClick={() => chain().toggleHighlight().run()} />
      <ToolbarButton icon={Link2} label="Link" shortcut={`${modKey}K`} isActive={state.link} onClick={() => promptForLink(editor)} />
      <Divider />
      <ToolbarButton icon={List} label="Bulleted list" shortcut="- " isActive={state.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton icon={ListOrdered} label="Numbered list" shortcut="1. " isActive={state.orderedList} onClick={() => chain().toggleOrderedList().run()} />
      <ToolbarButton icon={Quote} label="Quote" shortcut="> " isActive={state.blockquote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolbarButton icon={Code2} label="Code block" shortcut="``` " isActive={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
      <ToolbarButton icon={Minus} label="Divider" shortcut="---" onClick={() => chain().setHorizontalRule().run()} />
      <Divider />
      <ToolbarButton icon={AlignLeft} label="Align left" isActive={state.alignLeft} onClick={() => chain().setTextAlign("left").run()} />
      <ToolbarButton icon={AlignCenter} label="Align center" isActive={state.alignCenter} onClick={() => chain().setTextAlign("center").run()} />
      <ToolbarButton icon={AlignRight} label="Align right" isActive={state.alignRight} onClick={() => chain().setTextAlign("right").run()} />
      <Divider />
      <ToolbarButton icon={ImagePlus} label="Upload image" onClick={() => pickImageIntoEditor(editor)} />
      <ToolbarButton
        icon={Youtube}
        label="Embed YouTube video"
        onClick={() => {
          const src = window.prompt("YouTube video URL");
          if (src) chain().setYoutubeVideo({ src }).run();
        }}
      />
    </div>
  );
};
