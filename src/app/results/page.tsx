'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dummy data for UI development - multiple versions per content type
const DUMMY_DATA = {
  socialPosts: [
    [
      "🎯 Just learned the most important lesson about productivity: It's not about doing more, it's about doing what matters.\n\nStop optimizing your todo list. Start questioning if the tasks even belong there.\n\n#productivity #focus",

      "The secret to staying focused in a distracted world?\n\nTreat attention like a budget. You only have so much to spend each day.\n\nSpend it wisely. 💡\n\n#mindfulness #deepwork",

      "Your calendar should reflect your priorities, not other people's emergencies.\n\nBlock time for what matters. Protect it fiercely.\n\nEverything else can wait. ⏰"
    ],
    // Version 2
    [
      "💡 Productivity hack: Do less, achieve more.\n\nQuality over quantity every single time.\n\n#productivity #minimalism",

      "Focus is a superpower in 2025.\n\nProtect yours like it's your most valuable asset. Because it is.\n\n#focus #deepwork",

      "Time blocking changed my life.\n\nDefend your calendar. Your future self will thank you. 🙏\n\n#timemanagement"
    ]
  ],

  summary: [
    `## Key Takeaways

• **Productivity isn't about volume** - Focus on high-impact work rather than checking off endless tasks
• **Attention is a limited resource** - Treat it like a daily budget you must allocate carefully
• **Calendar blocking works** - Protect time for priorities before letting others claim your schedule
• **Eliminate the non-essential** - Question whether tasks deserve your time before adding them
• **Deep work requires boundaries** - Create systems that defend your focus from constant interruptions

## Action Items

1. Review your current task list and eliminate 50% of items
2. Block 2-3 hours daily for deep, focused work
3. Set up notification boundaries during focus time
4. Practice saying no to non-essential requests`,
    // Version 2
    `## Key Takeaways

• **Less is more** - Eliminate low-value tasks to focus on what drives results
• **Protect your attention** - Your focus is limited, spend it on what matters most
• **Block your time** - Schedule priorities first, everything else fits around them
• **Say no often** - Every yes to something unimportant is a no to something important

## Action Items

1. Audit your current commitments and cut 30%
2. Create 3-hour deep work blocks daily
3. Turn off notifications during focus time
4. Practice strategic no's to non-essential requests`
  ],

  quotes: [
    [
      "It's not about doing more, it's about doing what matters.",
      "Treat attention like a budget. You only have so much to spend each day.",
      "Your calendar should reflect your priorities, not other people's emergencies.",
      "Stop optimizing your todo list. Start questioning if the tasks even belong there."
    ],
    // Version 2
    [
      "Quality always beats quantity in meaningful work.",
      "Focus is the currency of achievement.",
      "Protect your time or others will spend it for you.",
      "The best productivity system is doing less, better."
    ]
  ]
};

