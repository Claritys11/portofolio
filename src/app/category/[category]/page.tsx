import { ArticleCard } from '@/components/article-card';
import { PageHeader } from '@/components/page-header';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const allCategories = await getAllCategories();
    return allCategories.map((category) => ({
      category: category.toLowerCase(),
    }));
}

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const allCategories = await getAllCategories();
  const categoryName = allCategories.find(c => c.toLowerCase() === params.category);

  if (!categoryName) {
    notFound();
  }

  const posts = await getPostsByCategory(categoryName);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={categoryName}
        description={`Articles filed under the "${categoryName}" category.`}
      />
      <main className="py-8">
        {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
            ))}
            </div>
        ) : (
            <p>No articles found in this category.</p>
        )}
      </main>
    </div>
  );
}
