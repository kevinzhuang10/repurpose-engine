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
};

export const getDefaultContentTypes = (): string[] => {
  return Object.values(CONTENT_TYPES)
    .filter((type) => type.isDefault)
    .map((type) => type.id);
};

export const getAvailablePrompts = (): ContentTypeConfig[] => {
  return Object.values(CONTENT_TYPES).filter((type) => !type.isDefault);
};
