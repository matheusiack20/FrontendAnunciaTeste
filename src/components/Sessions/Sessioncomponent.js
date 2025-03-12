import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SessionComponent() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_FRONTEND}/api/auth/session`, {
          withCredentials: true, // Envia cookies junto com a requisição
        });
        setSession(response.data); // Armazena os dados da sessão
      } catch (error) {
        console.error('Erro ao buscar a sessão:', error);
      }
    };

    fetchSession();
  }, []); // O array vazio [] faz com que a requisição seja feita apenas uma vez

  return (
    <div>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre> // Exibe os dados da sessão
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}