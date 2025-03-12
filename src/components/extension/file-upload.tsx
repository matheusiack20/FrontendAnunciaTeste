'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Dispatch,
  SetStateAction,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useDropzone,
  DropzoneState,
  FileRejection,
  DropzoneOptions,
} from 'react-dropzone';
import { toast } from 'sonner';
import { Trash2 as RemoveIcon } from 'lucide-react';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { BlingFormType } from '@/types/BlingFormTypes';

type DirectionOptions = 'rtl' | 'ltr' | undefined;

type FileUploaderContextType = {
  dropzoneState: DropzoneState;
  isLOF: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  orientation: 'horizontal' | 'vertical';
  direction: DirectionOptions;
};

const FileUploaderContext = createContext<FileUploaderContextType | null>(null);
export const useFileUpload = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider');
  }
  return context;
};

type FileUploaderProps = {
  value: File[] | null;
  reSelect?: boolean;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions: DropzoneOptions;
  orientation?: 'horizontal' | 'vertical';
};

export const FileUploader = forwardRef<
  HTMLDivElement,
  FileUploaderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = 'vertical',
      children,
      dir,
      ...props
    },
    ref,
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false);
    const [isLOF, setIsLOF] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const {
      accept = {
        'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      },
      maxSize = 4 * 1024 * 1024,
      multiple = true,
      maxFiles = 5,
    } = dropzoneOptions;

    const reSelectAll = Number(maxFiles) === 1 ? true : reSelect;
    const direction: DirectionOptions = dir === 'rtl' ? 'rtl' : 'ltr';
    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return;
        const newFiles = value.filter((_, index) => index !== i);
        onValueChange(newFiles);
      },
      [value, onValueChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!value) return;

        const moveNext = () => {
          const nextIndex = activeIndex + 1;
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex);
        };

        const movePrev = () => {
          const nextIndex = activeIndex - 1;
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex);
        };

        const prevKey =
          orientation === 'horizontal'
            ? direction === 'ltr'
              ? 'ArrowLeft'
              : 'ArrowRight'
            : 'ArrowUp';

        const nextKey =
          orientation === 'horizontal'
            ? direction === 'ltr'
              ? 'ArrowRight'
              : 'ArrowLeft'
            : 'ArrowDown';

        if (e.key === nextKey) {
          moveNext();
        } else if (e.key === prevKey) {
          movePrev();
        } else if (e.key === 'Enter' || e.key === 'Space') {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click();
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex);
            if (value.length - 1 === 0) {
              setActiveIndex(-1);
              return;
            }
            movePrev();
          }
        } else if (e.key === 'Escape') {
          setActiveIndex(-1);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, activeIndex, removeFileFromSet],
    );

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles;

        if (!files) {
          toast.error('file error , probably too big');
          return;
        }

        const newValues: File[] = value ? [...value] : [];

        if (reSelectAll) {
          newValues.splice(0, newValues.length);
        }

        files.forEach((file) => {
          if (newValues.length < maxFiles) {
            newValues.push(file);
          }
        });

        onValueChange(newValues);

        if (rejectedFiles.length > 0) {
          for (let i = 0; i < rejectedFiles.length; i++) {
            if (rejectedFiles[i].errors[0]?.code === 'file-too-large') {
              toast.error(
                `File is too large. Max size is ${maxSize / 1024 / 1024}MB`,
              );
              break;
            }
            if (rejectedFiles[i].errors[0]?.message) {
              toast.error(rejectedFiles[i].errors[0].message);
              break;
            }
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reSelectAll, value],
    );

    useEffect(() => {
      if (!value) return;
      if (value.length === maxFiles) {
        setIsLOF(true);
        return;
      } else {
        setIsLOF(false);
      }
    }, [value, maxFiles]);

    const opts = dropzoneOptions
      ? dropzoneOptions
      : { accept, maxFiles, maxSize, multiple };

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false),
    });

    return (
      <FileUploaderContext.Provider
        value={{
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction,
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            'grid w-full focus:outline-none overflow-hidden ',
            className,
            {
              'gap-2': value && value.length > 0,
            },
          )}
          dir={dir}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    );
  },
);

FileUploader.displayName = 'FileUploader';

export const FileUploaderContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('w-full px-1')} ref={containerRef}>
      <div
        {...props}
        ref={ref}
        className={cn(
          'flex rounded-xl gap-1',
          orientation === 'horizontal' ? 'flex-raw flex-wrap' : 'flex-col',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = 'FileUploaderContent';

export const FileUploaderItem = forwardRef<
  HTMLDivElement,
  {
    index: number;
    isVariation: boolean;
    setValue?: UseFormSetValue<BlingFormType>;
    getValues?: UseFormGetValues<BlingFormType>;
    localImagesVariation?: File[];
    setLocalImagesVariation?: React.Dispatch<React.SetStateAction<File[]>>;
  } & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      index,
      setLocalImagesVariation,
      isVariation,
      localImagesVariation,
      getValues,
      setValue,
      children,

      ...props
    },
    ref,
  ) => {
    const { removeFileFromSet } = useFileUpload();
    return (
      <div className="relative" ref={ref} {...props}>
        <div className="font-medium relative leading-none tracking-tight">
          {children}
        </div>
        <button
          type="button"
          className="flex justify-center items-center absolute top-1 h-7 w-7 right-1 bg-gray-500 rounded-full hover:bg-gray-950 hover:stroke-destructive hover:text-red-600"
          onClick={() => {
            if (!isVariation) {
              removeFileFromSet(index);
            } else {
              if (localImagesVariation) {
                const prevVariations = localImagesVariation;
                if (setLocalImagesVariation) {
                  setLocalImagesVariation(
                    prevVariations.filter((_, i) => i !== index),
                  );
                }
              }
            }
          }}
        >
          <RemoveIcon
            width={16}
            height={16}
            className="duration-200 ease-in-out"
          />
        </button>
      </div>
    );
  },
);

FileUploaderItem.displayName = 'FileUploaderItem';

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload();
  const rootProps = isLOF ? {} : dropzoneState.getRootProps();
  return (
    <div
      ref={ref}
      {...props}
      className={`w-full ${
        isLOF ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '
      }`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? 'border-green-500'
             : dropzoneState.isDragReject || isFileTooBig
               ? 'border-red-500'
               : 'border-gray-300'
         }`,
          className,
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        type="file"
        multiple
        accept="image/jpeg, image/png"
        ref={dropzoneState.inputRef}
        disabled={isLOF}
        {...dropzoneState.getInputProps()}
        className={`${isLOF ? 'cursor-not-allowed' : ''}`}
      />
    </div>
  );
});

FileInput.displayName = 'FileInput';
