'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Archive,
  Book,
  FileText,
  Home,
  Link2,
  PenSquare,
  Search,
  Tag,
  User,
  ShieldCheck,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAuthor, getLinks, getAllTags, getAllCategories } from '@/lib/posts';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useEffect, useState, Suspense } from 'react';
import { SearchInput } from './search-input';

const NavItem = ({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={href}>
          {icon}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const author = getAuthor();
  const socialLinks = getLinks();
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      const [tags, categories] = await Promise.all([
        getAllTags(),
        getAllCategories(),
      ]);
      setAllTags(tags);
      setAllCategories(categories);
    }
    fetchData();
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="items-center text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={author.avatar.imageUrl}
            alt={author.name}
            data-ai-hint={author.avatar.imageHint}
          />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-headline font-semibold">
            {author.name}
          </h2>
          <p className="text-xs text-sidebar-foreground/80">
            {author.description}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchInput />
        </Suspense>
        <SidebarMenu>
          <NavItem href="/" icon={<Home />}>
            Home
          </NavItem>
          <NavItem href="/about" icon={<User />}>
            About
          </NavItem>
          <NavItem href="/archives" icon={<Archive />}>
            Archives
          </NavItem>

          <SidebarMenuItem>
            <SidebarMenuButton>
              <Book />
              <span>Categories</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {allCategories.map((category) => (
                <SidebarMenuSubItem key={category}>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith(`/category/${category.toLowerCase()}`)}>
                    <Link href={`/category/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Tag />
              <span>Tags</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {allTags.map((tag) => (
                <SidebarMenuSubItem key={tag}>
                  <SidebarMenuSubButton asChild isActive={pathname.startsWith(`/tag/${tag.toLowerCase()}`)}>
                    <Link href={`/tag/${tag.toLowerCase()}`}>
                      {tag}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
           <SidebarSeparator />
          <NavItem href="/suggest-content" icon={<PenSquare />}>
            Suggest Content
          </NavItem>
          <NavItem href="/admin" icon={<ShieldCheck />}>
            Admin
          </NavItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
               <Button variant="ghost" size="icon" aria-label={link.name}>
                  <link.icon className="h-4 w-4" />
               </Button>
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
