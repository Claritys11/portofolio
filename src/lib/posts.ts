import { PlaceHolderImages } from './placeholder-images';
import type { Post, Author, Link, Category } from './types';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { getAllPostsData } from './posts-data';

const author: Author = {
  name: 'Carlotta',
  description: 'Cybersecurity enthusiast & developer.',
  avatar: PlaceHolderImages.find((img) => img.id === 'avatar')!,
};

const links: Link[] = [
  { name: 'GitHub', url: 'https://github.com/Claritys11', icon: Github },
  { name: 'Instagram', url: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
];

// This function now safely calls the server-only data fetching function.
export function getAllPosts(): Post[] {
  return getAllPostsData();
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
    return getAllPosts().filter(post => post.category === category);
}

export function getPostsByTag(tag: string): Post[] {
    return getAllPosts().filter(post => post.tags.includes(tag));
}

export function getAllTags(): string[] {
    const posts = getAllPosts();
    const allTags = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}

export function getAllCategories(): string[] {
    const posts = getAllPosts();
    const allCategories = new Set<string>();
    posts.forEach(post => {
        allCategories.add(post.category);
    });
    return Array.from(allCategories).sort();
}

export function getAuthor(): Author {
  return author;
}

export function getLinks(): Link[] {
  return links;
}

export function groupPostsByYear(posts: Post[]) {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
}
