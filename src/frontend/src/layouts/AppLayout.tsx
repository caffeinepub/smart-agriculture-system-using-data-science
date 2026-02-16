import { Outlet } from '@tanstack/react-router';
import AppNav from '../components/AppNav';
import { Heart } from 'lucide-react';

export default function AppLayout() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'smart-agriculture'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {currentYear} Smart Agriculture System. Built with{' '}
            <Heart className="w-4 h-4 fill-green-600 text-green-600" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
