import React, { ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  children: ReactNode;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className }) => {
  return (
    <div className={cn('ml-3 flex gap-1 items-center mt-2', className)}>
      <TriangleAlert className="w-5 h-5 text-red-600" />
      <p className="text-sm text-red-600">{children}</p>
    </div>
  );
};

export default ErrorMessage;
