import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

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

    // Extract the text content from Claude's response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response');
    }

    const generatedContent = JSON.parse(jsonMatch[0]);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
