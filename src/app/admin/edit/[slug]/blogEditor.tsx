"use client";

import { EditorCanvas, getWordCount, useBlogEditor } from "@/components/editor";
import { EditorMenu, modKey } from "@/components/editorMenu";
import { SavePostAction, SetPublishedAction } from "./updateBlogAction";
import { ToggleTagAction } from "./toggleTagAction";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
  Settings2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type SaveState = "saved" | "dirty" | "saving" | "error";

const AUTOSAVE_DELAY_MS = 1500;
const WORDS_PER_MINUTE = 230;

/** Single-line-feeling textarea that grows with its content. */
function AutoGrowTextarea({
  className,
  onEnter,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { onEnter?: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [props.value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          onEnter?.();
        }
      }}
      className={cn(
        "block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
}

function SaveIndicator({
  state,
  lastSavedAt,
  onRetry,
}: {
  state: SaveState;
  lastSavedAt: Date | null;
  onRetry: () => void;
}) {
  if (state === "error") {
    return (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
      >
        <AlertCircle className="h-3.5 w-3.5" />
        Save failed · Retry
      </button>
    );
  }

  const content = {
    saving: (
      <>
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
      </>
    ),
    dirty: (
      <>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Unsaved changes
      </>
    ),
    saved: (
      <>
        <Check className="h-3.5 w-3.5 text-emerald-500" /> Saved
      </>
    ),
  }[state];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
          {content}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {lastSavedAt
          ? `Last saved at ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
          : "Changes save automatically"}
        <span className="ml-2 opacity-60">{modKey}S</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function BlogEditor({
  id,
  content,
  title,
  description,
  slug,
  isPublished,
  assignedTags,
  allTags,
}: {
  id: number;
  content: string;
  title: string;
  description: string;
  slug: string;
  isPublished?: boolean;
  assignedTags?: { id: number | null; name: string | null }[];
  allTags?: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [published, setPublished] = useState(Boolean(isPublished));
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedTags, setSelectedTags] = useState(
    () => new Set(assignedTags?.map((tag) => tag.id).filter((tagId) => tagId !== null)),
  );
  const [wordCount, setWordCount] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Refs let the debounced save read the latest draft without re-subscribing.
  const titleRef = useRef(title);
  const descriptionRef = useRef(description);
  const draftVersion = useRef(0);
  const savedVersion = useRef(0);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markDirtyRef = useRef<() => void>(() => undefined);

  const editor = useBlogEditor({
    content,
    onCreate: (editor) => setWordCount(getWordCount(editor)),
    onUpdate: (editor) => {
      setWordCount(getWordCount(editor));
      markDirtyRef.current();
    },
  });

  const save = useCallback(async (): Promise<boolean> => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (!editor) return false;
    // Let an in-flight save finish, then save whatever changed meanwhile.
    if (inFlight.current) await inFlight.current;

    const version = draftVersion.current;
    if (version === savedVersion.current) return true;

    setSaveState("saving");
    const request = SavePostAction(slug, {
      title: titleRef.current,
      description: descriptionRef.current,
      content: editor.getHTML(),
    })
      .then((res) => {
        if (!res.isUpdated) throw new Error("Post not found");
        savedVersion.current = version;
        setLastSavedAt(res.updatedAt ? new Date(res.updatedAt) : new Date());
        setSaveState(draftVersion.current === version ? "saved" : "dirty");
        return true;
      })
      .catch(() => {
        setSaveState("error");
        toast.error("Couldn't save your changes", {
          description: "They're still here in the editor. We'll retry as you keep writing.",
        });
        return false;
      })
      .finally(() => {
        inFlight.current = null;
      });
    inFlight.current = request;
    return request;
  }, [editor, slug]);

  const markDirty = useCallback(() => {
    draftVersion.current += 1;
    setSaveState((s) => (s === "saving" ? s : "dirty"));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(), AUTOSAVE_DELAY_MS);
  }, [save]);

  useEffect(() => {
    markDirtyRef.current = markDirty;
  }, [markDirty]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // Keyboard shortcuts: save now, toggle focus mode.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save().then((ok) => ok && toast.success("Saved"));
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setFocusMode((f) => !f);
      } else if (e.key === "Escape" && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save, focusMode]);

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (saveState === "saved") return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveState]);

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    try {
      if (!(await save())) return;
      const next = !published;
      if (!(await SetPublishedAction(slug, next))) throw new Error("Post not found");
      setPublished(next);
      if (next) {
        toast.success("Your post is live 🎉", {
          action: { label: "View", onClick: () => window.open(`/posts/${slug}`, "_blank") },
        });
      } else {
        toast("Post moved back to drafts");
      }
    } catch {
      toast.error(`Couldn't ${published ? "unpublish" : "publish"} the post`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleTag = async (tagId: number) => {
    const shouldAssign = !selectedTags.has(tagId);
    const update = (assign: boolean) =>
      setSelectedTags((prev) => {
        const next = new Set(prev);
        if (assign) next.add(tagId);
        else next.delete(tagId);
        return next;
      });
    update(shouldAssign);
    try {
      await ToggleTagAction(id, tagId, slug, shouldAssign);
    } catch {
      update(!shouldAssign);
      toast.error("Couldn't update tags");
    }
  };

  const readingMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

  return (
    <div className="min-h-screen font-sans">
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md transition-opacity duration-300",
          focusMode && "border-transparent opacity-0 hover:opacity-100 focus-within:opacity-100",
        )}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            onClick={async () => {
              await save();
              router.push("/admin");
            }}
          >
            <ArrowLeft />
            <span className="hidden sm:inline">Posts</span>
          </Button>

          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              published
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-muted text-muted-foreground",
            )}
          >
            {published ? "Published" : "Draft"}
          </span>
          <SaveIndicator state={saveState} lastSavedAt={lastSavedAt} onRetry={() => void save()} />

          <div className="ml-auto flex items-center gap-1">
            <span className="mr-2 hidden text-xs tabular-nums text-muted-foreground md:inline">
              {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"} · {readingMinutes} min read
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={focusMode ? "Exit focus mode" : "Focus mode"}
                  onClick={() => setFocusMode((f) => !f)}
                >
                  {focusMode ? <Minimize2 /> : <Maximize2 />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {focusMode ? "Exit focus mode" : "Focus mode"}
                <span className="ml-2 opacity-60">{modKey}⇧F</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Post settings" onClick={() => setSettingsOpen(true)}>
                  <Settings2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Post settings &amp; tags</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={`/posts/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Preview post"
                    onClick={() => void save()}
                  >
                    <ExternalLink />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Preview in a new tab</TooltipContent>
            </Tooltip>

            <Button
              size="sm"
              variant={published ? "outline" : "default"}
              className="ml-1"
              disabled={isPublishing || !editor}
              onClick={() => void handleTogglePublish()}
            >
              {isPublishing && <Loader2 className="animate-spin" />}
              {published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>

        {editor && !focusMode && (
          <div className="mx-auto flex max-w-4xl justify-center px-4 pb-2">
            <EditorMenu editor={editor} />
          </div>
        )}
      </header>

      <main
        className={cn(
          "mx-auto max-w-3xl px-5 pb-[40vh] pt-10 transition-[padding] duration-300 sm:px-8",
          focusMode && "pt-24",
        )}
      >
        <AutoGrowTextarea
          aria-label="Post title"
          placeholder="Title"
          maxLength={256}
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
            titleRef.current = e.target.value;
            markDirty();
          }}
          onEnter={() => editor?.commands.focus("start")}
          className="font-serif text-[2rem] font-bold leading-[1.15] tracking-[-0.015em] text-foreground md:text-[2.375rem]"
        />
        <AutoGrowTextarea
          aria-label="Post description"
          placeholder="Add a short summary for the home page…"
          maxLength={512}
          value={newDescription}
          onChange={(e) => {
            setNewDescription(e.target.value);
            descriptionRef.current = e.target.value;
            markDirty();
          }}
          onEnter={() => editor?.commands.focus("start")}
          className="mt-3 font-serif text-lg leading-snug text-muted-foreground"
        />
        <hr className="my-8 border-border/70" />

        {editor ? (
          <EditorCanvas editor={editor} />
        ) : (
          <div className="space-y-4" aria-hidden>
            <div className="h-5 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        )}
      </main>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent className="font-sans">
          <SheetHeader>
            <SheetTitle>Post settings</SheetTitle>
            <SheetDescription>Changes here save immediately.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-8">
            <section className="space-y-2">
              <h3 className="text-sm font-medium">Link</h3>
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">/posts/{slug}</span>
                <button
                  type="button"
                  aria-label="Copy link"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    void navigator.clipboard.writeText(`${window.location.origin}/posts/${slug}`);
                    toast.success("Link copied");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <div>
                <h3 className="text-sm font-medium">Tags</h3>
                <p className="text-xs text-muted-foreground">Group related posts so readers can browse them.</p>
              </div>
              {allTags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.has(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => void handleToggleTag(tag.id)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t created any tags yet.{" "}
                  <a href="/admin/tags-management" className="underline underline-offset-2">
                    Create one
                  </a>
                </p>
              )}
            </section>

            <section className="space-y-2 text-xs text-muted-foreground">
              <h3 className="text-sm font-medium text-foreground">Writing tips</h3>
              <ul className="space-y-1.5">
                <li>Type <kbd className="rounded border px-1 font-mono">/</kbd> on a new line to insert headings, lists, code, images or video.</li>
                <li>Select text to format it or add a link (<kbd className="rounded border px-1 font-mono">{modKey}K</kbd>).</li>
                <li>Markdown works: <code className="font-mono">##</code>, <code className="font-mono">-</code>, <code className="font-mono">&gt;</code>, <code className="font-mono">```</code>, <code className="font-mono">**bold**</code>.</li>
                <li>Drag, drop or paste images straight into the post.</li>
              </ul>
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
