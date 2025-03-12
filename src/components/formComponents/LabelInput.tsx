import React, { useState, useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../ui/tooltip';

interface LabelWithAsteriskProps {
  htmlFor: string;
  text: string;
  isRequired?: boolean;
  [key: string]: any;
}

const LabelInput: React.FC<LabelWithAsteriskProps> = ({
  htmlFor,
  text,
  isRequired = false,
  ...props
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    const checkIfTruncated = () => {
      if (labelRef.current) {
        const label = labelRef.current;
        setIsTruncated(label.scrollWidth > label.clientWidth);
      }
    };

    checkIfTruncated();
    window.addEventListener('resize', checkIfTruncated);

    return () => {
      window.removeEventListener('resize', checkIfTruncated);
    };
  }, [text]);

  return (
    <div className="flex gap-2 items-center mb-2 w-full max-w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label
              className={`truncate max-w-full flex items-center gap-2 ${
                isTruncated ? 'cursor-help' : ''
              }`}
              htmlFor={htmlFor}
              ref={labelRef}
              {...props}
            >
              {text}
              {isRequired && <p className="text-red-600">*</p>}
            </Label>
          </TooltipTrigger>
          {isTruncated && (
            <TooltipContent className="max-w-[calc(100vw-2rem)] flex items-center gap-2 break-words p-2 bg-gray-800 text-white">
              {text}
              {isRequired && <span className="text-red-600">*</span>}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LabelInput;
