'use client';

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'paste'>('paste');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Repurpose Your Content
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your audio and video transcripts into engaging social posts, summaries, and key highlights—instantly.
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
            onClick={() => setSelectedOption('paste')}
            className={`relative p-6 rounded-lg border transition-all duration-200 ${
              selectedOption === 'paste'
                ? 'border-foreground bg-background shadow-sm'
                : 'border-border bg-background hover:border-foreground/50 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                selectedOption === 'paste'
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/5 text-foreground'
              }`}>
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

        {/* Transcript Input Area - Shown when paste is selected */}
        {selectedOption === 'paste' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
              <label htmlFor="transcript" className="block text-sm font-medium mb-3">
                Your Transcript
              </label>
              <textarea
                id="transcript"
                placeholder="Paste your transcript here... Include timestamps if available for better results."
                className="w-full min-h-[300px] p-4 rounded-md border border-border bg-background text-base resize-y focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
                maxLength={50000}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Maximum 50,000 characters
                </p>
                <button
                  className="px-6 py-2.5 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
                >
                  Generate Content
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
