import { Link, useRouterState } from '@tanstack/react-router';
import { Sprout, BarChart3, Leaf, Droplets, Home } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AppNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { identity } = useInternetIdentity();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/crop-yield', label: 'Crop Yield', icon: Sprout },
    { path: '/disease-detection', label: 'Disease Detection', icon: Leaf },
    { path: '/irrigation', label: 'Irrigation', icon: Droplets },
    { path: '/visualizations', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <img
                src="/assets/generated/smart-agri-logo.dim_512x512.png"
                alt="Smart Agriculture"
                className="w-8 h-8"
              />
              <span className="hidden sm:inline text-foreground">Smart Agriculture</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {identity && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Signed In</span>
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
