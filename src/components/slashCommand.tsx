"use client";
import { Extension, type Editor, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, {
  type SuggestionKeyDownProps,
  type SuggestionProps,
} from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { pickImageIntoEditor } from "./editorImageUpload";

interface SlashItem {
  title: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  run: (editor: Editor, range: Range) => void;
}

const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    icon: Pilcrow,
    keywords: ["paragraph", "p"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Big section heading",
    icon: Heading1,
    keywords: ["h1", "title"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    keywords: ["h2", "subtitle"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    keywords: ["h3"],
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Bulleted list",
    description: "A simple bulleted list",
    icon: List,
    keywords: ["ul", "unordered", "bullet"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "A list with numbering",
    icon: ListOrdered,
    keywords: ["ol", "ordered", "number"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Quote",
    description: "Call out a quotation",
    icon: Quote,
    keywords: ["blockquote", "citation"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    description: "Syntax-highlighted code",
    icon: Code2,
    keywords: ["code", "snippet", "pre"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Separate sections",
    icon: Minus,
    keywords: ["hr", "rule", "separator", "line"],
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    description: "Upload from your computer",
    icon: ImagePlus,
    keywords: ["picture", "photo", "upload", "img"],
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      pickImageIntoEditor(editor);
    },
  },
  {
    title: "YouTube",
    description: "Embed a video",
    icon: Youtube,
    keywords: ["video", "embed"],
    run: (editor, range) => {
      editor.chain().focus().deleteRange(range).run();
      const src = window.prompt("YouTube video URL");
      if (src) editor.chain().focus().setYoutubeVideo({ src }).run();
    },
  },
];

function filterItems(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return SLASH_ITEMS;
  return SLASH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((keyword) => keyword.startsWith(q)),
  );
}

interface SlashMenuHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

const SlashMenu = forwardRef<SlashMenuHandle, SuggestionProps<SlashItem>>(
  function SlashMenu({ items, command }, ref) {
    const [selected, setSelected] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => setSelected(0), [items]);

    useEffect(() => {
      listRef.current
        ?.querySelector(`[data-index="${selected}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [selected]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (!items.length) return false;
        if (event.key === "ArrowDown") {
          setSelected((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected((i) => (i - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const item = items[selected];
          if (item) command(item);
          return true;
        }
        return false;
      },
    }));

    return (
      <div
        ref={listRef}
        className="max-h-80 w-72 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 font-sans text-popover-foreground shadow-xl"
      >
        {items.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">No matching blocks</p>
        ) : (
          <>
            <p className="px-2 pb-1 pt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Insert block
            </p>
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                data-index={index}
                onMouseEnter={() => setSelected(index)}
                onClick={() => command(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left",
                  index === selected && "bg-accent text-accent-foreground",
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    );
  },
);

function positionMenu(element: HTMLElement, rect: DOMRect | null | undefined) {
  if (!rect) return;
  const menuHeight = element.offsetHeight || 320;
  const fitsBelow = rect.bottom + menuHeight + 8 < window.innerHeight;
  element.style.left = `${Math.min(rect.left, window.innerWidth - 300)}px`;
  element.style.top = fitsBelow
    ? `${rect.bottom + 6}px`
    : `${Math.max(8, rect.top - menuHeight - 6)}px`;
}

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        pluginKey: new PluginKey("slashCommand"),
        char: "/",
        // Don't trigger inside code blocks, where "/" is just a character.
        allow: ({ editor }) => !editor.isActive("codeBlock"),
        items: ({ query }) => filterItems(query),
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => {
          let renderer: ReactRenderer<SlashMenuHandle, SuggestionProps<SlashItem>> | null =
            null;

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, { props, editor: props.editor });
              const el = renderer.element as HTMLElement;
              el.style.position = "fixed";
              el.style.zIndex = "60";
              document.body.appendChild(el);
              requestAnimationFrame(() => positionMenu(el, props.clientRect?.()));
            },
            onUpdate: (props) => {
              renderer?.updateProps(props);
              if (renderer) positionMenu(renderer.element as HTMLElement, props.clientRect?.());
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                renderer?.destroy();
                renderer?.element.remove();
                renderer = null;
                return true;
              }
              return renderer?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              renderer?.destroy();
              renderer?.element.remove();
              renderer = null;
            },
          };
        },
      }),
    ];
  },
});
