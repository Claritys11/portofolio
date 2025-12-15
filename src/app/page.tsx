import { ArticleCard } from '@/components/article-card';
import { PageHeader } from '@/components/page-header';
import { getAllPosts } from '@/lib/posts';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Code Chronicles"
        description="A personal blog for articles, CTF write-ups, and everything in between."
      />
      <main className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