interface GeneratedContent {
  socialPosts: string[];
  summary: string;
  quotes: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentVersions, setCurrentVersions] = useState({
    socialPosts: 0,
    summary: 0,
    quotes: 0
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentHistory, setContentHistory] = useState<{
    socialPosts: string[][];
    summary: string[];
    quotes: string[][];
  }>({
    socialPosts: [],
    summary: [],
    quotes: []
  });

  useEffect(() => {
    // Load generated content from sessionStorage
    const storedContent = sessionStorage.getItem('generatedContent');
    if (storedContent) {
      const content = JSON.parse(storedContent) as GeneratedContent;
      setGeneratedContent(content);

      // Initialize history with the first version
      setContentHistory({
        socialPosts: [content.socialPosts],
        summary: [content.summary],
        quotes: [content.quotes]
      });
    } else {
      // If no content, redirect to home
      router.push('/');
    }
  }, [router]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const regenerate = async (type: 'socialPosts' | 'summary' | 'quotes') => {
    // TODO: In future, this will trigger API call to regenerate specific content type
    console.log(`Regenerating ${type}...`);
  };

  const changeVersion = (type: 'socialPosts' | 'summary' | 'quotes', direction: 'prev' | 'next') => {
    const maxVersions = contentHistory[type].length;
    setCurrentVersions(prev => ({
      ...prev,
      [type]: direction === 'next'
        ? (prev[type] + 1) % maxVersions
        : (prev[type] - 1 + maxVersions) % maxVersions
    }));
  };

  // Use real data if available, otherwise fall back to dummy data
  const currentSocialPosts = contentHistory.socialPosts.length > 0
    ? contentHistory.socialPosts[currentVersions.socialPosts]
    : DUMMY_DATA.socialPosts[currentVersions.socialPosts];

  const currentSummary = contentHistory.summary.length > 0
    ? contentHistory.summary[currentVersions.summary]
    : DUMMY_DATA.summary[currentVersions.summary];

  const currentQuotes = contentHistory.quotes.length > 0
    ? contentHistory.quotes[currentVersions.quotes]
    : DUMMY_DATA.quotes[currentVersions.quotes];

  // Merge social posts into single text area
  const mergedSocialPosts = Array.isArray(currentSocialPosts)
    ? currentSocialPosts.join('\n\n---\n\n')
    : '';
  const mergedQuotes = Array.isArray(currentQuotes)
    ? currentQuotes.map((q, i) => `${i + 1}. "${q}"`).join('\n\n')
    : '';

  // Show loading state while data is being loaded
  if (!generatedContent && contentHistory.socialPosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to input
          </Link>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
            Your Content is Ready
          </h1>
          <p className="text-muted-foreground">
            Copy and use these across your platforms
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 mb-8">
          {/* Social Posts Card */}
          <div className="rounded-lg border border-border bg-background shadow-sm">
            {/* Header with controls */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Social Media Posts</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => regenerate('socialPosts')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => copyToClipboard(mergedSocialPosts, 'social')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Copy all"
                >
                  {copiedId === 'social' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                  <button
                    onClick={() => changeVersion('socialPosts', 'prev')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Previous version"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                    {currentVersions.socialPosts + 1} / {contentHistory.socialPosts.length || 1}
                  </span>
                  <button
                    onClick={() => changeVersion('socialPosts', 'next')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Next version"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              <textarea
                readOnly
                value={mergedSocialPosts}
                className="w-full min-h-[300px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="rounded-lg border border-border bg-background shadow-sm">
            {/* Header with controls */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Summary & Show Notes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => regenerate('summary')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => copyToClipboard(currentSummary, 'summary')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Copy"
                >
                  {copiedId === 'summary' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                  <button
                    onClick={() => changeVersion('summary', 'prev')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Previous version"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                    {currentVersions.summary + 1} / {contentHistory.summary.length || 1}
                  </span>
                  <button
                    onClick={() => changeVersion('summary', 'next')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Next version"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              <textarea
                readOnly
                value={currentSummary}
                className="w-full min-h-[300px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
              />
            </div>
          </div>

          {/* Quotes Card */}
          <div className="rounded-lg border border-border bg-background shadow-sm">
            {/* Header with controls */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Key Quotes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => regenerate('quotes')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => copyToClipboard(mergedQuotes, 'quotes')}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Copy all"
                >
                  {copiedId === 'quotes' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded-md bg-muted/50">
                  <button
                    onClick={() => changeVersion('quotes', 'prev')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Previous version"
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                    {currentVersions.quotes + 1} / {contentHistory.quotes.length || 1}
                  </span>
                  <button
                    onClick={() => changeVersion('quotes', 'next')}
                    className="p-1 hover:bg-background rounded transition-colors"
                    title="Next version"
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              <textarea
                readOnly
                value={mergedQuotes}
                className="w-full min-h-[200px] p-4 bg-transparent text-sm resize-y font-sans focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-all duration-150"
          >
            Start Over
          </Link>
        </div>
      </div>
    </div>
  );
}
