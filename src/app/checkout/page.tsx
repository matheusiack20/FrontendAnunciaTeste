'use client'
import Header from "@/components/Header/Header";
import PaymentStepper from "@/components/PaymentStepper/paymentStepper";
import CardTotalPrice from "@/components/CardTotalPrice/cardTotalPrice";
import ClientInfoForm from "@/components/FormsPayment/clientInfoForm";
import { useState, useEffect } from "react";
import CreditCardInfo from "@/components/FormsPayment/creditCardInfoForm";
import ReviewPaymentInfo from "@/components/FormsPayment/ReviewPaymentForms";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchCurrentUser, getCurrentUserId } from '@/utils/auth';
import { getCheckoutUserData, clearCheckoutData } from '@/utils/userService'; // Importar novo serviço
import './page.css';

const steps = ['Identificação', 'Pagamento', 'Finalizar compra'];

// Verificar se está executando no navegador
const isBrowser = typeof window !== 'undefined';

// Função para obter o userId de múltiplas fontes
const getUserIdFromMultipleSources = () => {
  if (!isBrowser) return null;
  
  let userId = null;
  
  // Verificar em sessionStorage específico do checkout primeiro
  userId = sessionStorage.getItem('checkout_user_id');
  if (userId) {
    console.log('ID do usuário encontrado em checkout_user_id:', userId);
    return userId;
  }
  
  // Verificar no objeto user do localStorage
  try {
    const localStorageUser = localStorage.getItem('user');
    if (localStorageUser) {
      const userData = JSON.parse(localStorageUser);
      userId = userData.id || userData._id;
      if (userId) {
        console.log('ID do usuário encontrado em localStorage.user:', userId);
        return userId;
      }
    }
  } catch (e) {
    console.error('Erro ao verificar localStorage.user:', e);
  }
  
  // Verificar no objeto user do sessionStorage
  try {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      const userData = JSON.parse(sessionUser);
      userId = userData.id || userData._id;
      if (userId) {
        console.log('ID do usuário encontrado em sessionStorage.user:', userId);
        return userId;
      }
    }
  } catch (e) {
    console.error('Erro ao verificar sessionStorage.user:', e);
  }
  
  // Verificar accountUserData
  try {
    const accountData = sessionStorage.getItem('accountUserData');
    if (accountData) {
      const userData = JSON.parse(accountData);
      userId = userData.id || userData._id;
      if (userId) {
        console.log('ID do usuário encontrado em accountUserData:', userId);
        return userId;
      }
    }
  } catch (e) {
    console.error('Erro ao verificar accountUserData:', e);
  }
  
  // Verificar authUserData
  try {
    const authData = sessionStorage.getItem('authUserData');
    if (authData) {
      const userData = JSON.parse(authData);
      userId = userData.id || userData._id;
      if (userId) {
        console.log('ID do usuário encontrado em authUserData:', userId);
        return userId;
      }
    }
  } catch (e) {
    console.error('Erro ao verificar authUserData:', e);
  }
  
  // Buscar em localStorage por qualquer objeto que possa ter um id de usuário
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    if (key.includes('user') || key.includes('User') || key.includes('auth') || key.includes('Auth')) {
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        const data = JSON.parse(value);
        userId = data.id || data._id || data.userId || data.user?.id || data.user?._id;
        
        if (userId) {
          console.log(`ID do usuário encontrado em localStorage.${key}:`, userId);
          return userId;
        }
      } catch (e) {
        // Ignorar erros de parse
      }
    }
  }
  
  console.warn('Não foi possível obter ID do usuário de nenhuma fonte');
  return null;
};

