"use client";

import {
  Copy,
  Check,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTENT_TYPES } from "@/config/contentTypes";

interface ContentCardProps {
  contentTypeId: string;
  content: string[] | string | null;
  isLoading: boolean;
  currentVersion: number;
  totalVersions: number;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onRegenerate: () => void;
  onVersionChange: (direction: "prev" | "next") => void;
  onViewPromptSettings: () => void;
}

export function ContentCard({
  contentTypeId,
  content,
  isLoading,
  currentVersion,
  totalVersions,
  copiedId,
  onCopy,
  onRegenerate,
  onVersionChange,
  onViewPromptSettings,
}: ContentCardProps) {
  const contentType = CONTENT_TYPES[contentTypeId];

  if (!contentType) return null;

  // Format content for display
  const displayContent = content
    ? Array.isArray(content)
      ? content.map((item, i) => `${i + 1}. "${item}"`).join("\n\n")
      : content
    : "";

  return (
    <div className="rounded-lg border border-border bg-background shadow-sm">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">{contentType.name}</h2>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRegenerate}
                disabled={isLoading}
                className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 text-muted-foreground ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Retry</p>
            </TooltipContent>
          </Tooltip>
          {content && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onCopy(displayContent, contentTypeId)}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                >
                  {copiedId === contentTypeId ? (
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onViewPromptSettings}
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View prompt settings</p>
            </TooltipContent>
          </Tooltip>
          {totalVersions > 0 && (
            <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onVersionChange("prev")}
                    disabled={currentVersion === 0}
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
                {currentVersion + 1} / {totalVersions}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onVersionChange("next")}
                    disabled={currentVersion === totalVersions - 1}
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
      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Generating...</p>
            </div>
          </div>
        ) : content ? (
          <textarea
            readOnly
            value={displayContent}
            className="w-full min-h-[300px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
          />
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-sm text-muted-foreground">
              Click "Generate Content" to create{" "}
              {contentType.name.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
