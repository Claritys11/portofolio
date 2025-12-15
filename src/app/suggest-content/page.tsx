import { PageHeader } from '@/components/page-header';
import { SuggestionForm } from './suggestion-form';
import { getAllPosts } from '@/lib/posts';

export default function SuggestContentPage() {
  const posts = getAllPosts();
  const existingArticles = posts.map(post => `- ${post.title}`).join('\n');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Suggest Content Ideas"
        description="Use AI to brainstorm new blog post ideas based on existing content and trends."
      />
      <main className="py-8">
        <SuggestionForm existingArticles={existingArticles} />
      </main>
    </div>
  );
}
