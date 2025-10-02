import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Test mode - set ENABLE_TEST_MODE=true in .env.local to use mock data
const TEST_MODE = process.env.ENABLE_TEST_MODE === 'true';

// Mock data for testing without API calls
const MOCK_DATA: Record<string, string | string[]> = {
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (contentType) {
        return NextResponse.json({ [contentType]: MOCK_DATA[contentType] });
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
  contentType: 'socialPosts' | 'summary' | 'quotes'
): Promise<string[] | string> {
  let prompt = '';

  switch (contentType) {
    case 'socialPosts':
      prompt = `You are a social media expert. Given the following transcript, create 3-5 engaging social media posts that can work across platforms (Twitter, LinkedIn, etc.). Include hooks, proper formatting, and relevant hashtags/emojis where appropriate.

Format your response as a JSON object with this exact structure:
{
  "socialPosts": ["post1", "post2", "post3", ...]
}

Transcript:
${transcript}

Return ONLY the JSON object, no additional text.`;
      break;

    case 'summary':
      prompt = `You are a content summarization expert. Given the following transcript, create a comprehensive summary with key takeaways in bullet-point format and actionable items. Include any timestamps if they're in the transcript.

Format your response as a JSON object with this exact structure:
{
  "summary": "## Key Takeaways\\n\\n• Point 1\\n• Point 2\\n\\n## Action Items\\n\\n1. Item 1\\n2. Item 2"
}

Transcript:
${transcript}

Return ONLY the JSON object, no additional text.`;
      break;

    case 'quotes':
      prompt = `You are a quote extraction expert. Given the following transcript, extract 3-5 of the most impactful and shareable quotes.

Format your response as a JSON object with this exact structure:
{
  "quotes": ["quote1", "quote2", "quote3", ...]
}

Transcript:
${transcript}

Return ONLY the JSON object, no additional text.`;
      break;
  }

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
