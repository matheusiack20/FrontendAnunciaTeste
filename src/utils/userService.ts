/**
 * Serviço para gerenciar dados do usuário no frontend (só memória/sessão)
 */
import { fetchCurrentUser } from './auth';

// Verificar se está executando no navegador
const isBrowser = typeof window !== 'undefined';

/**
 * Interface para dados básicos do usuário no checkout
 */
export interface CheckoutUserData {
  nome: string;
  email: string;
  cpf?: string;
  celular?: string;
}

/**
 * Obtém os dados do usuário para preenchimento do formulário de checkout
 * sem salvar no banco de dados
 */
export async function getCheckoutUserData(): Promise<CheckoutUserData> {
  if (!isBrowser) {
    return { nome: '', email: '' };
  }
  
  try {
    // 1. Tentar buscar dados diretamente do componente MinhaConta
    const accountData = localStorage.getItem('accountUserData') || sessionStorage.getItem('accountUserData');
    if (accountData) {
      try {
        const userData = JSON.parse(accountData);
        if (userData && (userData.name || userData.nome || userData.email)) {
          console.log('Dados encontrados de MinhaConta:', userData);
          return {
            nome: userData.name || userData.nome || '',
            email: userData.email || '',
            cpf: userData.document || userData.cpf || '',
            celular: userData.phone || userData.celular || '',
          };
        }
      } catch (e) {
        console.error('Erro ao processar dados da conta:', e);
      }
    }

    // 2. Verificar primeiro se há dados na sessão
    const sessionData = sessionStorage.getItem('checkoutUserData');
    if (sessionData) {
      try {
        const data = JSON.parse(sessionData);
        if (data && (data.nome || data.email)) {
          console.log('Usando dados encontrados na sessão de checkout:', data);
          return data;
        }
      } catch (e) {
        console.error('Erro ao processar dados de checkout da sessão:', e);
      }
    }
    
    // 3. Verificar formulário salvo anteriormente
    const savedForm = sessionStorage.getItem('clientInfoForm');
    if (savedForm) {
      try {
        const formData = JSON.parse(savedForm);
        if (formData && (formData.nome || formData.email)) {
          console.log('Usando dados encontrados no formulário salvo:', formData);
          
          // Salva para manter consistência
          const checkoutData = {
            nome: formData.nome || '',
            email: formData.email || '',
            cpf: formData.cpf || '',
            celular: formData.celular || '',
          };
          
          sessionStorage.setItem('checkoutUserData', JSON.stringify(checkoutData));
          return checkoutData;
        }
      } catch (e) {
        console.error('Erro ao processar formulário salvo:', e);
      }
    }
    
    // 4. Tentar obter usuário autenticado via auth.ts
    console.log('Tentando buscar dados do usuário autenticado...');
    const userData = await fetchCurrentUser();
    if (userData) {
      console.log('Dados do usuário obtidos da API/autenticação:', userData);
      
      const checkoutData = {
        nome: userData.name || userData.nome || '',
        email: userData.email || '',
        cpf: userData.document || userData.cpf || '',
        celular: userData.phone || userData.celular || '',
      };
      
      // Salvar temporariamente na sessão (não no banco)
      sessionStorage.setItem('checkoutUserData', JSON.stringify(checkoutData));
      return checkoutData;
    }
    
    // 5. Usar uma abordagem mais agressiva para encontrar dados do usuário em qualquer localStorage ou sessionStorage
    console.log('Buscando dados do usuário em qualquer armazenamento...');
    
    // Variáveis para armazenar os melhores dados encontrados
    let bestUserData = { nome: '', email: '' };
    let dataQuality = 0; // 0 = nada, 1 = apenas email, 2 = nome e email
    
    // Função para avaliar dados encontrados
    const evaluateUserData = (data: any) => {
      if (!data) return 0;
      let quality = 0;
      if (data.email || data.correo || data.mail) quality += 1;
      if (data.name || data.nome || data.username || data.firstName) quality += 1;
      return quality;
    };
    
    // Função para extrair dados limpos de qualquer estrutura encontrada
    const extractUserData = (data: any) => {
      return {
        nome: data.name || data.nome || data.username || data.firstName || '',
        email: data.email || data.correo || data.mail || '',
        cpf: data.document || data.cpf || data.documentId || '',
        celular: data.phone || data.celular || data.tel || '',
      };
    };
    
    // Buscar em localStorage
    for (let i = 0; i < localStorage.length; i++) {
      try {
        const key = localStorage.key(i);
        if (!key) continue;
        
        // Pular chaves não relacionadas a usuários
        if (!key.includes('user') && !key.includes('User') && 
            !key.includes('auth') && !key.includes('Auth') &&
            !key.includes('perfil') && !key.includes('Profile') &&
            !key.includes('account') && !key.includes('Account') &&
            !key.includes('session') && !key.includes('Session')) continue;
        
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        try {
          const parsedValue = JSON.parse(value);
          const quality = evaluateUserData(parsedValue);
          
          // Se encontramos dados melhores que os anteriores
          if (quality > dataQuality) {
            dataQuality = quality;
            bestUserData = extractUserData(parsedValue);
            console.log(`Encontrado dado de qualidade ${quality} em localStorage[${key}]`);
          }
        } catch (e) {
          // Ignora erros de parsing
        }
      } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
      }
    }
    
    // Se encontramos dados bons o suficiente, use-os
    if (dataQuality > 0) {
      console.log('Usando melhor dado encontrado:', bestUserData);
      sessionStorage.setItem('checkoutUserData', JSON.stringify(bestUserData));
      return bestUserData;
    }

    // Finalmente, tente pegar do withAuth HOC global state (pode estar salvo em sessionStorage)
    const authUserData = sessionStorage.getItem('authUserData');
    if (authUserData) {
      try {
        const userData = JSON.parse(authUserData);
        if (userData && (userData.name || userData.email)) {
          console.log('Dados encontrados do withAuth HOC:', userData);
          const checkoutData = {
            nome: userData.name || '',
            email: userData.email || '',
          };
          sessionStorage.setItem('checkoutUserData', JSON.stringify(checkoutData));
          return checkoutData;
        }
      } catch (e) {
        console.error('Erro ao processar dados de authUserData:', e);
      }
    }
    
    console.log('Nenhum dado de usuário encontrado');
    return { nome: '', email: '' };
  } catch (error) {
    console.error('Erro ao obter dados do usuário para checkout:', error);
    return { nome: '', email: '' };
  }
}

/**
 * Limpa os dados temporários do checkout
 */
export function clearCheckoutData(): void {
  if (!isBrowser) return;
  
  try {
    sessionStorage.removeItem('checkoutUserData');
    sessionStorage.removeItem('clientInfoForm');
    sessionStorage.removeItem('creditCardInfoForm');
  } catch (e) {
    console.error('Erro ao limpar dados temporários de checkout:', e);
  }
}
