'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { Search } from 'lucide-react';
import { SidebarInput } from '@/components/ui/sidebar';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative m-2">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <SidebarInput
        name="search"
        placeholder="Search articles..."
        className="pl-9"
        defaultValue={searchParams.get('q') || ''}
      />
    </form>
  );
}
