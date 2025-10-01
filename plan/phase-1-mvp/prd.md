# Content Repurposer MVP - Phase 1 PRD

## Product Overview

A premium web application that transforms audio/video transcripts into multiple content formats using AI. This MVP validates the core value proposition: automated content repurposing.

---

## Core Problem

Content creators spend excessive time manually repurposing audio/video content into different formats for various platforms.

## Solution (MVP Scope)

A clean, premium web app that accepts a transcript (paste-only for MVP) and generates 3-5 essential content pieces using Claude AI.

---

## Target Users

- Podcasters
- YouTubers
- Content marketers
- Social media managers
- Anyone with audio/video content to repurpose

---

## MVP Features

### 1. Input Options Interface ✅
**Two visible options (showing future roadmap):**

1. **File Upload** (disabled/grayed out)
   - Shows "Coming Soon" badge
   - Signals future capability
   - Not functional in MVP

2. **Paste Transcript** (active)
   - Large textarea (~50k character limit)
   - Character count indicator
   - Helpful placeholder text
   - Clear validation states
   - Accessible and keyboard-friendly

### 2. AI Content Generation ✅
**Uses Anthropic's Claude API (better writing quality than GPT-4)**

**Generated Content Types:**
1. **Social Media Posts** (3-5 posts)
   - Platform-agnostic (works for Twitter, LinkedIn, etc.)
   - Engaging hooks
   - Proper formatting with hashtags/emojis where appropriate

2. **Summary/Show Notes**
   - Bullet-point format
   - Key takeaways
   - Timestamps (if present in transcript)
   - Actionable insights

3. **Key Quotes/Highlights**
   - 3-5 pull quotes
   - Shareable snippets
   - Most impactful moments

### 3. Results Display ✅
**Premium, card-based layout:**
- Each content type in its own card
- Copy-to-clipboard buttons with success feedback
- Proper markdown formatting
- Clear visual hierarchy
- "Start Over" button to create new content

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans + Geist Mono
- **UI Components**: Custom-built following shadcn/ui patterns
- **Icons**: Lucide Icons

### Backend
- **API Routes**: Next.js API routes
- **AI Provider**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Environment**: Edge runtime for fast response

### Storage
- **MVP**: No storage/persistence needed
- **Future**: Database for history, user accounts

---

## User Flow

```
1. Landing Page
   ↓
   [Two Options Visible]
   - File Upload (disabled, "Coming Soon")
   - Paste Transcript (active) ← User clicks this
   ↓
2. Transcript Input
   ↓
   [User pastes transcript]
   [Clicks "Generate Content" button]
   ↓
3. Loading State
   ↓
   [AI processes transcript - 10-30 seconds]
   [Shows loading spinner + progress text]
   ↓
4. Results Page
   ↓
   [3 content cards displayed]
   - Social Posts
   - Summary
   - Key Quotes
   [Each with copy button]
   ↓
5. User copies content or starts over
```

---

## Design Standards (Premium Feel)

### Visual Identity
- **Aesthetic**: Vercel/Linear-inspired minimalism
- **Typography**: Geist Sans for UI, proper hierarchy
- **Spacing**: 8px base unit, generous whitespace
- **Colors**: Neutral palette with strategic accents
- **Shadows**: Subtle (0 1px 3px rgba(0,0,0,0.1))
- **Borders**: 6-8px radius, subtle border colors
- **Animations**: 150-250ms transitions, purposeful

### Accessibility
- WCAG 2.1 AA compliant
- 4.5:1 contrast ratio minimum
- Keyboard navigation
- Focus states on all interactive elements
- Screen reader friendly

### Responsive
- Mobile-first design (375px)
- Desktop-optimized (1440px)
- Touch targets 44px minimum

---

## Out of Scope (Not for MVP)

❌ User authentication/accounts
❌ File upload functionality
❌ Transcription service integration
❌ Content history/saved projects
❌ Custom templates/prompts
❌ Brand voice training
❌ Multiple file formats
❌ RSS/YouTube integration
❌ Collaborative editing
❌ Export to multiple formats
❌ Analytics/usage tracking

---

## Success Criteria (MVP)

✅ User can paste transcript
✅ Content generation completes in <60 seconds
✅ 3 content types generated successfully
✅ Copy-to-clipboard works reliably
✅ UI feels premium and polished
✅ Works on mobile and desktop
✅ No console errors
✅ Design matches style guide standards

---

## Timeline Estimate

**Total: 8-12 hours (weekend project)**

### Development Approach: UI-First
Building the UI with dummy data first, then connecting to API later. This allows for faster iteration on design and user experience.

### Saturday (4-6 hours)
- Hour 1-2: Homepage UI with input options ✅
- Hour 2-3: Results page layout with dummy data (3 card types)
- Hour 3-4: Copy-to-clipboard functionality
- Hour 4-6: Responsive design and polish

### Sunday (4-6 hours)
- Hour 1-2: Textarea validation and character counter
- Hour 2-3: Claude API integration setup
- Hour 3-5: Connect UI to API, prompt engineering
- Hour 5-6: Testing, bug fixes, and deployment

---

## Future Enhancements (Post-MVP)

### Phase 2
- File upload with transcription (Whisper API or AssemblyAI)
- User accounts and authentication
- Content history

### Phase 3
- Custom templates
- Brand voice training
- Batch processing

### Phase 4
- Direct integrations (YouTube, RSS feeds)
- Team collaboration features
- Analytics dashboard

---

## Technical Notes

### Environment Variables Needed
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Key Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.x.x",
  "next": "15.x.x",
  "react": "19.x.x",
  "lucide-react": "^0.x.x"
}
```

### API Route Structure
```
/api/generate
  - POST endpoint
  - Accepts: { transcript: string }
  - Returns: {
      socialPosts: string[],
      summary: string,
      quotes: string[]
    }
```

---

## Competitive Advantage (Even for MVP)

1. **Premium UX**: Most competitors have cluttered, overwhelming interfaces
2. **Speed**: Simple paste → generate flow (no uploads, no waiting for transcription)
3. **Quality**: Claude's superior writing quality for content generation
4. **Design**: Professional, trustworthy aesthetic builds confidence

---

## Metrics to Track (Post-Launch)

- Transcript paste rate
- Generation completion rate
- Average transcript length
- Content copy rate (which type gets copied most)
- Time on results page
- Return user rate

---

*Last Updated: 2025-10-01*
*Status: Ready for Development*
