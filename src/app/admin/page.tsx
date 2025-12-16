'use client';

import { PageHeader } from '@/components/page-header';
import { AdminForm } from './admin-form';
import { CertificatesManager } from './certificates/certificates-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Admin Panel"
        description="Create a new blog post or manage your certificates."
      />
      <main className="py-8">
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Create Post</TabsTrigger>
            <TabsTrigger value="certificates">Manage Certificates</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <AdminForm />
          </TabsContent>
          <TabsContent value="certificates">
            <CertificatesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
