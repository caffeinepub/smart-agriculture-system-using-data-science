import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, Leaf, Droplets, BarChart3, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const modules = [
    {
      title: 'Crop Yield Prediction',
      description: 'Predict crop yield based on soil, weather, and fertilizer data',
      icon: Sprout,
      path: '/crop-yield',
      color: 'text-green-600',
    },
    {
      title: 'Plant Disease Detection',
      description: 'Detect plant diseases from leaf images using AI',
      icon: Leaf,
      path: '/disease-detection',
      color: 'text-emerald-600',
    },
    {
      title: 'Smart Irrigation',
      description: 'Get irrigation recommendations based on soil and weather conditions',
      icon: Droplets,
      path: '/irrigation',
      color: 'text-blue-600',
    },
    {
      title: 'Analytics Dashboard',
      description: 'View insights and trends from your agricultural data',
      icon: BarChart3,
      path: '/visualizations',
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
        <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Smart Agriculture System
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Harness the power of data science to optimize your farming operations. Predict yields,
              detect diseases, and make informed irrigation decisions.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link to="/crop-yield">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/visualizations">View Analytics</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/assets/generated/dashboard-hero.dim_1600x600.png"
              alt="Smart Agriculture"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.path} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-primary/10 ${module.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={module.path} className="gap-2">
                      Open
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
