'use client';
import { useState, useEffect } from 'react';
import BlingLogo from './blingLogo';
import { AuthConnect } from '../AuthConnect';
import React from 'react';
import { ProductData } from '@/types/BlingFormTypes';

const connectApiUrl = `${process.env.NEXT_PUBLIC_URL}/blingAuth`;

const BlingAuthConnect = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Garantir que o código só será executado no cliente
      const token = localStorage.getItem('accessToken');
      setAccessToken(token);
    }
  }, []);

  const updateTokenState = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      setAccessToken(token);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      updateTokenState();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      const selectedErp = localStorage.getItem('selectedErp');

      if (selectedErp === 'bling') {
        localStorage.removeItem('selectedErp');
      }

      updateTokenState();

      const logoutWindow = window.open(
        'https://www.bling.com.br/logout.php',
        'logout',
        'width=800,height=600,top=100,left=100',
      );

      setTimeout(() => {
        logoutWindow?.close();
      }, 2000);

      window.focus();
    }
  };

  return (
    <>
      <AuthConnect
        title="Conexão com Bling"
        logo={<BlingLogo />}
        handleLogout={handleLogout}
        handleConnect={connectApiUrl}
        accessToken={accessToken}
      />
    </>
  );
};

const UseRefreshToken = async () => {
  const saveTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  };

  try {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Nenhum refresh token encontrado no localStorage');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/refresh-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro na API de renovação de token: ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (data.accessToken && data.refreshToken) {
        saveTokens(data.accessToken, data.refreshToken);
      } else {
        throw new Error('Resposta da API não contém os tokens esperados.');
      }
    }
  } catch (error) {
    console.error('Erro ao renovar tokens:', error);
  }
};
const postFileInfo = async (
  file: File,
): Promise<{ signedUrl: string; fileKey: string }> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/upload/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: file.name,
        contentType: file.type,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao enviar o arquivo: ${file.name} - ${response.statusText}`,
    );
  }

  return response.json();
};

const uploadFileToSignedUrl = async (
  signedUrl: string,
  file: File,
): Promise<void> => {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Erro ao fazer upload do arquivo: ${file.name}`);
  }
};

const getFileLink = async (fileKey: string): Promise<any> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/upload/${fileKey}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    throw new Error(`Erro ao obter o link do arquivo: ${fileKey}`);
  }

  return response.json();
};

const CreateUrlImages = async (files: File[]) => {
  console.log('chegou em files ');
  if (files.length === 0) {
    return [];
  }
  const promises = files.map(async (file) => {
    try {
      const { signedUrl, fileKey } = await postFileInfo(file);

      if (signedUrl) {
        try {
          await uploadFileToSignedUrl(signedUrl, file);
          try {
            const { publicUrl } = await getFileLink(fileKey);
            console.log('publicUrl', publicUrl);
            return publicUrl;
          } catch (error) {
            console.error('Erro ao obter o link público:', error);
            return null;
          }
        } catch (error) {
          console.error('Erro no PUT para a URL assinada:', error);
          return null;
        }
      } else {
        console.error('URL assinada não recebida');
        return null;
      }
    } catch (error) {
      console.error('Erro ao processar o arquivo:', error);
      return null;
    }
  });
  console.log('promises:', promises);

  const urls = await Promise.all(promises);
  if (urls) return urls.filter((url) => url !== null) as string[];
};

const PostBlingProduct = async (data: ProductData, files?: File[]) => {
  try {
    // Pega o token de autenticação do localStorage.
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/createProduct`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      },
    );

    console.log('response:', response);

    // Verifica o status da resposta e retorna uma confirmação.
    if (response.ok) {
      const result = await response.json();
      return {
        status: 'success',
        message: 'Produto cadastrado com sucesso!',
        data: result, // Inclui os dados retornados, se houver
      };
    } else {
      return {
        status: 'error',
        message: `Erro ao cadastrar produto: ${response.statusText}`,
      };
    }
  } catch (error) {
    // Verifica se o erro tem a propriedade 'message'
    if (error instanceof Error) {
      return {
        status: 'error',
        message: `Erro ao cadastrar produto: ${error.message}`,
      };
    } else {
      return {
        status: 'error',
        message: 'Erro desconhecido ao cadastrar produto.',
      };
    }
  }
};

export { BlingAuthConnect, UseRefreshToken, PostBlingProduct, CreateUrlImages };
