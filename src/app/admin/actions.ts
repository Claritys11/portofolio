'use server';

import { addPost } from '@/lib/posts';
import { allCategories, allTags } from '@/lib/types';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1),
    content: z.string().min(1),
    category: z.enum(allCategories),
    tags: z.array(z.enum(allTags)),
    imageUrl: z.string().url(),
    imageHint: z.string().min(1),
});

type PostCreationData = z.infer<typeof formSchema>;

export async function createPost(data: PostCreationData) {
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error('Invalid data submitted.');
  }

  const newPostData = {
    ...validatedData.data,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };

  // In a real app, you'd save this to a database.
  // Here, we'll just log it and imagine it's saved.
  // The 'addPost' function is a mock.
  const newPost = addPost(newPostData);
  
  // Revalidate paths to show the new post
  revalidatePath('/');
  revalidatePath('/archives');
  revalidatePath(`/posts/${newPost.slug}`);
  revalidatePath(`/category/${newPost.category.toLowerCase()}`);
  newPost.tags.forEach(tag => {
    revalidatePath(`/tag/${tag.toLowerCase()}`);
  });

  return newPost;
}
