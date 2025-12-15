import { ArticleCard } from '@/components/article-card';
import { PageHeader } from '@/components/page-header';
import { getPostsByTag, getAllTags } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const allTags = getAllTags();
    return allTags.map((tag) => ({
      tag: tag.toLowerCase(),
    }));
}

type TagPageProps = {
  params: {
    tag: string;
  };
};

export default function TagPage({ params }: TagPageProps) {
  const allTags = getAllTags();
  const tagName = allTags.find(t => t.toLowerCase() === params.tag);

  if (!tagName) {
    notFound();
  }

  const posts = getPostsByTag(tagName);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`#${tagName}`}
        description={`Articles tagged with "${tagName}".`}
      />
      <main className="py-8">
        {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
            ))}
            </div>
        ) : (
            <p>No articles found with this tag.</p>
        )}
      </main>
    </div>
  );
}
