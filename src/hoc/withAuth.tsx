import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '../api/auth';

interface VerifyTokenResponse {
  user: AuthProps['user'];
}

export interface AuthProps {
  user: { plan?: 1 | 2 | 3; announcementCount?: number } & Partial<User> | null;
  children?: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  // Adicione outros campos conforme necessário
}

const withAuth = <P extends AuthProps>(WrappedComponent: React.ComponentType<AuthProps>) => {
  const AuthComponent: React.FC<Omit<P, 'user'>> = (props) => {
    const [user, setUser] = useState<AuthProps['user']>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <AuthContent {...props} user={user} setUser={setUser} loading={loading} setLoading={setLoading} error={error} setError={setError} router={router} WrappedComponent={WrappedComponent} />
      </Suspense>
    );
  };

  return AuthComponent;
};

const AuthContent: React.FC<Omit<AuthProps, 'user'> & { user: AuthProps['user'], setUser: React.Dispatch<React.SetStateAction<AuthProps['user']>>, loading: boolean, setLoading: React.Dispatch<React.SetStateAction<boolean>>, error: string | null, setError: React.Dispatch<React.SetStateAction<string | null>>, router: ReturnType<typeof useRouter>, WrappedComponent: React.ComponentType<AuthProps> }> = ({ user, setUser, loading, setLoading, error, setError, router, WrappedComponent, ...props }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) {
      setError('Erro ao obter parâmetros de pesquisa.');
      setLoading(false);
      return;
    }
    
    const token = searchParams.get('token') || localStorage.getItem('authToken');  // Check URL and localStorage for token;

    if (!token) {
      setError('Token não encontrado na URL.');
      setLoading(false);
      return;
    }

    if (searchParams.get('token')) {
      localStorage.setItem('authToken', token);  // Save token to localStorage if found in URL
    }
    const checkAuth = async () => {
      try {
        console.log('Verificando token...', token);
        const data = await verifyToken();

        if (!data) {
          console.warn('Token inválido, redirecionando para login...');
          router.push('/login');
          return;
        }

        setUser(data.user);  // Armazena os dados do usuário na variável de estado
      } catch (error: any) {
        console.error('Erro ao verificar autenticação:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return <WrappedComponent {...(props as AuthProps)} user={user} />;
};

export default withAuth;
