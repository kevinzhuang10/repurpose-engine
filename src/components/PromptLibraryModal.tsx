"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAvailablePrompts } from "@/config/contentTypes";

interface PromptLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (promptId: string) => void;
  activeContentTypes: string[];
}

export function PromptLibraryModal({
  open,
  onOpenChange,
  onSelect,
  activeContentTypes,
}: PromptLibraryModalProps) {
  const availablePrompts = getAvailablePrompts();

  // Filter out already active content types
  const selectablePrompts = availablePrompts.filter(
    (prompt) => !activeContentTypes.includes(prompt.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Prompt</DialogTitle>
          <DialogDescription>
            Select a content type to generate from your transcript
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {selectablePrompts.length > 0 ? (
            selectablePrompts.map((template) => {
              const IconComponent = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.id)}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background hover:bg-muted hover:border-foreground/50 transition-all duration-150 text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-foreground/5 flex items-center justify-center text-foreground">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              All available content types have been added
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
