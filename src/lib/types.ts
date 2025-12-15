import type { ImagePlaceholder } from './placeholder-images';

export type Tag = string;
export type Category = string;

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format: "YYYY-MM-DD"
  category: Category;
  tags: Tag[];
  readingTime: number; // in minutes
  image: ImagePlaceholder;
  content: string; // pre-formatted HTML/JSX content
};

export type Author = {
  name: string;
  description: string;
  avatar: ImagePlaceholder;
};

export type Link = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};
