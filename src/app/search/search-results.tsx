'use client';

import { useSearchParams } from 'next/navigation';
import { ArticleCard } from '@/components/article-card';
import { getAllPosts } from '@/lib/posts';
import { useMemo, useEffect, useState } from 'react';
import type { Post } from '@/lib/types';

export function SearchResults() {
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

  if (!query) {
    return <p>Start by typing in the search bar in the sidebar.</p>;
  }

  if (filteredPosts.length === 0) {
    return <p>No articles found matching your search.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
