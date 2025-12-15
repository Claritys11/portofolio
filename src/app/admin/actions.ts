'use server';

import { addPost, deletePost as deletePostFromDb } from '@/lib/posts';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1),
    content: z.string().min(1),
    category: z.string().min(1), // Category can be dynamic now too
    tags: z.string().optional(), // Comma-separated tags
    imageUrl: z.string().url(),
    imageHint: z.string().min(1),
});

type PostCreationData = z.infer<typeof formSchema>;

export async function createPost(data: PostCreationData) {
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error('Invalid data submitted.');
  }

  const { tags, category, ...restOfData } = validatedData.data;

  // Process tags from comma-separated string to array
  const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  const newPostData = {
    ...restOfData,
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    category: category,
    tags: tagsArray,
  };

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


export async function deletePost(slug: string) {
    const deletedPost = deletePostFromDb(slug);

    if (deletedPost) {
        // Revalidate all paths where the post might have appeared
        revalidatePath('/');
        revalidatePath('/archives');
        revalidatePath(`/posts/${slug}`);
        revalidatePath(`/category/${deletedPost.category.toLowerCase()}`);
        deletedPost.tags.forEach(tag => {
            revalidatePath(`/tag/${tag.toLowerCase()}`);
        });
        revalidatePath('/admin'); // Revalidate admin to reflect changes
    }

    return { success: !!deletedPost };
}