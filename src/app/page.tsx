"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentCard } from "@/components/ContentCard";
import { BottomActionWidget } from "@/components/BottomActionWidget";
import { getDefaultContentTypes, CONTENT_TYPES } from "@/config/contentTypes";

// Card instance type
interface CardInstance {
  id: string; // unique instance ID
  contentTypeId: string; // the prompt/content type
  history: (string[] | string)[]; // version history
  currentVersion: number;
  isLoading: boolean;
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<"upload" | "paste">(
    "paste"
  );
  const [transcript, setTranscript] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Track card instances (allows multiple instances of same content type)
  const [cardInstances, setCardInstances] = useState<CardInstance[]>([]);

  const generateContent = async (instanceId: string, contentTypeId: string) => {
    if (transcript.trim().length === 0) return;

    // Set loading state for this instance
    setCardInstances((prev) =>
      prev.map((card) =>
        card.id === instanceId ? { ...card, isLoading: true } : card
      )
    );
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, contentType: contentTypeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const newContent = data[contentTypeId];

      // Add to this instance's history and jump to newest version
      setCardInstances((prev) =>
        prev.map((card) => {
          if (card.id === instanceId) {
            const updatedHistory = [...card.history, newContent];
            return {
              ...card,
              history: updatedHistory,
              currentVersion: updatedHistory.length - 1,
              isLoading: false,
            };
          }
          return card;
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Clear loading state on error
      setCardInstances((prev) =>
        prev.map((card) =>
          card.id === instanceId ? { ...card, isLoading: false } : card
        )
      );
    }
  };

  const handleGenerate = async () => {
    if (transcript.trim().length === 0) return;

    setShowResults(true);
    setError(null);

    // Create card instances for default content types
    const defaultTypes = getDefaultContentTypes();
    const newInstances: CardInstance[] = defaultTypes.map((typeId) => ({
      id: `${typeId}-${Date.now()}-${Math.random()}`,
      contentTypeId: typeId,
      history: [],
      currentVersion: 0,
      isLoading: true,
    }));

    setCardInstances(newInstances);

    // Generate content for each instance
    await Promise.all(
      newInstances.map((instance) =>
        generateContent(instance.id, instance.contentTypeId)
      )
    );
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const regenerate = async (instanceId: string, contentTypeId: string) => {
    await generateContent(instanceId, contentTypeId);
  };

  const changeVersion = (instanceId: string, direction: "prev" | "next") => {
    setCardInstances((prev) =>
      prev.map((card) => {
        if (card.id === instanceId) {
          const newVersion =
            direction === "next"
              ? Math.min(card.currentVersion + 1, card.history.length - 1)
              : Math.max(card.currentVersion - 1, 0);
          return { ...card, currentVersion: newVersion };
        }
        return card;
      })
    );
  };

  const handleStartOver = () => {
    setTranscript("");
    setCardInstances([]);
    setShowResults(false);
    setError(null);
  };

  const handlePromptSelect = (promptId: string) => {
    // Create a new card instance for this prompt
    const newInstance: CardInstance = {
      id: `${promptId}-${Date.now()}-${Math.random()}`,
      contentTypeId: promptId,
      history: [],
      currentVersion: 0,
      isLoading: true,
    };

    setCardInstances((prev) => [...prev, newInstance]);

    // Immediately start generating content for it
    generateContent(newInstance.id, promptId);

    // Auto-scroll to bottom to show new card
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const isGenerating = cardInstances.some((card) => card.isLoading);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <main className="w-full max-w-6xl mx-auto pb-48">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Multiply Your Content
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your audio and video recordings into engaging social
            posts, highlight clips, show notes, and more — instantly.
          </p>
        </div>

        {/* Input Options */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* File Upload - Disabled */}
          <button
            disabled
            className="relative p-6 rounded-lg border border-border bg-muted/50 opacity-60 cursor-not-allowed transition-all duration-200"
          >
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium">
                Coming Soon
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                <Upload className="w-6 h-6 text-foreground/40" />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">Upload File</h3>
                <p className="text-sm text-muted-foreground">
                  Drop your audio or video file
                </p>
              </div>
            </div>
          </button>

          {/* Paste Transcript - Active */}
          <button
            onClick={() => setSelectedOption("paste")}
            disabled={showResults}
            className={`relative p-6 rounded-lg border transition-all duration-200 ${
              selectedOption === "paste"
                ? "border-foreground bg-background shadow-sm"
                : "border-border bg-background hover:border-foreground/50 hover:shadow-sm"
            } ${showResults ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  selectedOption === "paste"
                    ? "bg-foreground text-background"
                    : "bg-foreground/5 text-foreground"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">
                  Paste Transcript
                </h3>
                <p className="text-sm text-muted-foreground">
                  Copy and paste your transcript text
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Transcript Input Area */}
        {selectedOption === "paste" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-8">
            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <label
                htmlFor="transcript"
                className="block text-sm font-medium mb-3"
              >
                Transcript
              </label>
              <textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                disabled={showResults}
                placeholder="Paste your transcript here... Include timestamps if available for better results."
                className="w-full min-h-[300px] p-4 rounded-md bg-background text-base resize-y focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                maxLength={50000}
              />
              {!showResults && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Maximum 50,000 characters
                  </p>
                  <button
                    onClick={handleGenerate}
                    disabled={transcript.trim().length === 0 || isGenerating}
                    className="px-6 py-2.5 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
                  >
                    {isGenerating ? "Processing..." : "Submit"}
                  </button>
                </div>
              )}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <TooltipProvider delayDuration={0}>
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Output
                </h2>
              </div>
              <div className="space-y-6">
                {cardInstances.map((card) => {
                  const currentContent =
                    card.history[card.currentVersion] || null;

                  return (
                    <ContentCard
                      key={card.id}
                      contentTypeId={card.contentTypeId}
                      content={currentContent}
                      isLoading={card.isLoading}
                      currentVersion={card.currentVersion}
                      totalVersions={card.history.length}
                      copiedId={copiedId}
                      onCopy={copyToClipboard}
                      onRegenerate={() =>
                        regenerate(card.id, card.contentTypeId)
                      }
                      onVersionChange={(direction) =>
                        changeVersion(card.id, direction)
                      }
                    />
                  );
                })}
              </div>
            </div>
          </TooltipProvider>
        )}
      </main>

      {/* Bottom Action Widget - Only show when results are visible */}
      {showResults && (
        <BottomActionWidget
          onPromptSelect={handlePromptSelect}
          onStartOver={handleStartOver}
          activeContentTypes={cardInstances.map((card) => card.contentTypeId)}
        />
      )}
    </div>
  );
}
