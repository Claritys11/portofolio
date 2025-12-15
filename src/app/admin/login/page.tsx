'use client';

import { useActionState } from 'react';
import { login } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader title="Admin Access" />
      <main className="py-8 flex justify-center">
        <div className="w-full max-w-md">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">What would people not know about me?</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
