import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-4 pt-6 pb-4">
      <SidebarTrigger className="md:hidden" />
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </header>
  );
}
