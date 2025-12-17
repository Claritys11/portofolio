'use client';

import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { SearchResults } from './search-results';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Search Results"
        description="Articles and content matching your search term."
      />
      <main className="py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
