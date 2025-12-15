import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { Calendar, Clock } from 'lucide-react';

type ArticleCardProps = {
  post: Post;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={post.image.imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={post.image.imageHint}
            />
             <Badge variant="secondary" className="absolute top-2 right-2">{post.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow pt-6">
          <CardTitle className="text-xl font-headline group-hover:text-accent transition-colors">
            {post.title}
          </CardTitle>
          <CardDescription className="mt-2 line-clamp-3">
            {post.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
             <Calendar className="w-3 h-3" />
             <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            <span>{post.readingTime} min read</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
