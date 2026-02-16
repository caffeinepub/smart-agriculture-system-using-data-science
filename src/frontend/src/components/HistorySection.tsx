import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import AuthGate from './AuthGate';

interface HistorySectionProps {
  title: string;
  description: string;
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  onClear: () => void;
  isClearing: boolean;
  emptyMessage: string;
}

export default function HistorySection({
  title,
  description,
  items,
  renderItem,
  onClear,
  isClearing,
  emptyMessage,
}: HistorySectionProps) {
  return (
    <AuthGate
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>Sign in to view your history</CardDescription>
          </CardHeader>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                disabled={isClearing}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AuthGate>
  );
}
