"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentCard } from "@/components/ContentCard";
import { BottomActionWidget } from "@/components/BottomActionWidget";
import { getDefaultContentTypes, CONTENT_TYPES } from "@/config/contentTypes";

// Dynamic state types
interface ContentHistory {
  [contentTypeId: string]: (string[] | string)[];
}

interface LoadingState {
  [contentTypeId: string]: boolean;
}

interface CurrentVersions {
  [contentTypeId: string]: number;
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<"upload" | "paste">("paste");
  const [transcript, setTranscript] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Track which content types are active
  const [activeContentTypes, setActiveContentTypes] = useState<string[]>(
    getDefaultContentTypes()
  );

  // Dynamic state management
  const [contentHistory, setContentHistory] = useState<ContentHistory>({});
  const [loadingState, setLoadingState] = useState<LoadingState>({});
  const [currentVersions, setCurrentVersions] = useState<CurrentVersions>({});

  const generateContent = async (contentTypeId: string) => {
    if (transcript.trim().length === 0) return;

    setLoadingState((prev) => ({ ...prev, [contentTypeId]: true }));
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

      // Add to history and jump to newest version
      setContentHistory((prev) => {
        const updatedHistory = {
          ...prev,
          [contentTypeId]: [...(prev[contentTypeId] || []), newContent],
        };

        // Set current version to the newest (last index)
        setCurrentVersions((prevVersions) => ({
          ...prevVersions,
          [contentTypeId]: updatedHistory[contentTypeId].length - 1,
        }));

        return updatedHistory;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingState((prev) => ({ ...prev, [contentTypeId]: false }));
    }
  };

  const handleGenerate = async () => {
    if (transcript.trim().length === 0) return;

    setShowResults(true);
    setError(null);

    // Generate default content types in parallel
    await Promise.all(
      getDefaultContentTypes().map((typeId) => generateContent(typeId))
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

  const regenerate = async (contentTypeId: string) => {
    await generateContent(contentTypeId);
  };

  const changeVersion = (contentTypeId: string, direction: "prev" | "next") => {
    const history = contentHistory[contentTypeId] || [];
    if (history.length === 0) return;

    setCurrentVersions((prev) => ({
      ...prev,
      [contentTypeId]:
        direction === "next"
          ? Math.min((prev[contentTypeId] || 0) + 1, history.length - 1)
          : Math.max((prev[contentTypeId] || 0) - 1, 0),
    }));
  };

  const handleStartOver = () => {
    setTranscript("");
    setContentHistory({});
    setCurrentVersions({});
    setLoadingState({});
    setActiveContentTypes(getDefaultContentTypes());
    setShowResults(false);
    setError(null);
  };

  const handlePromptSelect = (promptId: string) => {
    // Add the new content type to active list
    setActiveContentTypes((prev) => [...prev, promptId]);

    // Immediately start generating content for it
    generateContent(promptId);

    // Auto-scroll to bottom to show new card
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const isGenerating = Object.values(loadingState).some((loading) => loading);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <main className="w-full max-w-6xl mx-auto pb-48">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Multiply Your Content
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your audio and video recordings into engaging social posts,
            highlight clips, show notes, and more — instantly.
          </p>
        </div>

        {/* Input Options */}
        {!showResults && (
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
              className={`relative p-6 rounded-lg border transition-all duration-200 ${
                selectedOption === "paste"
                  ? "border-foreground bg-background shadow-sm"
                  : "border-border bg-background hover:border-foreground/50 hover:shadow-sm"
              }`}
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
                  <h3 className="font-medium text-base mb-1">Paste Transcript</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy and paste your transcript text
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Transcript Input Area */}
        {selectedOption === "paste" && !showResults && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-8">
            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <label htmlFor="transcript" className="block text-sm font-medium mb-3">
                Transcript
              </label>
              <textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your transcript here... Include timestamps if available for better results."
                className="w-full min-h-[300px] p-4 rounded-md border border-border bg-background text-base resize-y focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
                maxLength={50000}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Maximum 50,000 characters
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={transcript.trim().length === 0 || isGenerating}
                  className="px-6 py-2.5 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground"
                >
                  {isGenerating ? "Generating..." : "Generate Content"}
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <TooltipProvider delayDuration={0}>
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Output</h2>
              </div>
              <div className="space-y-6">
                {activeContentTypes.map((contentTypeId) => {
                  const history = contentHistory[contentTypeId] || [];
                  const currentVersion = currentVersions[contentTypeId] || 0;
                  const currentContent = history[currentVersion] || null;

                  return (
                    <ContentCard
                      key={contentTypeId}
                      contentTypeId={contentTypeId}
                      content={currentContent}
                      isLoading={loadingState[contentTypeId] || false}
                      currentVersion={currentVersion}
                      totalVersions={history.length}
                      copiedId={copiedId}
                      onCopy={copyToClipboard}
                      onRegenerate={() => regenerate(contentTypeId)}
                      onVersionChange={(direction) =>
                        changeVersion(contentTypeId, direction)
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
          activeContentTypes={activeContentTypes}
        />
      )}
    </div>
  );
}
