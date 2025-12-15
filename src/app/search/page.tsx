'use client';

import { useSearchParams } from 'next/navigation';
import { ArticleCard } from '@/components/article-card';
import { PageHeader } from '@/components/page-header';
import { getAllPosts } from '@/lib/posts';
import { useMemo, useEffect, useState } from 'react';
import type { Post } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await getAllPosts();
      setAllPosts(posts);
    }
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!query) {
      return [];
    }
    return allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, allPosts]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Search Results"
        description={query ? `Found ${filteredPosts.length} results for "${query}"` : 'Please enter a search term.'}
      />
      <main className="py-8">
        {query && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
            ))}
            </div>
        ) : (
            <p>{query ? 'No articles found matching your search.' : 'Start by typing in the search bar in the sidebar.'}</p>
        )}
      </main>
    </div>
  );
}
