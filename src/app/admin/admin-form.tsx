'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAllCategories } from '@/lib/posts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPost } from './actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  description: z.string().min(1, 'Description is required.'),
  content: z.string().min(1, 'Content is required.'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  imageHint: z.string().min(1, 'Image hint is required.'),
});

type AdminFormValues = z.infer<typeof formSchema>;

export function AdminForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const categories = await getAllCategories();
      setAllCategories(categories);
    }
    fetchCategories();
  }, []);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      category: 'Blog',
      tags: '',
      imageUrl: '',
      imageHint: '',
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    form.setValue('title', title);
    form.setValue('slug', slug);
  };
  
  async function onSubmit(values: AdminFormValues) {
    setLoading(true);
    setUploadError(null);

    let imageUrl = values.imageUrl;

    if (imageSource === 'upload' && file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadUrl = new URL('/api/upload', window.location.origin);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        const responseText = await response.text();
        console.log('Server response text:', responseText);

        if (!response.ok) {
            console.error('Server response was not ok:', responseText);
            try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.error || 'Image upload failed');
            } catch (e) {
                throw new Error(`Server returned a non-JSON error response: ${response.status} ${response.statusText}`);
            }
        }
        
        try {
            const { url } = JSON.parse(responseText);
            imageUrl = url;
        } catch (error) {
            throw new Error('Failed to parse JSON response from server.');
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setUploadError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `An error occurred while uploading the image: ${errorMessage}`,
        });
        setLoading(false);
        return;
      }
    }

    const dataToSubmit = { ...values, imageUrl };
    console.log('Submitting data:', dataToSubmit);

    try {
      const newPost = await createPost(dataToSubmit);
      toast({
        title: 'Success!',
        description: 'Your new blog post has been created.',
      });
      router.push(`/posts/${newPost.slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `An error occurred while creating the post: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        {uploadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Upload Error: </strong>
                <span className="block sm:inline">{uploadError}</span>
            </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your amazing post title" {...field} onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e);
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="your-amazing-post-title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the URL-friendly version of the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short and engaging description of your post."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here. You can use HTML."
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can use raw HTML for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <Input placeholder="Web, SHS, International" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter tags separated by commas.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormItem>
              <FormLabel>Image</FormLabel>
              <RadioGroup
                defaultValue="url"
                onValueChange={(value: 'url' | 'upload') => setImageSource(value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url">URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload</Label>
                </div>
              </RadioGroup>
            </FormItem>

            {imageSource === 'url' && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL for the post's cover image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {imageSource === 'upload' && (
              <FormItem>
                <FormLabel>Image Upload</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for the post's cover.
                </FormDescription>
              </FormItem>
            )}
            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 'cyber security'" {...field} />
                  </FormControl>
                  <FormDescription>
                    One or two keywords describing the image for AI assistance.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Post
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
