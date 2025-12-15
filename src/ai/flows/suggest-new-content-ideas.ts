'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest new content ideas for a blog.
 *
 * It uses existing articles, browsing trends, and external content as input.
 *
 * - suggestNewContentIdeas - The main function to trigger the content suggestion flow.
 * - SuggestNewContentIdeasInput - The input type for the suggestNewContentIdeas function.
 * - SuggestNewContentIdeasOutput - The output type for the suggestNewContentIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNewContentIdeasInputSchema = z.object({
  existingArticles: z
    .array(z.string())
    .describe('List of existing articles on the blog.'),
  browsingTrends: z
    .string()
    .describe('Current browsing trends or popular topics.'),
  externalContent: z
    .string()
    .describe('External content or resources for inspiration.'),
});
export type SuggestNewContentIdeasInput = z.infer<typeof SuggestNewContentIdeasInputSchema>;

const SuggestNewContentIdeasOutputSchema = z.object({
  suggestedIdeas: z
    .array(z.string())
    .describe('List of suggested content ideas.'),
});
export type SuggestNewContentIdeasOutput = z.infer<typeof SuggestNewContentIdeasOutputSchema>;

export async function suggestNewContentIdeas(
  input: SuggestNewContentIdeasInput
): Promise<SuggestNewContentIdeasOutput> {
  return suggestNewContentIdeasFlow(input);
}

const suggestNewContentIdeasPrompt = ai.definePrompt({
  name: 'suggestNewContentIdeasPrompt',
  input: {schema: SuggestNewContentIdeasInputSchema},
  output: {schema: SuggestNewContentIdeasOutputSchema},
  prompt: `You are a content creation assistant for a personal blog. Based on the existing articles, browsing trends, and external content provided, suggest some new content ideas for the blog.

Existing Articles:
{{#each existingArticles}}- {{{this}}}
{{/each}}

Browsing Trends: {{{browsingTrends}}}

External Content: {{{externalContent}}}

Suggest some new content ideas that would be relevant and engaging for the blog's audience. Return the ideas as a list of strings.`,
});

const suggestNewContentIdeasFlow = ai.defineFlow(
  {
    name: 'suggestNewContentIdeasFlow',
    inputSchema: SuggestNewContentIdeasInputSchema,
    outputSchema: SuggestNewContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await suggestNewContentIdeasPrompt(input);
    return output!;
  }
);
