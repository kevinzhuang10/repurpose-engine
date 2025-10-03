import {
  MessageSquare,
  FileText,
  Quote,
  Linkedin,
  Hash,
  Youtube,
  Clock,
} from "lucide-react";

export interface ContentTypeConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  isDefault: boolean;
  outputFormat: "array" | "string"; // array for posts/quotes, string for summary
}

export const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  socialPosts: {
    id: "socialPosts",
    name: "Social Media Posts",
    description: "Engaging social media posts",
    icon: MessageSquare,
    category: "social",
    isDefault: true,
    outputFormat: "array",
  },
  summary: {
    id: "summary",
    name: "Summary & Show Notes",
    description: "Comprehensive summary with takeaways",
    icon: FileText,
    category: "content",
    isDefault: true,
    outputFormat: "string",
  },
  quotes: {
    id: "quotes",
    name: "Key Quotes",
    description: "Memorable quotes from the content",
    icon: Quote,
    category: "content",
    isDefault: true,
    outputFormat: "array",
  },
  linkedinPost: {
    id: "linkedinPost",
    name: "LinkedIn Post",
    description: "Professional post optimized for LinkedIn",
    icon: Linkedin,
    category: "social",
    isDefault: false,
    outputFormat: "string",
  },
  xThread: {
    id: "xThread",
    name: "X Thread",
    description: "Twitter/X thread with connected tweets",
    icon: Hash,
    category: "social",
    isDefault: false,
    outputFormat: "array",
  },
  threadsPost: {
    id: "threadsPost",
    name: "Threads Post",
    description: "Engaging post for Meta's Threads",
    icon: MessageSquare,
    category: "social",
    isDefault: false,
    outputFormat: "string",
  },
  titles: {
    id: "titles",
    name: "Content Titles",
    description: "5 compelling titles for your content",
    icon: FileText,
    category: "content",
    isDefault: false,
    outputFormat: "array",
  },
  youtubeDescription: {
    id: "youtubeDescription",
    name: "YouTube Description",
    description: "SEO-optimized description with timestamps",
    icon: Youtube,
    category: "content",
    isDefault: false,
    outputFormat: "string",
  },
  timestampedOverview: {
    id: "timestampedOverview",
    name: "Timestamped Overview",
    description: "Chapter markers with descriptions",
    icon: Clock,
    category: "content",
    isDefault: false,
    outputFormat: "array",
  },
  // Prompt Library - LinkedIn
  "Punchy LinkedIn Post": {
    id: "Punchy LinkedIn Post",
    name: "Punchy LinkedIn Post",
    description: "Short, impactful LinkedIn post",
    icon: Linkedin,
    category: "linkedin",
    isDefault: false,
    outputFormat: "string",
  },
  "Thought provoking LinkedIn Post": {
    id: "Thought provoking LinkedIn Post",
    name: "Thought provoking LinkedIn Post",
    description: "Deep, thought-provoking LinkedIn post",
    icon: Linkedin,
    category: "linkedin",
    isDefault: false,
    outputFormat: "string",
  },
  "LinkedIn Post with a Question": {
    id: "LinkedIn Post with a Question",
    name: "LinkedIn Post with a Question",
    description: "Engaging LinkedIn post ending with a question",
    icon: Linkedin,
    category: "linkedin",
    isDefault: false,
    outputFormat: "string",
  },
  // Prompt Library - X/Twitter
  "Punchy X Post": {
    id: "Punchy X Post",
    name: "Punchy X Post",
    description: "Short, punchy post for X/Twitter",
    icon: Hash,
    category: "twitter",
    isDefault: false,
    outputFormat: "string",
  },
  "Thought provoking X Post": {
    id: "Thought provoking X Post",
    name: "Thought provoking X Post",
    description: "Deep, thought-provoking X/Twitter post",
    icon: Hash,
    category: "twitter",
    isDefault: false,
    outputFormat: "string",
  },
  "X Post with a Question": {
    id: "X Post with a Question",
    name: "X Post with a Question",
    description: "Engaging X/Twitter post with a question",
    icon: Hash,
    category: "twitter",
    isDefault: false,
    outputFormat: "string",
  },
  // Prompt Library - YouTube
  "YouTube Description": {
    id: "YouTube Description",
    name: "YouTube Description",
    description: "Complete YouTube video description",
    icon: Youtube,
    category: "youtube",
    isDefault: false,
    outputFormat: "string",
  },
  "10 viral YouTube Titles": {
    id: "10 viral YouTube Titles",
    name: "10 viral YouTube Titles",
    description: "10 viral-worthy YouTube titles",
    icon: Youtube,
    category: "youtube",
    isDefault: false,
    outputFormat: "array",
  },
  "Timestamped Overview": {
    id: "Timestamped Overview",
    name: "Timestamped Overview",
    description: "Detailed timestamped overview",
    icon: Youtube,
    category: "youtube",
    isDefault: false,
    outputFormat: "array",
  },
  // Prompt Library - Podcast
  "Podcast Episode Summary": {
    id: "Podcast Episode Summary",
    name: "Podcast Episode Summary",
    description: "Comprehensive podcast episode summary",
    icon: FileText,
    category: "podcast",
    isDefault: false,
    outputFormat: "string",
  },
  "Podcast Episode Show Notes": {
    id: "Podcast Episode Show Notes",
    name: "Podcast Episode Show Notes",
    description: "Complete podcast show notes",
    icon: FileText,
    category: "podcast",
    isDefault: false,
    outputFormat: "string",
  },
  "Eye catching Podcast titles": {
    id: "Eye catching Podcast titles",
    name: "Eye catching Podcast titles",
    description: "10 eye-catching podcast titles",
    icon: FileText,
    category: "podcast",
    isDefault: false,
    outputFormat: "array",
  },
  // Prompt Library - Blog
  "Blog Post": {
    id: "Blog Post",
    name: "Blog Post",
    description: "Complete blog post with formatting",
    icon: FileText,
    category: "blog",
    isDefault: false,
    outputFormat: "string",
  },
  "Blog Post Titles": {
    id: "Blog Post Titles",
    name: "Blog Post Titles",
    description: "10 compelling blog post titles",
    icon: FileText,
    category: "blog",
    isDefault: false,
    outputFormat: "array",
  },
};

export const getDefaultContentTypes = (): string[] => {
  return Object.values(CONTENT_TYPES)
    .filter((type) => type.isDefault)
    .map((type) => type.id);
};

export const getAvailablePrompts = (): ContentTypeConfig[] => {
  return Object.values(CONTENT_TYPES).filter((type) => !type.isDefault);
};
