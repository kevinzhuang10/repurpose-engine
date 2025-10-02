"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Prompt } from "@/types/promptLibrary";

interface PromptConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
}

export function PromptConfigModal({
  open,
  onOpenChange,
  prompt,
}: PromptConfigModalProps) {
  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prompt settings</DialogTitle>
          <DialogDescription>
            Editing / cloning features coming soon!{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Prompt Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <div className="p-3 rounded-lg border border-border bg-muted/50 text-sm">
              {prompt.promptName}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <div className="p-3 rounded-lg border border-border bg-muted/50 text-sm whitespace-pre-wrap">
              {prompt.prompt}
            </div>
          </div>

          {/* Sample Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sample Content
            </label>
            <div className="p-3 rounded-lg border border-border bg-muted/50 text-sm whitespace-pre-wrap">
              {prompt.sampleContent}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-border">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-md text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
