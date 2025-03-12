import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReactNode } from 'react';

interface ErrorMessageProps {
  children: ReactNode;
}

const AlertMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atenção!</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
