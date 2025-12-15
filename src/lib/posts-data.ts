// @ts-nocheck
'server-only';

import type { Post } from './types';
import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'src', 'data', 'blogs.json');

function readPosts(): Post[] {
  try {
    const jsonData = fs.readFileSync(postsFilePath, 'utf-8');
    const posts = JSON.parse(jsonData) as Post[];
    return posts.map(post => ({
      ...post,
      readingTime: post.readingTime || Math.ceil(post.content.split(' ').length / 200),
    }));
  } catch (error) {
    console.error('Error reading posts from blogs.json:', error);
    return [];
  }
}

function writePosts(posts: Post[]) {
  try {
    const data = JSON.stringify(posts, null, 2);
    fs.writeFileSync(postsFilePath, data, 'utf-8');
  } catch (error) {
    console.error('Error writing posts to blogs.json:', error);
  }
}

export function getAllPostsData(): Post[] {
  const posts = readPosts();
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function addPostData(post: Omit<Post, 'readingTime' | 'image'> & { imageUrl: string; imageHint: string }) {
  const posts = getAllPostsData();
  const newPost: Post = {
    ...post,
    readingTime: Math.ceil(post.content.split(' ').length / 200),
    image: {
      id: `post-${posts.length + 1}`,
      description: `Cover image for ${post.title}`,
      imageUrl: post.imageUrl,
      imageHint: post.imageHint,
    },
  };
  const updatedPosts = [newPost, ...posts];
  writePosts(updatedPosts);
  return newPost;
}

export function deletePostData(slug: string): Post | undefined {
    const posts = getAllPostsData();
    const postIndex = posts.findIndex(p => p.slug === slug);
    if (postIndex === -1) {
        return undefined;
    }
    const [deletedPost] = posts.splice(postIndex, 1);
    writePosts(posts);
    return deletedPost;
}
