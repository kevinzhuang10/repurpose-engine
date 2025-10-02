"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PromptConfigModal } from "./PromptConfigModal";
import type { PromptLibrary, Prompt } from "@/types/promptLibrary";
import { Eye, Play } from "lucide-react";

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
  const [promptLibrary, setPromptLibrary] = useState<PromptLibrary | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    // Load prompt library JSON
    fetch("/prompt-library.json")
      .then((res) => res.json())
      .then((data: PromptLibrary) => {
        setPromptLibrary(data);
      })
      .catch((err) => console.error("Failed to load prompt library:", err));
  }, []);

  const handleViewConfig = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setConfigModalOpen(true);
  };

  const handleRunPrompt = (promptName: string) => {
    // For now, use promptName as the ID
    // TODO: Update to use proper prompt IDs
    onSelect(promptName);
  };

  if (!promptLibrary) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[90vw] !max-w-[1600px] !h-[90vh] overflow-hidden flex flex-col sm:!max-w-[1600px]">
          <DialogHeader>
            <DialogTitle>{promptLibrary.name}</DialogTitle>
            <DialogDescription>{promptLibrary.description}</DialogDescription>
          </DialogHeader>

          {/* Scrollable content with all categories */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-8">
              {promptLibrary.useCaseCategories.map((category) => (
                <div key={category.categoryName}>
                  {/* Category Header */}
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                    {category.categoryName}
                  </h3>

                  {/* Prompts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.prompts.map((prompt, index) => (
                      <div
                        key={`${prompt.promptName}-${index}`}
                        onClick={() => handleRunPrompt(prompt.promptName)}
                        className="group relative p-5 rounded-lg border border-border bg-background hover:border-foreground/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex flex-col gap-2">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-foreground transition-colors">
                            {prompt.promptName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Play className="w-3 h-3 fill-current" />
                            <span>Run</span>
                          </div>
                        </div>

                        {/* View config button - subtle, top right */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewConfig(prompt);
                          }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted"
                          title="View settings"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PromptConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        prompt={selectedPrompt}
      />
    </>
  );
}
