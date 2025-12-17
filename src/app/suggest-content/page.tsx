import { PageHeader } from '@/components/page-header';
import { SuggestionForm } from './suggestion-form';
import { getAllPosts } from '@/lib/posts';

export default async function SuggestContentPage() {
  const posts = await getAllPosts();
  const existingArticles = posts.map(post => `- ${post.title}`).join('\n');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Suggest Content Ideas"
        description="Use AI to brainstorm new blog post ideas based on existing content and trends. (This thing is doesn't work for now. Because I don't have API left :heartbreak:)"
      />
      <main className="py-8">
        <SuggestionForm existingArticles={existingArticles} />
      </main>
    </div>
  );
}
