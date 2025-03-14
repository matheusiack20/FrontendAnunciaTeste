/**
 * Utilitários para autenticação e gerenciamento de sessão
 */

// Verificar se está executando no navegador
const isBrowser = typeof window !== 'undefined';

/**
 * Verifica se o usuário está autenticado e retorna os dados do usuário
 * @returns {Promise<{authenticated: boolean, user: any}>} Status de autenticação e dados do usuário
 */
export async function checkAuth() {
  // Retornar dados vazios se não estiver no navegador
  if (!isBrowser) {
    return { authenticated: false, user: null };
  }

  // Primeiro tenta obter do localStorage (persistência mais longa)
  let userData = null;
  
  // Verificar localStorage
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      userData = JSON.parse(storedUser);
    } catch (e) {
      console.error('Erro ao analisar dados do usuário do localStorage:', e);
    }
  }
  
  // Se não encontrou no localStorage, verificar sessionStorage
  if (!userData) {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        userData = JSON.parse(sessionUser);
      } catch (e) {
        console.error('Erro ao analisar dados do usuário da sessionStorage:', e);
      }
    }
  }
  
  // Verificar token JWT em localStorage ou sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (token) {
    // Opcional: Verificar validade do token aqui ou fazer uma chamada API
    
    // Se temos um token mas não temos dados do usuário, podemos buscar do servidor
    if (!userData) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          userData = await response.json();
          // Armazenar os dados para uso futuro
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    }
    
    return { authenticated: true, user: userData };
  }
  
  return { authenticated: false, user: null };
}

/**
 * Salva os dados do usuário no armazenamento local
 * @param {object} userData - Dados do usuário para salvar
 * @param {boolean} rememberMe - Se verdadeiro, salva em localStorage, senão em sessionStorage
 */
interface UserData {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export function saveUserData(userData: UserData, rememberMe = false) {
  if (typeof window !== 'undefined') {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(userData));
  }
}

/**
 * Limpa todos os dados de autenticação
 */
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
}

/**
 * Busca dados do usuário logado diretamente da API
 * @returns {Promise<any>} Dados do usuário ou null em caso de erro
 */
export async function fetchCurrentUser() {
  if (!isBrowser) {
    return null; // Retorna null se não estiver no navegador
  }

  // Buscar token com mensagem mais detalhada sobre onde ele está procurando
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  const token = localToken || sessionToken;
  
  console.log('Buscando token de autenticação:', {
    localStorageToken: localToken ? 'Presente' : 'Ausente',
    sessionStorageToken: sessionToken ? 'Presente' : 'Ausente'
  });
  
  if (!token) {
    console.log('Nenhum token de autenticação encontrado - tentando recuperar dados do usuário direto do armazenamento local');
    
    // Tentar recuperar dados do usuário de outras fontes mesmo sem token
    const userData = getUserDataFromLocalStorage();
    if (userData) {
      console.log('Dados de usuário recuperados do armazenamento local:', userData.name || userData.email);
      return userData;
    }
    
    // Tente encontrar informações do usuário em outros lugares no armazenamento
    try {
      // Verificar o localStorage para qualquer dado que possa indicar o usuário
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('user') || key.includes('auth'))) {
          console.log(`Encontrou possível dado de usuário em localStorage[${key}]`);
          try {
            const item = localStorage.getItem(key);
            const value = item ? JSON.parse(item) : null;
            if (value && (value.name || value.email || value.id)) {
              console.log('Recuperou potencial dado de usuário:', value);
              return value;
            }
          } catch (e) {
            // Ignora erros de parse
          }
        }
      }
    } catch (e) {
      console.log('Erro ao buscar em storage alternativo:', e);
    }
    
    return null;
  }
  
  try {
    console.log('Token encontrado, tentando buscar usuário:', token.substring(0, 10) + '...');
    
    // Tentar primeiro a rota específica para usuários
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Dados do usuário obtidos da API (rota current):', userData);
        saveUserData(userData);
        return userData;
      } 
    } catch (err) {
      console.log('Erro ao usar rota /current, tentando rota alternativa');
    }
    
    // Tentar rota alternativa para usuários
    try {
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        console.log('Dados do usuário obtidos da API (rota me):', userData);
        saveUserData(userData);
        return userData;
      }
    } catch (meErr) {
      console.log('Erro ao usar rota /me');
    }
    
    // Verificar se há dados do usuário no localStorage/sessionStorage como último recurso
    const userData = getUserDataFromLocalStorage();
    if (userData) {
      console.log('Usando dados do usuário do armazenamento local');
      return userData;
    }
    
    console.error('Não foi possível obter dados do usuário de nenhuma fonte');
    return null;
  } catch (error) {
    console.error('Exceção ao buscar dados do usuário:', error);
    return null;
  }
}

// Função de ajuda para obter dados do usuário do armazenamento local
function getUserDataFromLocalStorage() {
  if (!isBrowser) return null;
  
  try {
    // Tentar obter do localStorage primeiro
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      return JSON.parse(localStorageUser);
    }
    
    // Depois tentar do sessionStorage
    const sessionStorageUser = sessionStorage.getItem('user');
    if (sessionStorageUser) {
      return JSON.parse(sessionStorageUser);
    }
  } catch (e) {
    console.error('Erro ao recuperar usuário do armazenamento local:', e);
  }
  
  return null;
}

/**
 * Obtém o ID do usuário atualmente autenticado
 * @returns {string | null} ID do usuário ou null se não estiver autenticado
 */
export function getCurrentUserId(): string | null {
  if (!isBrowser) return null;
  
  try {
    // Verificar primeiro localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const userData = JSON.parse(localUser);
      if (userData && (userData.id || userData._id)) {
        return userData.id || userData._id;
      }
    }
    
    // Depois verificar sessionStorage
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      const userData = JSON.parse(sessionUser);
      if (userData && (userData.id || userData._id)) {
        return userData.id || userData._id;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error);
    return null;
  }
}
