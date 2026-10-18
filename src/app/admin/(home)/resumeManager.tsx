"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Loader2,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { RemoveResumeAction, SetResumeVisibilityAction } from "./resumeActions";

interface CurrentResume {
  url: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isVisible: boolean;
}

const MAX_BYTES = 4 * 1024 * 1024;

function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-visible:ring-ring relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50",
        checked ? "bg-emerald-500" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeManager({ resume }: { resume: CurrentResume | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, startRemove] = useTransition();
  const [isVisible, setIsVisible] = useState(resume?.isVisible ?? true);
  const [isSavingVisibility, setIsSavingVisibility] = useState(false);

  // Stay in sync after a refresh (e.g. a replacement upload).
  useEffect(() => {
    if (resume) setIsVisible(resume.isVisible);
  }, [resume?.isVisible]);

  const toggleVisibility = async (next: boolean) => {
    setIsVisible(next);
    setIsSavingVisibility(true);
    try {
      await SetResumeVisibilityAction(next);
      toast.success(
        next
          ? "Resume is visible on your home page"
          : "Resume hidden from your home page",
      );
      router.refresh();
    } catch {
      setIsVisible(!next);
      toast.error("Couldn't update visibility");
    } finally {
      setIsSavingVisibility(false);
    }
  };

  const { startUpload, isUploading } = useUploadThing("resumeUploader", {
    onUploadProgress: setProgress,
    onClientUploadComplete: () => {
      setProgress(null);
      toast.success(resume ? "Resume replaced" : "Resume uploaded", {
        description: "It now shows in your About Me section.",
      });
      router.refresh();
    },
    onUploadError: (error) => {
      setProgress(null);
      toast.error("Upload failed", { description: error.message });
    },
  });

  const upload = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please choose a PDF file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That file is larger than 4 MB");
      return;
    }
    setProgress(0);
    void startUpload([file]);
  };

  const remove = () => {
    if (
      !window.confirm(
        "Remove your resume? It will no longer appear on your site.",
      )
    )
      return;
    startRemove(async () => {
      try {
        await RemoveResumeAction();
        toast.success("Resume removed");
        router.refresh();
      } catch {
        toast.error("Couldn't remove the resume");
      }
    });
  };

  const shareLink = async () => {
    const link = `${window.location.origin}/resume`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Resume link copied", {
        description: `${link} — always opens your latest resume.`,
        descriptionClassName: "!text-muted-foreground",
      });
    } catch {
      // Clipboard can be blocked (e.g. non-HTTPS); let the user copy it by hand.
      window.prompt("Copy your resume link:", link);
    }
  };

  const busy = isUploading || isRemoving;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!busy) upload(e.dataTransfer.files[0]);
      }}
      className={cn(
        "border-border bg-background/50 rounded-xl border border-dashed p-4 transition-colors",
        isDragging && "border-sky-500 bg-sky-500/5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {isUploading ? (
        <div className="space-y-2 py-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…{" "}
            {progress ?? 0}%
          </p>
          <div className="bg-muted h-1.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-sky-500 transition-[width]"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : resume ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {resume.fileName}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatSize(resume.fileSize)} · Uploaded{" "}
                {new Date(resume.uploadedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => void shareLink()}>
                <Share2 /> Share
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={resume.url} target="_blank" rel="noreferrer">
                  <ExternalLink /> View
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                <Upload /> Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={remove}
                className="text-destructive hover:text-destructive"
                aria-label="Remove resume"
              >
                {isRemoving ? <Loader2 className="animate-spin" /> : <Trash2 />}
              </Button>
            </div>
          </div>
          <div className="border-border/60 flex items-center justify-between gap-4 border-t pt-4">
            <div className="flex items-start gap-3">
              {isVisible ? (
                <Eye className="mt-0.5 h-4 w-4 text-emerald-500" />
              ) : (
                <EyeOff className="text-muted-foreground mt-0.5 h-4 w-4" />
              )}
              <div>
                <p className="text-foreground text-sm font-medium">
                  Show on home page
                </p>
                <p className="text-muted-foreground text-xs">
                  {isVisible
                    ? "Visitors see a Resume button in your About Me section."
                    : "Hidden from visitors. The file stays here so you can turn it back on anytime."}
                </p>
              </div>
            </div>
            <Switch
              checked={isVisible}
              disabled={busy || isSavingVisibility}
              onChange={(next) => void toggleVisibility(next)}
              label="Show resume on home page"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 py-4 text-center"
        >
          <span className="bg-muted text-muted-foreground flex h-11 w-11 items-center justify-center rounded-full">
            <Upload className="h-5 w-5" />
          </span>
          <span className="text-foreground text-sm font-medium">
            Drop your resume here, or click to upload
          </span>
          <span className="text-muted-foreground text-xs">PDF, up to 4 MB</span>
        </button>
      )}
    </div>
  );
}
