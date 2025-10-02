"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Copy,
  Check,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LoadingState {
  socialPosts: boolean;
  summary: boolean;
  quotes: boolean;
}

interface ContentHistory {
  socialPosts: string[][];
  summary: string[];
  quotes: string[][];
}

interface CurrentVersions {
  socialPosts: number;
  summary: number;
  quotes: number;
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<"upload" | "paste">(
    "paste"
  );
  const [transcript, setTranscript] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>({
    socialPosts: false,
    summary: false,
    quotes: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [contentHistory, setContentHistory] = useState<ContentHistory>({
    socialPosts: [],
    summary: [],
    quotes: [],
  });
  const [currentVersions, setCurrentVersions] = useState<CurrentVersions>({
    socialPosts: 0,
    summary: 0,
    quotes: 0,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const generateContent = async (
    type: "socialPosts" | "summary" | "quotes"
  ) => {
    if (transcript.trim().length === 0) return;

    setLoadingState((prev) => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript, contentType: type }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();

      // Add to history and jump to newest version
      setContentHistory((prev) => ({
        ...prev,
        [type]: [...prev[type], data[type]],
      }));

      // Set current version to the newest (last index)
      setCurrentVersions((prev) => ({
        ...prev,
        [type]: contentHistory[type].length, // This will be the new last index
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingState((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleGenerate = async () => {
    if (transcript.trim().length === 0) return;

    setShowResults(true);
    setError(null);

    // Generate all content types in parallel
    await Promise.all([
      generateContent("socialPosts"),
      generateContent("summary"),
      generateContent("quotes"),
    ]);
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

  const regenerate = async (type: "socialPosts" | "summary" | "quotes") => {
    await generateContent(type);
  };

  const changeVersion = (
    type: "socialPosts" | "summary" | "quotes",
    direction: "prev" | "next"
  ) => {
    const maxVersions = contentHistory[type].length;
    if (maxVersions === 0) return;

    setCurrentVersions((prev) => ({
      ...prev,
      [type]:
        direction === "next"
          ? Math.min(prev[type] + 1, maxVersions - 1)
          : Math.max(prev[type] - 1, 0),
    }));
  };

  const handleStartOver = () => {
    setTranscript("");
    setContentHistory({
      socialPosts: [],
      summary: [],
      quotes: [],
    });
    setCurrentVersions({
      socialPosts: 0,
      summary: 0,
      quotes: 0,
    });
    setShowResults(false);
    setError(null);
  };

  // Get current content for each type
  const currentSocialPosts =
    contentHistory.socialPosts.length > 0
      ? contentHistory.socialPosts[currentVersions.socialPosts]
      : null;

  const currentSummary =
    contentHistory.summary.length > 0
      ? contentHistory.summary[currentVersions.summary]
      : null;

  const currentQuotes =
    contentHistory.quotes.length > 0
      ? contentHistory.quotes[currentVersions.quotes]
      : null;

  // Merge social posts and quotes for display
  const mergedSocialPosts = currentSocialPosts
    ? currentSocialPosts.join("\n\n---\n\n")
    : "";
  const mergedQuotes = currentQuotes
    ? currentQuotes.map((q, i) => `${i + 1}. "${q}"`).join("\n\n")
    : "";

  const isGenerating =
    loadingState.socialPosts || loadingState.summary || loadingState.quotes;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <main className="w-full max-w-6xl mx-auto">
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
                <h2 className="text-2xl font-semibold tracking-tight">
                  Output
                </h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleStartOver}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Start Over
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all and start over</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-6">
              {/* Social Posts Card */}
              <div className="rounded-lg border border-border bg-background shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Social Media Posts</h2>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => regenerate("socialPosts")}
                          disabled={loadingState.socialPosts}
                          className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 text-muted-foreground ${
                              loadingState.socialPosts ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Retry</p>
                      </TooltipContent>
                    </Tooltip>
                    {currentSocialPosts && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              copyToClipboard(mergedSocialPosts, "social")
                            }
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            {copiedId === "social" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {contentHistory.socialPosts.length > 0 && (
                      <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("socialPosts", "prev")}
                              disabled={currentVersions.socialPosts === 0}
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Previous</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                          {currentVersions.socialPosts + 1} /{" "}
                          {contentHistory.socialPosts.length}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("socialPosts", "next")}
                              disabled={
                                currentVersions.socialPosts ===
                                contentHistory.socialPosts.length - 1
                              }
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {loadingState.socialPosts ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Generating social posts...
                        </p>
                      </div>
                    </div>
                  ) : currentSocialPosts ? (
                    <textarea
                      readOnly
                      value={mergedSocialPosts}
                      className="w-full min-h-[300px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Content" to create social posts
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Card */}
              <div className="rounded-lg border border-border bg-background shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">
                    Summary & Show Notes
                  </h2>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => regenerate("summary")}
                          disabled={loadingState.summary}
                          className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 text-muted-foreground ${
                              loadingState.summary ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Retry</p>
                      </TooltipContent>
                    </Tooltip>
                    {currentSummary && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              copyToClipboard(currentSummary, "summary")
                            }
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            {copiedId === "summary" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {contentHistory.summary.length > 0 && (
                      <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("summary", "prev")}
                              disabled={currentVersions.summary === 0}
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Previous</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                          {currentVersions.summary + 1} /{" "}
                          {contentHistory.summary.length}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("summary", "next")}
                              disabled={
                                currentVersions.summary ===
                                contentHistory.summary.length - 1
                              }
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {loadingState.summary ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Generating summary...
                        </p>
                      </div>
                    </div>
                  ) : currentSummary ? (
                    <textarea
                      readOnly
                      value={currentSummary}
                      className="w-full min-h-[300px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px]">
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Content" to create summary
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quotes Card */}
              <div className="rounded-lg border border-border bg-background shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Key Quotes</h2>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => regenerate("quotes")}
                          disabled={loadingState.quotes}
                          className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 text-muted-foreground ${
                              loadingState.quotes ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Retry</p>
                      </TooltipContent>
                    </Tooltip>
                    {currentQuotes && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => copyToClipboard(mergedQuotes, "quotes")}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                          >
                            {copiedId === "quotes" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {contentHistory.quotes.length > 0 && (
                      <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("quotes", "prev")}
                              disabled={currentVersions.quotes === 0}
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Previous</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                          {currentVersions.quotes + 1} /{" "}
                          {contentHistory.quotes.length}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => changeVersion("quotes", "next")}
                              disabled={
                                currentVersions.quotes ===
                                contentHistory.quotes.length - 1
                              }
                              className="p-1 hover:bg-background rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {loadingState.quotes ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          Generating quotes...
                        </p>
                      </div>
                    </div>
                  ) : currentQuotes ? (
                    <textarea
                      readOnly
                      value={mergedQuotes}
                      className="w-full min-h-[200px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[200px]">
                      <p className="text-sm text-muted-foreground">
                        Click "Generate Content" to extract quotes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </TooltipProvider>
        )}
      </main>
    </div>
  );
}
