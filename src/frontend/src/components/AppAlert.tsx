import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AppAlertProps {
  type?: 'error' | 'success' | 'info';
  title?: string;
  message: string;
  className?: string;
}

export default function AppAlert({ type = 'error', title, message, className = '' }: AppAlertProps) {
  const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <Alert variant={type === 'error' ? 'destructive' : 'default'} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
