import { PlaceHolderImages } from './placeholder-images';
import type { Post, Author, Link, Tag, Category } from './types';
import { Github, Instagram, Linkedin } from 'lucide-react';

const author: Author = {
  name: 'Claritys',
  description: 'Cybersecurity enthusiast & developer.',
  avatar: PlaceHolderImages.find((img) => img.id === 'avatar')!,
};

const links: Link[] = [
  { name: 'GitHub', url: 'https://github.com/Claritys11', icon: Github },
  { name: 'Instagram', url: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
];

const posts: Post[] = [
  {
    slug: 'exploring-nextjs-app-router',
    title: 'Exploring the New Next.js App Router',
    description:
      'A deep dive into the new app router in Next.js 13, its features, and how it compares to the pages router.',
    date: '2023-10-26',
    category: 'Blog',
    tags: ['Web', 'National'],
    readingTime: 8,
    image: PlaceHolderImages.find((img) => img.id === 'post-1')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">Introduction</h2>
      <p class="mb-4">The Next.js App Router, introduced in version 13, is a significant evolution in how we build web applications with React. It leverages React Server Components to provide a more powerful and flexible architecture.</p>
      <h2 class="text-2xl font-bold mb-4">Key Features</h2>
      <ul class="list-disc list-inside mb-4">
        <li>Server Components by default</li>
        <li>Simplified data fetching with async/await</li>
        <li>Nested layouts and route groups</li>
        <li>Improved performance and smaller bundle sizes</li>
      </ul>
      <blockquote class="pl-4 italic border-l-4 my-4">
        "The App Router has completely changed my development workflow for the better."
      </blockquote>
      <p>This post will walk you through setting up a new project with the App Router, creating layouts, fetching data, and deploying your application.</p>
    `,
  },
  {
    slug: 'hackthebox-challenge-writeup',
    title: 'HackTheBox - "Lame" Write-up',
    description:
      'A step-by-step walkthrough of the "Lame" machine on HackTheBox, covering enumeration, exploitation, and privilege escalation.',
    date: '2023-09-15',
    category: 'Write-Up',
    tags: ['SHS', 'Crypto'],
    readingTime: 12,
    image: PlaceHolderImages.find((img) => img.id === 'post-2')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">Initial Enumeration</h2>
      <p class="mb-4">We start with an Nmap scan to identify open ports and services running on the target machine.</p>
      <pre><code class="language-bash">nmap -sC -sV 10.10.10.3</code></pre>
      <p class="mt-4">The scan reveals an open FTP port with anonymous login enabled and an SMB service.</p>
      <h2 class="text-2xl font-bold mb-4">Exploitation</h2>
      <p class="mb-4">The vsftpd version 2.3.4 has a known backdoor. We can use Metasploit to exploit this vulnerability.</p>
      <pre><code class="language-ruby">use exploit/unix/ftp/vsftpd_234_backdoor</code></pre>
      <p class="mt-4">After setting the RHOSTS, we run the exploit to gain a root shell.</p>
    `,
  },
  {
    slug: 'mastering-tailwind-css',
    title: 'Mastering Tailwind CSS for Modern UIs',
    description:
      'Learn how to leverage Tailwind CSS to build beautiful, custom user interfaces without writing a single line of custom CSS.',
    date: '2023-08-01',
    category: 'Blog',
    tags: ['Web', 'International'],
    readingTime: 15,
    image: PlaceHolderImages.find((img) => img.id === 'post-3')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">The Utility-First Approach</h2>
      <p class="mb-4">Tailwind CSS is a utility-first CSS framework. Instead of pre-styled components, it provides low-level utility classes that you can compose to build any design.</p>
      <h2 class="text-2xl font-bold mb-4">Configuration and Customization</h2>
      <p class="mb-4">The <code>tailwind.config.js</code> file is the heart of your project. Here you can customize everything from colors and fonts to breakpoints and spacing.</p>
      <p>This allows for creating a unique design system while maintaining the benefits of a utility-first workflow.</p>
    `,
  },
  {
    slug: 'picoctf-2023-crypto-challenges',
    title: 'PicoCTF 2023 - A Tour of Crypto Challenges',
    description:
      'A summary of my solutions for some of the interesting cryptography challenges from PicoCTF 2023.',
    date: '2023-07-20',
    category: 'Write-Up',
    tags: ['Crypto', 'National'],
    readingTime: 18,
    image: PlaceHolderImages.find((img) => img.id === 'post-4')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">Challenge: "Caesar Cipher 2"</h2>
      <p class="mb-4">This was a fun twist on the classic Caesar cipher. The key rotated with each character. A simple Python script was all that was needed to brute-force the initial key and decode the flag.</p>
      <h2 class="text-2xl font-bold mb-4">Challenge: "RSA Pop Quiz"</h2>
      <p class="mb-4">This challenge tested fundamental knowledge of RSA. It involved calculating the private key 'd' given 'p', 'q', and 'e'.</p>
    `,
  },
  {
    slug: 'setting-up-a-personal-blog',
    title: 'How I Built This Blog',
    description:
      'A meta-post about the technology stack and design choices behind Code Chronicles, built with Next.js and Tailwind CSS.',
    date: '2023-06-05',
    category: 'Blog',
    tags: ['Web', 'Misc'],
    readingTime: 6,
    image: PlaceHolderImages.find((img) => img.id === 'post-5')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">Technology Stack</h2>
      <ul class="list-disc list-inside mb-4">
        <li>Framework: Next.js (App Router)</li>
        <li>Styling: Tailwind CSS with shadcn/ui</li>
        <li>Language: TypeScript</li>
        <li>Deployment: Vercel</li>
      </ul>
      <h2 class="text-2xl font-bold mb-4">Design Philosophy</h2>
      <p>The goal was a clean, minimalist design with a focus on readability. The color scheme is professional, and the typography is chosen for clarity on screens.</p>
    `,
  },
  {
    slug: 'intro-to-web-security',
    title: 'An Introduction to Web Security Fundamentals',
    description: 'Covering the basics of common web vulnerabilities like XSS, CSRF, and SQL Injection, and how to prevent them.',
    date: '2023-05-12',
    category: 'Blog',
    tags: ['Web', 'SHS', 'International'],
    readingTime: 20,
    image: PlaceHolderImages.find((img) => img.id === 'post-6')!,
    content: `
      <h2 class="text-2xl font-bold mb-4">Cross-Site Scripting (XSS)</h2>
      <p class="mb-4">XSS occurs when an attacker injects malicious scripts into content that is then delivered to other users' browsers. The key to prevention is proper input validation and output encoding.</p>
      <h2 class="text-2xl font-bold mb-4">SQL Injection</h2>
      <p class="mb-4">This vulnerability allows an attacker to interfere with the queries that an application makes to its database. Using prepared statements or parameterized queries is the most effective defense.</p>
    `,
  },
];

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: Category): Post[] {
    return getAllPosts().filter(post => post.category === category);
}

export function getPostsByTag(tag: Tag): Post[] {
    return getAllPosts().filter(post => post.tags.includes(tag));
}

export function getAuthor(): Author {
  return author;
}

export function getLinks(): Link[] {
  return links;
}

export function groupPostsByYear(posts: Post[]) {
  return posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
}
