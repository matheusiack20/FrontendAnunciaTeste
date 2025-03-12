const BlingAuthConnect = () => {
  return (
    <div>
      <h1>Conectar com Bling</h1>
      <a href={`${process.env.NEXT_PUBLIC_URL}/blingAuth`}>
        <button>Conectar</button>
      </a>
    </div>
  );
};

const UseRefreshToken = async () => {
  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Nenhum refresh token encontrado no localStorage');
    }

    // Chamada da API para atualizar o token
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

    // Verifica se a resposta da API é válida (status code entre 200-299)
    if (!response.ok) {
      throw new Error(
        `Erro na API de renovação de token: ${response.statusText}`,
      );
    }

    // Parse da resposta para JSON
    const data = await response.json();

    // Valida se os tokens foram recebidos
    if (data.accessToken && data.refreshToken) {
      saveTokens(data.accessToken, data.refreshToken);
    } else {
      throw new Error('Resposta da API não contém os tokens esperados.');
    }
  } catch (error) {}
};

export { BlingAuthConnect, UseRefreshToken };
