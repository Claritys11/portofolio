import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAuthor } from '@/lib/posts';
import { getAllCertificates } from '@/lib/certificates';

export default function AboutPage() {
  const author = getAuthor();
  const certificates = getAllCertificates();

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

            {certificates.length > 0 && (
              <div className="mt-12">
                <h3 className="font-headline text-2xl font-semibold text-center">Certificates</h3>
                <ul className="list-none p-0 mt-4 space-y-4 text-left">
                  {certificates.map((cert, index) => (
                    <li key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-bold text-lg">{cert.title}</h4>
                      <p className="text-md text-muted-foreground">{cert.issuer} - {cert.year}</p>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          View Certificate
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
