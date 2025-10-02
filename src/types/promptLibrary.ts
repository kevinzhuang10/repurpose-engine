export interface Prompt {
  promptName: string;
  prompt: string;
  sampleContent: string;
}

export interface UseCaseCategory {
  categoryName: string;
  prompts: Prompt[];
}

export interface PromptLibrary {
  name: string;
  description: string;
  useCaseCategories: UseCaseCategory[];
}
