import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Tag as TagIcon, Book } from 'lucide-react';
import { DeletePostButton } from './delete-post-button';
import { cookies } from 'next/headers';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);
  const cookieStore = cookies();
  const isAdmin = cookieStore.has('admin-auth');

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader title={post.title} />
      <main className="py-8">
        <article>
          <div className="relative h-64 md:h-96 w-full mb-8">
            <Image
              src={post.image.imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
              data-ai-hint={post.image.imageHint}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <Link href={`/category/${post.category.toLowerCase()}`} className="hover:text-accent">
                {post.category}
              </Link>
            </div>
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 flex flex-wrap items-center gap-2">
            <TagIcon className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tag/${tag.toLowerCase()}`}>
                <Badge variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </article>
        {isAdmin && (
            <div className="mt-12 border-t pt-8">
                <DeletePostButton slug={post.slug} />
            </div>
        )}
      </main>
    </div>
  );
}
