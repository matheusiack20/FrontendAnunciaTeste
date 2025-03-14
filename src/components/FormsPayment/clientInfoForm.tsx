/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { getCheckoutUserData } from '@/utils/userService';
import { fetchCurrentUser } from '@/utils/auth';

const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

interface ClientInfoFormProps {
  onNext: (formData: any) => void;
}

interface UserData {
  nome?: string;
  name?: string;
  email?: string;
}

// Função auxiliar para verificar se está executando no navegador
const isBrowser = typeof window !== 'undefined';

// Função para obter dados de forma segura do sessionStorage
const getSavedFormData = () => {
  if (!isBrowser) return null;
  
  try {
    const savedData = sessionStorage.getItem('clientInfoForm');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do formulário:', error);
    return null;
  }
};

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({ onNext }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(() => {
    // Inicializa com os valores padrão
    const defaultData = {
      nome: '',
      email: '',
      cpf: '',
      celular: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    };
    
    // No lado do cliente, tenta recuperar dados salvos
    const savedData = getSavedFormData();
    return savedData || defaultData;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userFound, setUserFound] = useState(false);
  
  // Função para verificar existência de token
  const checkForToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Status do token:', token ? 'Presente' : 'Ausente');
    if (token) {
      console.log('Token encontrado:', token.substring(0, 10) + '...');
    }
    return !!token;
  };

  useEffect(() => {
    // Carregar dados do usuário de múltiplas fontes
    const loadUserData = async () => {
      if (!isBrowser) return; // Só executa no cliente
      
      setLoadingUser(true);
      
      try {
        console.log('Buscando dados do usuário para o formulário...');
        
        // Primeiro tenta buscar qualquer dado pré-existente na sessão
        let userData = null;
        const savedFormData = getSavedFormData();
        if (savedFormData && (savedFormData.nome || savedFormData.email)) {
          console.log('Usando dados do formulário previamente salvos:', savedFormData);
          updateFormWithUserData(savedFormData);
          // Se ao menos tem nome ou email, considera que encontrou o usuário
          if (savedFormData.nome || savedFormData.email) {
            setUserFound(true);
          }
          setLoadingUser(false);
          return;
        }
        
        // Tenta buscar dados através do serviço dedicado
        userData = await getCheckoutUserData();
        
        if (userData && (userData.nome || userData.email)) {
          console.log('Dados do usuário encontrados via serviço:', userData);
          updateFormWithUserData(userData);
          setUserFound(true);
          setLoadingUser(false);
          return;
        }
        
        // Último recurso: tentar encontrar dados do usuário em qualquer storage disponível
        console.log('Tentando encontrar dados do usuário em qualquer storage...');
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
          try {
            const userDataFromStorage = JSON.parse(storedUser);
            console.log('Dados do usuário encontrados no storage:', userDataFromStorage);
            
            const extractedData = {
              nome: userDataFromStorage.name || userDataFromStorage.nome || '',
              email: userDataFromStorage.email || '',
            };
            
            if (extractedData.nome || extractedData.email) {
              updateFormWithUserData(extractedData);
              setUserFound(true);
              setLoadingUser(false);
              return;
            }
          } catch (e) {
            console.error('Erro ao processar dados do storage:', e);
          }
        }
        
        // Se chegou aqui, não conseguiu encontrar dados do usuário
        console.log('Nenhum dado de usuário encontrado');
        setUserFound(false);
        setLoadingUser(false);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Em caso de erro, simplesmente não exibe nenhuma mensagem
        setUserFound(false);
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  // Função auxiliar para atualizar o formulário com dados do usuário
  const updateFormWithUserData = (userData: any) => {
    if (!userData) return;

    console.log('Atualizando formulário com dados do usuário:', userData);

    setFormData((prev: typeof formData) => ({
      ...prev,
      nome: userData.nome || userData.name || prev.nome,
      email: userData.email || prev.email,
      // Opcionalmente, pode preencher outros campos como CPF, telefone, etc.
      // se estiverem disponíveis nos dados do usuário
      cpf: userData.cpf || userData.document || prev.cpf,
      celular: userData.celular || userData.phone || prev.celular,
    }));
  };

  // Salva os dados do formulário na sessionStorage quando mudam
  useEffect(() => {
    if (isBrowser) {
      try {
        sessionStorage.setItem('clientInfoForm', JSON.stringify(formData));
      } catch (error) {
        console.error('Erro ao salvar dados do formulário:', error);
      }
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length <= 8) {
      setFormData({ ...formData, cep: cep.replace(/(\d{5})(\d{3})/, '$1-$2') });

      if (cep.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
          const { logradouro, complemento, bairro, localidade, uf } = response.data;
          setFormData((prevData: any) => ({
            ...prevData,
            logradouro,
            complemento,
            bairro,
            cidade: localidade,
            estado: uf,
          }));
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext(formData);
  };
  
  // Formatar CPF ao digitar
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    setFormData({ ...formData, cpf: value });
  };
  
  // Formatar celular ao digitar
  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    setFormData({ ...formData, celular: value });
  };

  return (
    <div className="w-full border rounded-xl h-auto p-2 py-3">
      <h1 className="font-bold">Informações de Contato</h1>
      
      {loadingUser ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando seus dados...</p>
        </div>
      ) : (
        <>
          {/* Remover completamente o bloco de mensagem de boas-vindas */}
          {/* Mensagem de boas-vindas removida conforme solicitado */}
          
          <div className="w-full flex flex-row flex-wrap gap-2">
            <div className="w-2/5">
              <h1>Nome<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  className={`w-full border-none outline-none ${userFound ? 'bg-[#f9f9f9]' : ''}`}
                  placeholder="Digite seu nome..."
                />
              </div>
            </div>
            <div className="w-2/5">
              <h1>Email<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full border-none outline-none ${userFound ? 'bg-[#f9f9f9]' : ''}`}
                  placeholder="Digite seu email..."
                />
              </div>
            </div>
            <div className="w-2/5">
              <h1>CPF<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={handleCpfChange} 
                  className="w-full border-none outline-none"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            <div className="w-1/2">
              <h1>Celular com DDD<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="celular" 
                  value={formData.celular} 
                  onChange={handleCelularChange} 
                  className="w-full border-none outline-none"
                  placeholder="(XX) 00000-0000"
                />
              </div>
            </div>
            <div className="w-1/2">
              <h1>CEP<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="cep" 
                  value={formData.cep} 
                  onChange={handleCepChange} 
                  className="w-full border-none outline-none"
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
            </div>
            <div className="w-3/4">
              <h1>Logradouro<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="logradouro" 
                  value={formData.logradouro} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none"
                  placeholder="Digite aqui seu endereço..."
                />
              </div>
            </div>
            <div className="w-1/6">
              <h1>Número<span className="text-red-700">*</span></h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="numero" 
                  value={formData.numero} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none"
                  placeholder="123,12A,13B..."
                />
              </div>
            </div>
            <div className="w-3/4">
              <h1>Complemento</h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="complemento" 
                  value={formData.complemento} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none"
                  placeholder="Apto, Bloco, etc..."
                />
              </div>
            </div>
            <div className="w-1/6">
              <h1>Estado</h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <select 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none appearance-none bg-transparent"
                >
                  <option value="">Selecione</option>
                  {estados.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
            <div className="w-2/5">
              <h1>Cidade</h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="cidade" 
                  value={formData.cidade} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none"
                  placeholder="Digite sua cidade..."
                />
              </div>
            </div>
            <div className="w-1/2">
              <h1>Bairro</h1>
              <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                <input 
                  type="text" 
                  name="bairro" 
                  value={formData.bairro} 
                  onChange={handleChange} 
                  className="w-full border-none outline-none"
                  placeholder="Digite seu bairro..."
                />
              </div>
            </div>
          </div>  
        </>
      )}

      <div className="flex justify-end items-center mt-4 gap-2">
        <button
          className="w-36 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50"
          onClick={() => {
            console.log("Form Data:", formData);
            onNext(formData);
          }}
        >
          Avançar
        </button>
      </div>
    </div>
  );
}

export default ClientInfoForm;