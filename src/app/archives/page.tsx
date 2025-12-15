import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPosts } from '@/lib/posts';
import type { Post } from '@/lib/types';

const groupPostsByYearMonth = (posts: Post[]) => {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    const month = new Date(post.date).toLocaleString('default', { month: 'long' });
    const key = `${month} ${year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
};


export default function ArchivesPage() {
  const posts = getAllPosts();
  const groupedPosts = groupPostsByYearMonth(posts);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Archives"
        description="A chronological list of all articles."
      />
      <main className="py-8">
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-8">
                {Object.entries(groupedPosts).map(([group, postsInGroup]) => (
                    <div key={group}>
                    <h2 className="text-2xl font-headline font-bold mb-4 border-b pb-2">{group}</h2>
                    <ul className="space-y-3">
                        {postsInGroup.map((post) => (
                        <li key={post.slug} className="flex flex-col sm:flex-row sm:items-center justify-between">
                             <Link href={`/posts/${post.slug}`} className="text-lg hover:text-accent transition-colors">
                                {post.title}
                             </Link>
                             <span className="text-sm text-muted-foreground mt-1 sm:mt-0">
                                {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric' })}
                             </span>
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
