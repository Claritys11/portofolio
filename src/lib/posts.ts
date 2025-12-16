import { PlaceHolderImages } from './placeholder-images';
import type { Post, Author, Link, Category } from './types';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { getAllPostsData } from './posts-data';

const author: Author = {
  name: 'Claritys',
  description: 'Cybersecurity enthusiast & developer.',
  avatar: PlaceHolderImages.find((img) => img.id === 'avatar')!,
};

const links: Link[] = [
  { name: 'GitHub', url: 'https://github.com/Claritys11', icon: Github },
  { name: 'Instagram', url: 'https://www.instagram.com/elanggslibaw/', icon: Instagram },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
];

// This function now safely calls the server-only data fetching function.
export async function getAllPosts(): Promise<Post[]> {
  return await getAllPostsData();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.category === category);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
    const posts = await getAllPosts();
    return posts.filter(post => post.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
    const posts = await getAllPosts();
    const allTags = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}

export async function getAllCategories(): Promise<string[]> {
    const posts = await getAllPosts();
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
