'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestNewContentIdeas } from '@/ai/flows/suggest-new-content-ideas';

const formSchema = z.object({
  existingArticles: z.string().min(1, 'Please provide some existing articles.'),
  browsingTrends: z.string().min(1, 'Please provide some browsing trends.'),
  externalContent: z.string().min(1, 'Please provide some external content for inspiration.'),
});

type SuggestionFormValues = z.infer<typeof formSchema>;

type SuggestionFormProps = {
  existingArticles: string;
};

export function SuggestionForm({ existingArticles }: SuggestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      existingArticles: existingArticles,
      browsingTrends: '',
      externalContent: '',
    },
  });

  async function onSubmit(values: SuggestionFormValues) {
    setLoading(true);
    setSuggestions([]);
    try {
        const result = await suggestNewContentIdeas({
            ...values,
            existingArticles: values.existingArticles.split('\n').filter(Boolean),
        });
        if (result && result.suggestedIdeas) {
            setSuggestions(result.suggestedIdeas);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to get suggestions. The AI returned an empty response.',
            });
        }
    } catch (error) {
        console.error('Error suggesting content:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'An error occurred while generating content ideas. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="existingArticles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Articles</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List of existing articles on the blog."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A list of your current blog post titles. This is pre-filled for you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="browsingTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Browsing Trends</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Latest cybersecurity exploits', 'React 19 new features', 'AI in web development'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Current popular topics or keywords you want to explore.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Content / Inspiration</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., URLs to interesting articles, titles of conference talks, summaries of recent news"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide links, titles, or summaries of external content for inspiration.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || suggestions.length > 0) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Suggested Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Generating ideas...</p>
              </div>
            ) : (
              <ul className="space-y-2 list-disc pl-5">
                {suggestions.map((idea, index) => (
                  <li key={index} className="text-foreground/90">{idea}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