const Checkout = () => {
  const [selectedErp, setSelectedErp] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean, message: string, status?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [planData, setPlanData] = useState<any>({});
  const [clientInfo, setClientInfo] = useState<any>({});
  const [cardId, setCardId] = useState<string | null>(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Função para carregar dados do usuário e configurar o checkout
    const setupCheckout = async () => {
      if (!isBrowser) return; // Retorna se não está executando no navegador
      
      try {
        console.log('Iniciando checkout e carregando dados de usuário logado...');
        
        // Obter dados do usuário logo no início para garantir que estejam disponíveis quando o formulário carregar
        const userData = await getCheckoutUserData();
        
        if (userData && (userData.nome || userData.email)) {
          console.log('Usuário autenticado para checkout:', userData);
          
          // Dados são salvos na sessão pelo próprio serviço getCheckoutUserData
          console.log('Dados preparados para o formulário de checkout');
        } else {
          console.log('Usuário não autenticado ou sem dados disponíveis');
          
          // Tenta buscar dados de outras fontes (localStorage, tokens, etc.)
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (token) {
            console.log('Token encontrado, verificando API para dados de usuário...');
            // O próprio serviço já tenta fazer isso, aqui só para garantir que estamos monitorando
          }
        }
        
        // Obter o ID do usuário atual para associar com a assinatura
        const currentUserId = getCurrentUserId();
        if (currentUserId) {
          console.log('ID do usuário para associação com plano:', currentUserId);
          setUserId(currentUserId);
        } else {
          console.log('Usuário não identificado, checkout continuará sem associação de plano');
        }
        
        // Carregar dados do ERP selecionado
        if (isBrowser) {
          const erpFromLocalStorage = localStorage.getItem('selectedErp');
          setSelectedErp(erpFromLocalStorage || '');
        }
      } catch (error) {
        console.error('Erro ao preparar checkout:', error);
      }
    };
    
    setupCheckout();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenId = query.get('tokenId');

    if (tokenId) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}api/tokens/${tokenId}`)
            .then(response => {
                const { planId, planName, planAmount, planInterval, planIntervalCount, planDescription } = response.data;
                setPlanData({
                    planId,
                    planName,
                    planAmount: parseInt(planAmount || '0', 10),
                    planInterval,
                    planIntervalCount: parseInt(planIntervalCount || '0', 10),
                    planDescription,
                });
                console.log('Plan Data:', response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do plano:', error);
            });
    }
}, []);

  useEffect(() => {
    // Limpar dados temporários quando sair da página
    return () => {
      if (isBrowser && activeStep === 3) {
        // Se completou o checkout, limpar os dados
        setTimeout(() => clearCheckoutData(), 5000);
      }
    };
  }, [activeStep]);

  const handleNext = async (formData?: any) => {
    console.log('handleNext called with formData:', formData); // Adicione este log
    if (activeStep === 0 && formData) {
      console.log('Form Data:', formData); // Adicione este log
      setClientInfo(formData); // Atualize clientInfo com formData
      await handleCreateCustomer(formData);
    } else if (activeStep === 1 && formData) {
      console.log('Credit Card Data:', formData); // Adicione este log
      await handleCreateCard(formData);
    } else if (activeStep === 2) {
      setLoading(true);
      await handleFinalizePurchase();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const handleCreateCustomer = async (formData: any) => {
    try {
      const billingAddress = {
        street: formData.logradouro,
        number: formData.numero,
        complement: formData.complemento,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        zipcode: formData.cep.replace(/\D/g, ''),
        country: 'BR'
      };

      console.log('Dados enviados para criar cliente:', {
        name: formData.nome,
        email: formData.email,
        document: formData.cpf.replace(/\D/g, ''),
        phone: formData.celular.replace(/\D/g, ''),
        billing_address: billingAddress
      });

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/customers/create`, {
        name: formData.nome,
        email: formData.email,
        document: formData.cpf.replace(/\D/g, ''),
        phone: formData.celular.replace(/\D/g, ''),
        billing_address: billingAddress
      });

      console.log('Resposta da API ao criar cliente:', response.data);

      const customerId = response.data.customer.id;
      console.log('Customer ID:', customerId);
      setClientInfo((prev: any) => ({ ...prev, customerId })); // Atualize clientInfo com customerId
      setActiveStep((prev) => prev + 1);
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      const errorMessage = error.response?.data || error.message;
      console.error('Detalhes do erro:', errorMessage);
    }
  };

  const handleCreateCard = async (formData: any) => {
    try {
      setLoading(true); // Adicionar indicador de carregamento ao processar o cartão
      
      // Verificação no frontend para CVV iniciado em 6 (simulação de recusa)
      if (formData.cvv && formData.cvv.startsWith('6')) {
        console.log('Detectado CVV iniciado com 6 - simulação de recusa');
        // Continuar com a requisição para demonstrar o fluxo de erro completo
      }
      
      const billingAddress = {
        street: clientInfo.logradouro,
        number: clientInfo.numero,
        complement: clientInfo.complemento,
        neighborhood: clientInfo.bairro,
        city: clientInfo.cidade,
        state: clientInfo.estado,
        zipcode: clientInfo.cep.replace(/\D/g, ''), // Certifique-se de que o campo zipcode está presente
        country: 'BR'
      };

      const [exp_month, exp_year] = formData.validade.split('/');

      console.log('Enviando dados do cartão para validação...');
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/customers/${clientInfo.customerId}/cards/create`, {
        card_number: formData.numeroCartao.replace(/\s/g, ''),
        card_holder_name: formData.nomeTitular,
        exp_month: exp_month,
        exp_year: `20${exp_year}`, // Adicione o prefixo "20" ao ano
        card_cvv: formData.cvv,
        billing_address: billingAddress
      });
      
      const cardId = response.data.card.id;
      console.log('Cartão validado com sucesso. Card ID:', cardId);
      setCardId(cardId);
      setLoading(false);
      setActiveStep((prev) => prev + 1);
    } catch (error: any) {
      setLoading(false);
      console.error('Erro ao criar cartão:', error);
      
      let errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido ao processar cartão';
      let errorStatus = error.response?.data?.status || 'error';
      
      console.error('Mensagem de erro:', errorMessage);

      // Tratamento específico para CVV iniciado em 6
      if (errorMessage.includes('emissor do cartão') || errorStatus === 'card_declined') {
        errorMessage = 'Pagamento recusado pelo emissor do cartão. Por favor, verifique os dados ou use outro cartão.';
        errorStatus = 'card_declined';
      }

      // Mostrar mensagem de erro para o usuário
      setStatusMessage({ 
        success: false, 
        message: errorMessage, 
        status: errorStatus 
      });
      
      // Não avançar para o próximo passo quando houver erro
    }
  };

  const handleFinalizePurchase = async () => {
    try {
      setLoading(true);
      setStatusMessage(null);
      
      // Sempre avançar para o último passo ao clicar em finalizar
      setTimeout(() => {
        setActiveStep(3);
      }, 300);
  
      // Validação completa dos dados antes de enviar
      if (!clientInfo.customerId) {
        throw new Error('ID do cliente não encontrado. Por favor, recarregue a página e tente novamente.');
      }
  
      if (!planData.planId) {
        throw new Error('ID do plano não encontrado. Por favor, recarregue a página e tente novamente.');
      }
  
      if (!cardId) {
        throw new Error('ID do cartão não encontrado. Por favor, tente novamente com um cartão válido.');
      }
  
      let finalAmount = planData.planAmount || 0; 
      
      // Garantir que finalAmount seja um número
      if (typeof finalAmount !== 'number') {
        finalAmount = parseInt(String(finalAmount).replace(/[^\d]/g, ''), 10);
        if (isNaN(finalAmount)) {
          throw new Error('Valor inválido para o plano');
        }
      }
      
      if (planData.planInterval === 'year') {
        finalAmount = finalAmount * 0.5; // Aplicar desconto de 50% para planos anuais
      }
      
      // Garantir que é um número inteiro
      finalAmount = Math.round(finalAmount);
  
      // Recuperar userId do estado ou de múltiplas fontes como último recurso
      const finalUserId = userId || getUserIdFromMultipleSources();
      
      if (!finalUserId) {
        console.warn('⚠️ Nenhum ID de usuário disponível para associar com a assinatura');
      } else {
        console.log('ID do usuário para associação com plano (final):', finalUserId);
      }

      console.log('Enviando payload:', {
        customerId: clientInfo.customerId,
        planId: planData.planId,
        cardId,
        finalAmount,
        planName: planData.planName,
        userId: finalUserId // Usar o ID final recuperado
      });
  
      try {
        console.log('Enviando payload:', {
          customerId: clientInfo.customerId,
          planId: planData.planId,
          cardId,
          finalAmount,
          planName: planData.planName,
          userId: finalUserId // Enviar ID do usuário para o backend
        });
  
        // Incluir todos os headers necessários e fazer retry automático
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/subscriptions/create`, 
          {
            customerId: clientInfo.customerId,
            planId: planData.planId,
            cardId,
            finalAmount,
            planName: planData.planName,
            userId: finalUserId // Enviar ID do usuário para o backend
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}` // Enviar token para ajudar a identificar o usuário
            },
            timeout: 30000, // Aumentar timeout para 30 segundos
          }
        );
  
        console.log('Resposta da API ao criar assinatura:', response.data);
        const orderId = response.data.orderId;
        const chargeId = response.data.chargeId;
        const status = response.data.status || 'Status indefinido';
  
        // Atualizar UI com base no status real retornado
        switch (status) {
          case 'success':
            setStatusMessage({ 
              success: true, 
              message: 'Pagamento aprovado e assinatura criada com sucesso!', 
              status: 'approved' 
            });
            // Limpar dados temporários após sucesso
            setTimeout(() => clearCheckoutData(), 2000);
            break;
          case 'analyzing':
            setStatusMessage({ 
              success: true, 
              message: 'Pagamento em análise anti-fraude. Você receberá um email quando for aprovado.', 
              status: 'analyzing' 
            });
            break;
          case 'processing':
            setStatusMessage({ 
              success: true, 
              message: 'Pagamento em processamento. Por favor, aguarde alguns instantes.', 
              status: 'processing' 
            });
            break;
          case 'payment_ok_subscription_pending':
            setStatusMessage({ 
              success: true, 
              message: 'Pagamento aprovado! Estamos finalizando sua assinatura, isso pode levar alguns minutos.', 
              status: 'processing' 
            });
            break;
          case 'subscription_exists':
            setStatusMessage({ 
              success: true, 
              message: 'Você já possui uma assinatura ativa. O pagamento foi processado com sucesso.', 
              status: 'approved' 
            });
            break;
          default:
            setStatusMessage({ 
              success: true, 
              message: response.data.message || 'Processamento realizado com sucesso!', 
              status: status 
            });
        }
  
        setTimeout(() => {
          setLoading(false);
          // Removido o avanço aqui, pois já avançamos no início da função
        }, 2000);
      } catch (axiosError: any) {
        console.error('Erro na requisição:', axiosError);
        
        // Log detalhado do erro
        if (axiosError.response) {
          console.error('Status do erro:', axiosError.response.status);
          console.error('Dados do erro:', JSON.stringify(axiosError.response.data, null, 2));
          console.error('Headers:', JSON.stringify(axiosError.response.headers, null, 2));
          
          // Verificar se é um erro específico do Pagar.me
          if (axiosError.response.data?.status === 'validation_error') {
            throw new Error(axiosError.response.data.message || 'Erro de validação nos dados de pagamento');
          }
          
          // Verificar se é um problema de cartão
          if (axiosError.response.data?.status === 'card_error' || 
              axiosError.response.data?.status === 'payment_refused') {
            throw new Error(axiosError.response.data.message || 'Erro no processamento do cartão. Por favor, use outro cartão.');
          }
        }
        
        // Se chegou aqui, é um erro genérico
        throw new Error('Erro na comunicação com o servidor. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro ao criar assinatura:', error);
      
      let errorMessage = 'Erro ao criar assinatura. Por favor, tente novamente.';
      let errorStatus = 'error';
      
      // Extrair mensagem de erro da resposta do servidor
      if (error.response && error.response.data) {
        console.error('Detalhes do erro:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
        errorStatus = error.response.data.status || 'error';
        
        // Log mais detalhados para debugging
        if (error.response.data.error) {
          console.log('Tipo de erro:', error.response.data.error);
        }
      }
      
      // Definir mensagens mais amigáveis baseadas no tipo de erro
      switch (errorStatus) {
        case 'card_error':
          errorMessage = errorMessage || 'Problema com o cartão. Verifique os dados e tente novamente.';
          break;
        case 'payment_refused':
          errorMessage = errorMessage || 'Pagamento recusado pela operadora. Por favor, use outro cartão.';
          break;
        case 'processing':
          errorMessage = errorMessage || 'Pagamento em processamento. Aguarde a confirmação.';
          break;
        case 'analyzing':
          errorMessage = errorMessage || 'Pagamento em análise. Aguarde a confirmação.';
          break;
        case 'insufficient_funds':
          errorMessage = 'Fundos insuficientes. Por favor, verifique seu saldo e tente novamente.';
          break;
        case 'expired_card':
          errorMessage = 'Cartão expirado. Por favor, use um cartão válido.';
          break;
        default:
          // Manter a mensagem de erro original se já estiver definida
          break;
      }
  
      setStatusMessage({ 
        success: false, 
        message: errorMessage, 
        status: errorStatus 
      });
  
      setTimeout(() => {
        setLoading(false); // Pare a animação de carregamento
      }, 1000);
      
      // Não fazemos nada aqui para manter o usuário no último step
    }
  };

  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <ClientInfoForm onNext={handleNext} />;
      case 1:
        return <CreditCardInfo onNext={handleNext} onBack={handleBack} />;
      case 2:
        return (
          <div className="w-full">
            <ReviewPaymentInfo onNext={handleFinalizePurchase} onBack={handleBack} />
            {statusMessage && !statusMessage.success && (
              <div className="mt-4 p-4 border border-red-500 rounded-md bg-red-50">
                <div className="flex items-center">
                  <CancelIcon className="text-red-500 mr-2" />
                  <p className="text-red-500">{statusMessage.message}</p>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="loader">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="text-xl mt-4">Processando pagamento e assinatura...</p>
              </div>
            ) : statusMessage ? (
              statusMessage.success ? (
                <>
                  <CheckCircleIcon className="text-green-500 animate-bounce" style={{ fontSize: 80 }} />
                  <p className="text-green-500 text-xl mt-4">{statusMessage.message}</p>
                  {statusMessage.status === 'approved' && (
                    <a href="/dashboard" className="mt-4 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                      Acessar minha conta
                    </a>
                  )}
                  {(statusMessage.status === 'analyzing' || statusMessage.status === 'processing') && (
                    <p className="text-gray-500 text-sm mt-4">
                      Você receberá um e-mail quando o processamento for concluído.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <CancelIcon className="text-red-500 animate-shake" style={{ fontSize: 80 }} />
                  <p className="text-red-500 text-xl mt-4">{statusMessage.message}</p>
                  <p className="text-gray-500 text-sm mt-2">Status: {statusMessage.status}</p>
                  <button
                    onClick={() => setActiveStep(1)} // Voltar para a etapa de cartão
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Tentar novamente com outro cartão
                  </button>
                </>
              )
            ) : (
              // Adicionamos um estado intermediário caso o usuário chegue aqui sem statusMessage
              <div className="flex flex-col items-center justify-center">
                <div className="loader">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                <p className="text-xl mt-4">Processando requisição...</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="checkout" className="animate-fade-in">
      <Header selectedErp={selectedErp} setSelectedErp={setSelectedErp} />
      <div className="my-14 w-full flex justify-center">
        <div className="bg-white text-black w-[900px] border-[#dafd00] border-4 rounded-2xl h-[650px] animate-slide-in">
          {activeStep < 3 && (
            <div className="w-full flex justify-between">
              <div className="w-3/5 ml-5">
                <PaymentStepper activeStep={activeStep} steps={steps}/>
                {loading && activeStep < 3 ? (
                  <div className="flex flex-col items-center justify-center mt-20">
                    <div className="loader">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                    <p className="text-xl mt-4">Processando...</p>
                  </div>
                ) : statusMessage && !statusMessage.success && activeStep === 1 ? (
                  <div className="mt-4 p-4 border border-red-500 rounded-md bg-red-50">
                    <div className="flex items-center">
                      <CancelIcon className="text-red-500 mr-2" />
                      <p className="text-red-500">{statusMessage.message}</p>
                    </div>
                    <button 
                      onClick={() => setStatusMessage(null)} 
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : (
                  renderStepComponent()
                )}
              </div>
              <div className="w-2/5">
                <CardTotalPrice planData={planData} />
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className="w-full flex justify-center items-center h-full">
              {renderStepComponent()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
