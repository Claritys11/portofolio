import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAuthor } from '@/lib/posts';

export default function AboutPage() {
  const author = getAuthor();
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="About Me"
        description="A little bit about the person behind the chronicles."
      />
      <main className="py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage
                  src={author.avatar.imageUrl}
                  alt={author.name}
                  data-ai-hint={author.avatar.imageHint}
                />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-headline">{author.name}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none mx-auto text-center">
            <p>
              Hello! I'm a passionate developer and cybersecurity enthusiast with a love for learning and sharing knowledge. This blog is my personal space to document my journey, share insights from Capture The Flag (CTF) competitions, and explore various topics in technology.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                <div>
                    <h3 className="font-headline text-xl font-semibold">My Skills</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Web Development (React, Next.js, Node.js)</li>
                        <li>Cybersecurity (Penetration Testing, Cryptography)</li>
                        <li>Database Management (MongoDB, SQL)</li>
                        <li>Cloud & DevOps (Docker, CI/CD)</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-headline text-xl font-semibold">Experience</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Participant in National & International CTFs</li>
                        <li>Building full-stack applications for fun and profit</li>
                        <li>Contributing to open-source projects</li>
                    </ul>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
