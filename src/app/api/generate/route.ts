import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { PromptLibrary } from '@/types/promptLibrary';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Test mode - set ENABLE_TEST_MODE=true in .env.local to use mock data
const TEST_MODE = process.env.ENABLE_TEST_MODE === 'true';

// Load prompt library
function loadPromptLibrary(): PromptLibrary {
  const filePath = join(process.cwd(), 'public', 'prompt-library.json');
  const fileContents = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// Find prompt by name in the library
function findPromptByName(promptName: string): string | null {
  const library = loadPromptLibrary();
  for (const category of library.useCaseCategories) {
    const prompt = category.prompts.find(p => p.promptName === promptName);
    if (prompt) {
      return prompt.prompt;
    }
  }
  return null;
}

// Mock data for testing without API calls
const MOCK_DATA: Record<string, string | string[]> = {
  Overview: `## Topic & Subject
This content discusses productivity and content creation strategies, specifically focusing on the concept of content repurposing and working smarter rather than harder.

## Key Themes
1. **Efficiency over volume**: Doing less but more impactful work
2. **Content repurposing**: Maximizing value from single pieces of content
3. **Strategic workflows**: Building systems that amplify output
4. **Focus management**: Protecting attention as a scarce resource
5. **Tool optimization**: Using the right tools for automation

## Content Structure
This appears to be a short-form educational monologue or podcast segment, structured as:
- Opening hook about content creation
- Problem identification (working too hard)
- Solution framework (repurposing strategy)
- Actionable takeaway

## Tone & Style
- **Tone**: Educational yet conversational, motivational
- **Style**: Direct, no-fluff communication with practical advice
- **Approach**: Problem-solution format with clear action items

## Key Insights
- Content creation shouldn't mean starting from scratch every time
- One quality source (transcript/recording) can fuel multiple content pieces
- Working smarter means building systems, not just working harder
- The goal is sustainable content creation that doesn't lead to burnout`,
  socialPosts: [
    "🚀 Just discovered the power of content repurposing!\n\nOne transcript → Multiple formats\n✅ Social posts\n✅ Summaries\n✅ Key quotes\n\nWork smarter, not harder 💪\n\n#ContentStrategy #ProductivityHack",
    "💡 Pro tip: Every podcast, video, or meeting transcript is a goldmine of content waiting to be unleashed.\n\nStop letting valuable content sit unused!\n\n#ContentMarketing #DigitalStrategy",
    "The secret to consistent social media? Repurpose, repurpose, repurpose!\n\nTurn 1 hour of content into weeks of posts 📈\n\n#SocialMediaTips #ContentCreation"
  ],
  summary: `## Key Takeaways

• Content repurposing transforms single pieces of content into multiple formats for different platforms
• Transcripts from podcasts, videos, and meetings contain valuable material that can be reused
• Strategic repurposing increases content ROI and maintains consistent social media presence
• Automation tools make the repurposing process faster and more efficient

## Action Items

1. Identify existing long-form content (podcasts, videos, webinars) that can be repurposed
2. Create a content repurposing workflow for regular content creation
3. Use tools to automate transcript-to-content transformation
4. Schedule repurposed content across multiple platforms for maximum reach`,
  quotes: [
    "Content repurposing is the secret weapon of successful content creators.",
    "One piece of content should never have just one life.",
    "The best content strategy is working smarter, not harder."
  ],
  linkedinPost: `🚀 Mastering the Art of Content Repurposing

In today's fast-paced digital landscape, creating content from scratch for every platform is unsustainable. That's where content repurposing becomes your secret weapon.

Here's the reality:
→ One transcript can fuel weeks of content
→ Repurposing saves 70% of your content creation time
→ Multi-platform presence amplifies reach exponentially

The strategy is simple:
1. Start with high-quality long-form content
2. Break it into platform-specific formats
3. Maintain consistency while adapting tone
4. Automate where possible

Your podcast episode? That's also:
• 5 LinkedIn posts
• 10 Twitter threads
• 1 comprehensive blog
• 15 Instagram stories

Stop reinventing the wheel. Start repurposing strategically.

What's your biggest content creation challenge? Drop it in the comments 👇

#ContentStrategy #DigitalMarketing #Productivity`,
  xThread: [
    "🧵 Thread: Why content repurposing is the ultimate productivity hack for creators in 2025",
    "Most creators burn out trying to be everywhere at once. But here's the secret: you don't need more ideas. You need better systems.",
    "Take one podcast episode. That's your foundation. But it's also:\n\n→ 3-5 social posts\n→ 1 newsletter\n→ 5-10 quote graphics\n→ 1 blog post\n\nOne conversation = 20+ pieces of content 🤯",
    "The beauty? Your audience on LinkedIn isn't the same as Twitter. Different people, different contexts, different consumption patterns.\n\nRepurposing isn't lazy—it's strategic.",
    "Pro tip: Use transcripts as your starting point. They're gold mines of quotable moments, key insights, and narrative arcs already proven to resonate.\n\nTranscript → AI tools → Multi-platform content in minutes.",
    "Bottom line: Work smarter. Create once, publish everywhere. Your future self will thank you. 🙌"
  ],
  threadsPost: `Content repurposing is the cheat code most creators ignore.

Here's what I've learned after 2 years of doing this:

One good transcript gives you:
✓ 3-5 social posts
✓ 1 newsletter section
✓ Multiple quote graphics
✓ 1 full blog post

The secret? Start with conversation, not a blank page.

Record. Transcribe. Repurpose. Repeat.

It's that simple. Try it once and you'll never go back to creating from scratch.

What's stopping you from trying this?`,
  titles: [
    "The Ultimate Guide to Content Repurposing: Turn 1 Hour into 30 Days of Content",
    "Stop Creating from Scratch: The Proven System for Multiplying Your Content Output",
    "Content Repurposing Masterclass: How to Work 10x Smarter, Not Harder",
    "From One to Many: The Strategic Framework for Maximum Content ROI",
    "The Content Creator's Secret Weapon: Mastering the Art of Repurposing"
  ],
  youtubeDescription: `In this video, I break down the complete content repurposing strategy that's helped thousands of creators save time while increasing their reach.

🎯 What You'll Learn:
• The psychology behind effective repurposing
• Platform-specific adaptation strategies
• Tools and workflows that actually work
• Real examples and case studies

⏱️ Timestamps:
0:00 - Introduction
1:30 - Why repurposing matters
4:15 - The core strategy
8:45 - Tools and automation
12:20 - Platform-specific tips
16:10 - Common mistakes to avoid
19:30 - Recap and action items

📚 Resources Mentioned:
→ Transcript tools comparison guide
→ Free repurposing template
→ Content calendar template

💬 Join the conversation in the comments - what's your biggest content creation challenge?

🔔 Subscribe for weekly content strategy tips

#ContentRepurposing #ContentStrategy #ContentMarketing #DigitalMarketing #ProductivityTips`,
  timestampedOverview: [
    "0:00 - Introduction: The content creation problem",
    "1:45 - What is content repurposing and why it matters",
    "4:20 - The fundamental strategy: Create once, publish everywhere",
    "7:35 - Platform-specific adaptation techniques",
    "11:15 - Tools and automation workflows",
    "15:40 - Case study: From one podcast to 30 pieces of content",
    "19:20 - Common mistakes and how to avoid them",
    "22:50 - Action plan: Your next steps"
  ],
  // LinkedIn prompts
  "Punchy LinkedIn Post": `🎯 The productivity trap we all fall into:

We spend hours optimizing workflows, trying new apps, color-coding calendars...

But here's what actually moves the needle:

→ Doing less
→ Focusing deeper
→ Protecting your attention

Your todo list doesn't need better organization.
It needs fewer items.

What's one thing you're going to stop doing this week? 👇

#Productivity #Focus #DeepWork`,
  "Thought provoking LinkedIn Post": `Here's an uncomfortable truth about modern work:

We've become incredibly efficient at doing things that don't matter.

I see it everywhere:
• Meetings about meetings
• Reports no one reads
• Processes that create more work

The question isn't "How can I do this faster?"

It's "Should I be doing this at all?"

Efficiency is optimizing the wrong work.
Effectiveness is eliminating it entirely.

Which tasks in your day are just theater? Be honest.

#ProductivityParadox #WorkSmarter #Leadership`,
  "LinkedIn Post with a Question": `Quick question for the founders and creators here:

How do you decide what NOT to work on?

I'm curious because I find this harder than deciding what TO work on.

Every opportunity looks good on paper. Every idea seems promising.

But saying yes to everything means saying no to focus.

So what's your framework? How do you filter?

Drop your criteria below 👇 I'm taking notes.

#Entrepreneurship #Focus #PrioritizationTips`,
  // X/Twitter prompts
  "Punchy X Post": `Productivity tip that changed my life:

Treat attention like money.

You only have so much to spend each day.

Budget it. Track it. Protect it.

Game changer 💡`,
  "Thought provoking X Post": `Unpopular opinion:

Your productivity problem isn't time management.

It's decision management.

Every choice drains energy.
Every option creates friction.

Reduce decisions. Protect focus. Win.`,
  "X Post with a Question": `Be honest:

How many browser tabs do you have open right now?

If it's more than 5, you might have a focus problem 😅

What's your number? 👇`,
  // YouTube prompts
  "YouTube Description": `🎥 In this video, I'm sharing the exact productivity system that helped me 3x my output while working fewer hours.

No fluff. No theory. Just practical strategies you can implement today.

🎯 What You'll Learn:
• The "attention budget" framework
• How to eliminate 50% of your tasks without guilt
• Time blocking techniques that actually stick
• Tools I use daily (most are free)

⏱️ Timestamps:
0:00 - Why most productivity advice fails
2:15 - The attention budget concept
5:40 - Task elimination framework
9:20 - Time blocking deep dive
13:45 - My daily tools and systems
17:30 - Common mistakes to avoid
20:15 - Your action plan

📚 Resources:
→ Free productivity template (link in comments)
→ Task elimination checklist
→ Recommended tools list

💬 What's your biggest productivity challenge? Drop it in the comments and I'll try to help!

🔔 Subscribe for weekly productivity tips that actually work

#Productivity #TimeManagement #DeepWork #Focus #WorkLifeBalance`,
  "10 viral YouTube Titles": [
    "I Deleted 50% of My Todo List and Became More Productive",
    "The Productivity System That Changed My Life (Not What You Think)",
    "Stop Optimizing Your Calendar - Do This Instead",
    "I Tried Every Productivity App. Here's What Actually Works.",
    "The Uncomfortable Truth About Being Productive",
    "Why You're Busy But Not Productive (And How to Fix It)",
    "My Brutally Simple Productivity System (Step by Step)",
    "The ONE Habit That 10x'd My Focus",
    "Productive People Don't Use Todo Lists (Here's What They Do)",
    "I Quit These 5 Things and Got My Life Back"
  ],
  "Timestamped Overview": [
    "0:00 - Introduction: The productivity paradox",
    "2:15 - Problem: Why we're busy but not productive",
    "5:30 - Concept: Attention as a limited resource",
    "8:45 - Framework: Task elimination vs optimization",
    "12:20 - Strategy: Time blocking fundamentals",
    "15:40 - Tools: What I actually use daily",
    "18:30 - Mistakes: Common productivity traps to avoid",
    "21:15 - Action plan: Your next steps",
    "23:00 - Recap and final thoughts"
  ],
  // Podcast prompts
  "Podcast Episode Summary": `## Episode Summary

This episode explores the often-overlooked distinction between being busy and being productive. We dive deep into why traditional productivity advice fails and introduce the "attention budget" framework—treating your focus as a finite resource you must carefully allocate.

## Key Discussion Points

• The productivity paradox: why doing more often means achieving less
• Attention as a scarce resource that should be budgeted like money
• The power of task elimination over task optimization
• Time blocking strategies that actually work in real life
• Common productivity traps that keep us spinning our wheels

## Main Takeaways

1. **Quality over quantity**: Focusing on fewer, high-impact tasks drives better results than spreading yourself thin
2. **Attention is finite**: Treat your focus like a daily budget you can't exceed
3. **Elimination > Optimization**: Question whether tasks need to exist before trying to do them faster
4. **Protection is key**: Build systems that defend your focus from constant interruptions

## Guest Information
[Insert guest details if applicable]

## Resources Mentioned
• Productivity template
• Task elimination framework
• Recommended tools and apps`,
  "Podcast Episode Show Notes": `📋 Episode Show Notes

In this episode, we challenge conventional productivity wisdom and introduce a framework that prioritizes attention management over time management.

⏱️ Timestamps
• 0:00 - Introduction
• 3:15 - The busy vs productive distinction
• 8:30 - Introducing the attention budget
• 15:45 - Task elimination strategies
• 23:20 - Time blocking deep dive
• 31:40 - Tools and systems
• 38:15 - Q&A and listener questions
• 45:30 - Closing thoughts

🎯 Key Topics
→ Attention budget framework
→ Task elimination vs optimization
→ Time blocking strategies
→ Productivity tool recommendations
→ Common mistakes and how to avoid them

📚 Resources
→ Free productivity template: [link]
→ Task elimination checklist: [link]
→ Recommended tools list: [link]

💬 Guest: [Name and bio if applicable]

🔗 Connect
→ Subscribe: [link]
→ Follow on social: [links]
→ Join the community: [link]

📩 Got questions? Email us at: [email]

#Productivity #Podcast #TimeManagement`,
  "Eye catching Podcast titles": [
    "The Productivity Lie: Why Doing Less Achieves More",
    "Your Attention is Bleeding (And How to Stop It)",
    "Delete Your Todo List: A Radical Productivity Experiment",
    "The Focus Economy: Treating Attention Like Money",
    "Busy is Broken: Rethinking Modern Productivity",
    "The Elimination Method: Productive by Subtraction",
    "Protect Your Focus Like Your Life Depends On It",
    "Beyond Time Management: The Attention Revolution",
    "Stop Optimizing Everything (Do This Instead)",
    "The Uncomfortable Truth About Getting Things Done"
  ],
  // Blog prompts
  "Blog Post": `# The Productivity Trap: Why Doing Less Might Be Your Best Strategy

## Introduction

We've all been there. Color-coded calendars. Perfectly organized task lists. The latest productivity app promising to revolutionize our workflow. Yet somehow, we still feel overwhelmed, stretched thin, and no closer to our goals.

What if the problem isn't that we need better systems? What if we're optimizing the wrong things entirely?

## The Busy-Productive Paradox

Modern work culture has conflated being busy with being productive. We wear our packed calendars like badges of honor, measuring our worth by how many meetings we attend and tasks we check off.

But here's the uncomfortable truth: **efficiency is meaningless if you're efficient at the wrong things.**

## Introducing the Attention Budget

Think about your attention the way you think about money. You wake up each day with a fixed amount. Every task, every decision, every notification spends from that account.

The question isn't "How can I do more?"

It's "What deserves my limited attention?"

### The Framework

1. **Track your spending**: Where does your attention actually go?
2. **Identify waste**: What tasks exist purely out of habit or obligation?
3. **Ruthlessly cut**: Eliminate before you optimize
4. **Protect what matters**: Build systems that defend your focus

## Task Elimination vs. Task Optimization

We've been taught to optimize. Find shortcuts. Work faster. But optimization assumes the task should exist in the first place.

**The better question**: Should I be doing this at all?

### The Elimination Test

Before adding anything to your plate, ask:
- What happens if I don't do this?
- Who actually benefits from this?
- Does this move me toward my goals?
- Am I doing this out of obligation or impact?

If you can't clearly articulate the value, it probably doesn't belong on your list.

## Time Blocking That Actually Works

Time blocking fails for most people because they try to block every minute. Life doesn't work that way.

Instead:
- **Block 2-3 hours** for deep work daily (non-negotiable)
- **Leave buffer space** for the unexpected
- **Batch similar tasks** to reduce context switching
- **Protect your blocks** like you'd protect a client meeting

## Common Productivity Traps

### Trap #1: Tool Hopping
Switching apps won't solve a strategy problem.

### Trap #2: Over-Planning
Spending more time organizing tasks than doing them.

### Trap #3: Meeting Culture
Defaulting to meetings when async communication would work.

### Trap #4: The Urgency Addiction
Prioritizing what's urgent over what's important.

## Conclusion

Productivity isn't about doing more. It's about doing what matters.

Your attention is finite. Your time is limited. Your energy is precious.

Stop trying to fit more into your day. Start questioning what deserves to be there in the first place.

The path to getting more done isn't addition. It's subtraction.

---

*What's one thing you're going to eliminate this week? I'd love to hear in the comments below.*`,
  "Blog Post Titles": [
    "The Productivity Trap: Why Doing Less Achieves More",
    "Your Attention is a Budget. Here's How to Spend It Wisely.",
    "Stop Optimizing Your Todo List (Do This Instead)",
    "The Elimination Method: Getting Productive by Subtraction",
    "Why Busy People Aren't Productive People (And How to Fix It)",
    "The Focus Economy: Treating Attention Like Your Most Valuable Asset",
    "Task Management is Dead. Long Live Task Elimination.",
    "The Uncomfortable Truth About Modern Productivity",
    "Beyond Time Blocking: A Better Framework for Deep Work",
    "How to Get More Done by Doing Less (No, Really)"
  ]
};

export async function POST(request: Request) {
  try {
    const { transcript, contentType } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Use mock data in test mode
    if (TEST_MODE) {
      console.log('⚠️ TEST MODE: Using mock data instead of API call');
      console.log('  Requested contentType:', contentType);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (contentType) {
        const mockContent = MOCK_DATA[contentType];
        if (mockContent === undefined) {
          console.warn(`⚠️  No mock data found for contentType: "${contentType}"`);
          console.warn('  Available keys:', Object.keys(MOCK_DATA));
        }
        return NextResponse.json({ [contentType]: mockContent });
      } else {
        return NextResponse.json(MOCK_DATA);
      }
    }

    // Generate all content types or just one specific type
    if (contentType) {
      // Generate specific content type
      const content = await generateSpecificContent(transcript, contentType);
      return NextResponse.json({ [contentType]: content });
    } else {
      // Generate all content types (legacy support)
      const allContent = await generateAllContent(transcript);
      return NextResponse.json(allContent);
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

async function generateSpecificContent(
  transcript: string,
  contentType: string
): Promise<string[] | string> {
  // Try to find prompt in library
  const libraryPrompt = findPromptByName(contentType);

  if (!libraryPrompt) {
    throw new Error(`Unknown content type: ${contentType}`);
  }

  const fullPrompt = `${libraryPrompt}

Transcript:
${transcript}

Return ONLY the JSON object with this structure: { "${contentType}": <your_content> }
If the content should be an array (like multiple posts or quotes), use an array.
If it should be a single text (like a summary or overview), use a string.
No additional text outside the JSON.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: fullPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  const parsedContent = JSON.parse(jsonMatch[0]);
  return parsedContent[contentType];
}

async function generateAllContent(transcript: string) {
  const prompt = `You are a content repurposing expert. Given the following transcript, create three types of content:

1. **Social Media Posts**: Create 3-5 engaging social media posts that can work across platforms (Twitter, LinkedIn, etc.). Include hooks, proper formatting, and relevant hashtags/emojis where appropriate.

2. **Summary/Show Notes**: Create a comprehensive summary with key takeaways in bullet-point format and actionable items. Include any timestamps if they're in the transcript.

3. **Key Quotes**: Extract 3-5 of the most impactful and shareable quotes from the transcript.

Format your response as a JSON object with this exact structure:
{
  "socialPosts": ["post1", "post2", "post3", ...],
  "summary": "## Key Takeaways\\n\\n• Point 1\\n• Point 2\\n\\n## Action Items\\n\\n1. Item 1\\n2. Item 2",
  "quotes": ["quote1", "quote2", "quote3", ...]
}

Transcript:
${transcript}

Return ONLY the JSON object, no additional text.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]);
}
