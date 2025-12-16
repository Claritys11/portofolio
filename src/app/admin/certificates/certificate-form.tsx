'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Certificate } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  issuer: z.string().min(1, 'Issuer is required.'),
  year: z.string().min(4, 'Year is required.'),
  url: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type CertificateFormValues = z.infer<typeof formSchema>;

interface CertificateFormProps {
    certificate?: Certificate;
    onSave: (values: CertificateFormValues) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export function CertificateForm({ certificate, onSave, onDelete }: CertificateFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: certificate || {
      title: '',
      issuer: '',
      year: '',
      url: '',
    },
  });

  async function onSubmit(values: CertificateFormValues) {
    setLoading(true);
    try {
      await onSave(values);
      toast({
        title: 'Success!',
        description: `Certificate ${certificate ? 'updated' : 'created'} successfully.`,
      });
      router.refresh();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `An error occurred: ${errorMessage}`,
        });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
      toast({
        title: 'Success!',
        description: 'Certificate deleted successfully.',
      });
      router.refresh();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `An error occurred: ${errorMessage}`,
        });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{certificate ? 'Edit Certificate' : 'Create New Certificate'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Certified Kubernetes Administrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Linux Foundation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.credly.com/your-badge-url" {...field} />
                  </FormControl>
                   <FormDescription>
                    Optional: A link to your certificate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {certificate ? 'Save Changes' : 'Create Certificate'}
                </Button>
                {certificate && onDelete && (
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
