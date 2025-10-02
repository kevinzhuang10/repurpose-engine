"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PromptLibraryModal } from "./PromptLibraryModal";
import { ConfirmationModal } from "./ConfirmationModal";

interface BottomActionWidgetProps {
  onPromptSelect: (promptId: string) => void;
  onStartOver: () => void;
  activeContentTypes: string[];
}

export function BottomActionWidget({
  onPromptSelect,
  onStartOver,
  activeContentTypes,
}: BottomActionWidgetProps) {
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePromptSelect = (promptId: string) => {
    setShowPromptLibrary(false);
    onPromptSelect(promptId);
  };

  const handleStartOver = () => {
    setShowConfirmation(false);
    onStartOver();
  };

  return (
    <>
      {/* Fixed bottom widget with backdrop blur */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm">
        {/* Gradient fade effect */}
        <div className="absolute bottom-full left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />

        {/* Widget content */}
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center gap-3">
            {/* New Prompt button - larger, primary */}
            <button
              onClick={() => setShowPromptLibrary(true)}
              className="flex items-center justify-center gap-2.5 px-8 py-3 bg-foreground text-background rounded-md font-medium text-base hover:bg-foreground/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Prompt</span>
            </button>

            {/* Start Over button - secondary, same height */}
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-6 py-3 rounded-md text-base font-medium text-muted-foreground border border-border hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PromptLibraryModal
        open={showPromptLibrary}
        onOpenChange={setShowPromptLibrary}
        onSelect={handlePromptSelect}
        activeContentTypes={activeContentTypes}
      />

      <ConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleStartOver}
        title="Start Over?"
        description="This will clear all your current results and input. This action cannot be undone."
        confirmText="Start Over"
        cancelText="Cancel"
      />
    </>
  );
}
