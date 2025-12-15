import { PageHeader } from '@/components/page-header';
import { AdminForm } from './admin-form';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Admin Panel"
        description="Create a new blog post."
      />
      <main className="py-8">
        <AdminForm />
      </main>
    </div>
  );
}
