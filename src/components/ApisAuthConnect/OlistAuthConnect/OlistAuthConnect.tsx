'use client';
import { useState, useEffect } from 'react';
import { AuthConnect } from '../AuthConnect';
import { OlistLogo } from './OlistLogo';

const connectApiUrl =
  `${process.env.NEXT_PUBLIC_URL}/auth/olist`;

const OlistAuthConnect = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const updateTokenState = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('olistAccessToken');
        setAccessToken(token);
      }
    };

    updateTokenState();

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
      localStorage.removeItem('olistAccessToken');
      localStorage.removeItem('olistRefreshToken');

      const selectedErp = localStorage.getItem('selectedErp');
      if (selectedErp === 'olist') {
        localStorage.removeItem('selectedErp');
      }

      setAccessToken(null);

      const logoutWindow = window.open(
        'https://erp.tiny.com.br/logout',
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
    <AuthConnect
      title="Conexão com Olist"
      logo={<OlistLogo />}
      accessToken={accessToken}
      handleLogout={handleLogout}
      handleConnect={connectApiUrl}
    />
  );
};

const UseOlistRefreshToken = async () => {
  console.log('Foi chamado para atualizar o token do Olist');

  const saveTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('olistAccessToken', accessToken);
      localStorage.setItem('olistRefreshToken', refreshToken);
    }
  };

  try {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('olistRefreshToken');
      if (!refreshToken) {
        throw new Error('Nenhum refresh token encontrado no localStorage');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/olist-refresh-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      console.log('response:', response);

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

const PostOlistProduct = async (data: any) => {
  const accessToken = localStorage.getItem('olistAccessToken');
  if (!accessToken) {
    console.error('Token de acesso não encontrado');
    return;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/createOlistProduct`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (response.ok) {
    const result = await response.json();
    console.log('Produto cadastrado com sucesso no Olist:', result);
    return {
      status: 'success',
      message: 'Produto cadastrado com sucesso!',
      data: result, // Inclui os dados retornados, se houver
    };
  } else {
    console.error('Erro ao cadastrar produto no Olist:', response.statusText);
    return {
      status: 'error',
      message: `Erro ao cadastrar produto: ${response.statusText}`,
    };
  }
};

export { OlistAuthConnect, UseOlistRefreshToken, PostOlistProduct };
