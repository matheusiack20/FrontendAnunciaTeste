import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import ErrorMessage from '../utils/ErrorMessage';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Search, Loader2 } from 'lucide-react';
import TitlesComponent from './TitlesComponent';
import DescriptionComponent from './DescriptionsComponent';
import SkeletonComponent from '../utils/SkeletonComponent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import AlertMessage from '../utils/AlertMessage';
import FileUploaderComponent from '../formComponents/FileUploaderComponent';
import MetaTagsComponent from './MetaTagsComponent';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { GenerateInfosType, generateInfos } from '@/types/GenerateInfos';
import ModalMaxLimitReached from '../ModalMaxLimitReached/ModalMaxLimitReached';
import withAuth from '@/hoc/withAuth';
import Cookies from 'js-cookie';

interface DataI {
  title: string[];
  description: string[];
  metaTags: string[];
}

import { AuthProps } from '@/hoc/withAuth';

const GenerateTitleAndDescription: React.FC<AuthProps> = ({ user }) => {
  const [data, setData] = useState<DataI | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [charactersErrorMessage, setCharactersErrorMessage] = useState<string | null>(null);
  const [maxLenghtImagesMessage, setMaxLenghtImagesMessage] = useState<string | null>(null);
  const [messageAlert, setMessageAlert] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { register, handleSubmit, control, getValues, setValue } = useForm<GenerateInfosType>({
    resolver: zodResolver(generateInfos),
  });

  const { errors } = useFormState({ control });

  const charactersOptions = [
    { value: '60', label: '60 caracteres' },
    { value: '80', label: '80 caracteres' },
    { value: '100', label: '100 caracteres' },
    { value: '120', label: '120 caracteres' },
  ];

  const clearErrorMessages = () => {
    if (messageAlert && (errors.title || errors.description)) {
      setMessageAlert(null);
    }
    if (charactersErrorMessage) {
      setCharactersErrorMessage(null);
    }
    if (files.length <= 5) {
      setMaxLenghtImagesMessage(null);
    }
  };

  useEffect(() => {
    clearErrorMessages();
  }, [errors, files, clearErrorMessages]);

  const sendData = async (data: GenerateInfosType): Promise<void> => {
    try {
      setLoading(true);
      setIsError(false);

      const formData = new FormData();
      if (data.title) {
        formData.append('title', data.title);
      }
      if (!data.title && files.length != 0) {
        formData.append('title', '');
      }
      if (data.characters) {
        formData.append('characters', data.characters);
      }
      if (data.description) {
        formData.append('description', data.description);
      }

      if (files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`photos`, file);
        });
      }

      const authToken = localStorage.getItem('authToken') // Get the auth token from cookies

      const response = await fetch(
        'https://api.mapmarketplaces.com/generateTitleAndDescription',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include the token in the headers
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      console.log('result:', result);
      setData(result);
      if (result) {
        console.log('deu certo');
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: GenerateInfosType) => {
    const planLimits = {
      1: 30,
      2: 60,
      3: 120,
    };

    if (!user) {
      setShowModal(true);
      return null;
    }
    console.log(user.plan);
    if (user.plan && (user.announcementCount ?? 0) >= planLimits[user.plan]) {
      setShowModal(true);
      return;
    }
    if (user.plan == null){
      setShowModal(true);
      return;
    }

    if (!data.title && files.length == 0) {
      setMessageAlert('Você deve preencher um título ou enviar uma imagem.');
      return;
    }

    if (data.title.trim().length < 2 && files.length == 0) {
      setMessageAlert(
        'Você deve preencher uma palavra com pelo menos 2 letras ou uma imagem.',
      );
      return;
    }
    if (files.length > 9) {
      setMaxLenghtImagesMessage('Você deve selecionar até 9 imagens');
      return;
    }

    if (!data.characters) {
      setCharactersErrorMessage(
        'Você deve selecionar a quantidade de caracteres.',
      );
      return;
    }

    if (data.title && data.title.trim().length >= 2 || files.length != 0) {
      setMessageAlert(null);
      setCharactersErrorMessage(null);
      try {
        await sendData(data);
      } catch (error) {
        console.error('Erro ao enviar dados:', error);
      }
    }
  };

  return (
    <div className="pt-10">
      <div className="mb-10">
        <h1 className="text-white-800 mb-2 text-3xl font-extrabold text-center dark:text-white md:text-5xl">
          Ainda não sabe o melhor título e descrição para seu produto?
        </h1>
        <p className="text-white-600 text-center">
          Descubra títulos e descrições baseado nos produtos mais vendidos e
          procurados nos marketplaces!
        </p>
      </div>
      <form
        className="flex flex-col items-start gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <Input
            type="text"
            {...register('title')}
            placeholder="Digite o nome do seu produto"
          />
          {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
        </div>
        {messageAlert && <AlertMessage>{messageAlert}</AlertMessage>}
        <div className="w-full">
          <FileUploaderComponent files={files} setFiles={setFiles} />
        </div>
        <div className="w-full">
          <Textarea
            {...register('description')}
            placeholder="Digite a descrição do produto para ter um melhor resultado"
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </div>
        <div className="w-full">
          <Label htmlFor="caracteres">Escolha o tamanho do seu título</Label>
          <Controller
            name="characters"
            control={control}
            defaultValue="60"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(newValue) => {
                  field.onChange(newValue);
                }}
              >
                <SelectTrigger id="caracteres">
                  <SelectValue placeholder="Quantos caracteres">
                    {charactersOptions.find(
                      (option) => option.value === field.value,
                    )?.label || 'Quantos caracteres'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {charactersOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {charactersErrorMessage && (
            <ErrorMessage>{charactersErrorMessage}</ErrorMessage>
          )}
        </div>
        <Button type="submit" disabled={loading} variant="default">
          {!loading ? (
            <Search className="w-5 h-5 mr-2" />
          ) : (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          )}
          Melhore seu título ou descrição
        </Button>
      </form>
      {loading && (
        <div className="mt-16 flex flex-col gap-20">
          {<SkeletonComponent />}
          {<SkeletonComponent />}
        </div>
      )}
      {!loading && !isError && data && data.title && (
        <TitlesComponent data={data.title} />
      )}
      {!loading && !isError && data && data.description && (
        <DescriptionComponent data={data.description} />
      )}
      {!loading && !isError && data && data.metaTags && (
        <MetaTagsComponent data={data.metaTags} />
      )}
      <ModalMaxLimitReached open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default withAuth(GenerateTitleAndDescription);