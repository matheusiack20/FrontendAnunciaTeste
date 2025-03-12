import React, { useEffect, useState, useCallback } from 'react';
import {
  FileUploader,
  FileUploaderItem,
  FileInput,
} from '@/components/extension/file-upload';
import ErrorMessage from '../utils/ErrorMessage';
import Image from 'next/image';
import { UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { BlingFormType } from '@/types/BlingFormTypes';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];
const MAX_SIZE = 1024 * 1024 * 12; // 12MB

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-white dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-white dark:text-gray-400">
        <span className="font-semibold">Clique para upload</span> ou arraste e
        solte
      </p>
      <p className="text-xs text-white dark:text-gray-400">
        SVG, PNG, JPG ou GIF
      </p>
    </>
  );
};

interface FileUploaderTestProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isVariation?: boolean;
  setValue?: UseFormSetValue<BlingFormType>;
  getValues?: UseFormGetValues<BlingFormType>;
}

const FileUploaderComponent: React.FC<FileUploaderTestProps> = ({
  files,
  setFiles,
  isVariation = false,
  getValues,
  setValue,
}) => {
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
  const [filesExceedingSize, setFilesExceedingSize] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [localImagesVariation, setLocalImagesVariation] = useState<File[]>([]);
  const dropZoneConfig = {
    maxSize: MAX_SIZE,
    maxFiles: 9,
    multiple: true,
  };

  const imagesVariation = getValues?.('imagesVariation') || [];

  React.useEffect(() => {
    if (isVariation) {
      if (getValues) {
        if (imagesVariation) {
          if (localImagesVariation.length === 0) {
            setLocalImagesVariation(imagesVariation as any);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesVariation]);

  const handleValueChange = useCallback(
    (value: File[] | null) => {
      if (!value) {
        setInvalidFiles([]);
        setShowAlert(false);
        setFilesExceedingSize([]);
        return;
      }

      const validFiles = value.filter(
        (file) => ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE,
      );

      const hasInvalidFiles = value.some(
        (file) => !ALLOWED_TYPES.includes(file.type),
      );
      const hasFilesExceedingSize = value.some((file) => file.size > MAX_SIZE);

      if (hasInvalidFiles || hasFilesExceedingSize) {
        setShowAlert(true);
        setInvalidFiles(
          value.filter((file) => !ALLOWED_TYPES.includes(file.type)),
        );
        setFilesExceedingSize(value.filter((file) => file.size > MAX_SIZE));
      } else {
        setShowAlert(false);
        setInvalidFiles([]);
        setFilesExceedingSize([]);
      }

      if (!isVariation) {
        setFiles(validFiles);
      } else {
        if (setLocalImagesVariation) {
          setLocalImagesVariation(validFiles);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVariation],
  );

  React.useEffect(() => {
    if (localImagesVariation && setValue) {
      if (getValues) {
        const imagesVariation = getValues('imagesVariation');
        if (imagesVariation && localImagesVariation! == imagesVariation)
          setValue('imagesVariation', localImagesVariation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localImagesVariation]);

  const ErrorMessages = () => {
    if (invalidFiles.length > 0) {
      return (
        <div className="flex flex-col w-full items-center justify-center text-center">
          Os seguintes arquivos não são permitidos:
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {invalidFiles.map((file) => (
              <ErrorMessage key={file.name}>{file.name}</ErrorMessage>
            ))}
          </div>
        </div>
      );
    }

    if (filesExceedingSize.length > 0) {
      return (
        <div className="flex flex-col w-full items-center justify-center text-center">
          Os seguintes arquivos excedem o tamanho máximo de 12MB:
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {filesExceedingSize.map((file) => (
              <ErrorMessage key={file.name}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
              </ErrorMessage>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <FileUploader
      value={!isVariation ? files : localImagesVariation || []}
      onValueChange={handleValueChange}
      dropzoneOptions={dropZoneConfig}
      className="relative bg-black text-white rounded-lg p-2 flex flex-col items-center justify-center mx-auto"
    >
      <FileInput className="outline-dashed outline-1 outline-white w-full">
        <div className="flex items-center justify-center flex-col pt-3 pb-4">
          <FileSvgDraw />
        </div>
      </FileInput>

      <div className="flex gap-3 flex-wrap w-full justify-center items-center">
        {!isVariation &&
          files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem
              isVariation={isVariation}
              getValues={getValues}
              setValue={setValue}
              key={file.name + i}
              index={i}
            >
              <Image
                width={50}
                height={50}
                src={URL.createObjectURL(file)}
                alt={`Uploaded file ${i}`}
                className="h-36 w-36 object-cover"
              />
            </FileUploaderItem>
          ))}
        {isVariation &&
          (localImagesVariation || []).map((file, i) => {
            return (
              <FileUploaderItem
                setLocalImagesVariation={setLocalImagesVariation}
                getValues={getValues}
                isVariation={isVariation}
                setValue={setValue}
                key={file.name + i}
                index={i}
                localImagesVariation={localImagesVariation}
              >
                <Image
                  width={50}
                  height={50}
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded file ${i}`}
                  className="h-36 w-36 object-cover"
                />
              </FileUploaderItem>
            );
          })}
      </div>
      {showAlert && <ErrorMessages />}
    </FileUploader>
  );
};

export default FileUploaderComponent;
