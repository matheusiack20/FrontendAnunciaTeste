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
import './page.css'; // Adicione esta linha para importar o CSS

const steps = ['Identificação', 'Pagamento', 'Finalizar compra'];

const Checkout = () => {
  const [selectedErp, setSelectedErp] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean, message: string, status?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [planData, setPlanData] = useState<any>({});
  const [clientInfo, setClientInfo] = useState<any>({});
  const [cardId, setCardId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const erpFromLocalStorage = localStorage.getItem('selectedErp');
      setSelectedErp(erpFromLocalStorage || '');
    }
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
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      const errorMessage = (error as any).response?.data || (error as any).message;
      console.error('Detalhes do erro:', errorMessage);
    }
  };

  const handleCreateCard = async (formData: any) => {
    try {
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

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/customers/${clientInfo.customerId}/cards/create`, {
        card_number: formData.numeroCartao.replace(/\s/g, ''),
        card_holder_name: formData.nomeTitular,
        exp_month: exp_month,
        exp_year: `20${exp_year}`, // Adicione o prefixo "20" ao ano
        card_cvv: formData.cvv,
        billing_address: billingAddress
      });
      const cardId = response.data.card.id;
      console.log('Card ID:', cardId); // Adicione este log
      setCardId(cardId);
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      console.error('Erro ao criar cartão:', error);
      const errorMessage = (error as any).response?.data || (error as any).message;
      console.error('Detalhes do erro:', errorMessage);

      // Tratamento de recusas reais baseadas no refuse_reason
      if ((error as any).response && (error as any).response.data && (error as any).response.data.refuse_reason) {
        const axiosError = error as any;
        switch (axiosError.response.data.refuse_reason) {
          case 'insufficient_funds':
            setStatusMessage({ success: false, message: 'Fundos insuficientes. Por favor, verifique seu saldo e tente novamente.', status: 'insufficient_funds' });
            break;
          case 'expired_card':
            setStatusMessage({ success: false, message: 'Cartão expirado. Por favor, use um cartão válido.', status: 'expired_card' });
            break;
          case 'acquirer':
            setStatusMessage({ success: false, message: 'Erro no adquirente. Por favor, tente novamente mais tarde.', status: 'acquirer' });
            break;
          case 'antifraud':
            setStatusMessage({ success: false, message: 'Transação recusada por suspeita de fraude. Por favor, entre em contato com o suporte.', status: 'antifraud' });
            break;
          default:
            setStatusMessage({ success: false, message: 'Erro ao criar cartão. Por favor, tente novamente.', status: (error as any).response.data.refuse_reason });
        }
      } else {
        setStatusMessage({ success: false, message: 'Erro ao criar cartão. Por favor, tente novamente.', status: JSON.stringify(errorMessage) });
      }
    }
  };

  const handleFinalizePurchase = async () => {
    try {
      setLoading(true); // Inicie a animação de carregamento

      let finalAmount = planData.planAmount || 0; // Certifique-se de enviar o valor correto
      if (planData.planInterval === 'year') {
        finalAmount = finalAmount * 0.5; // Aplicar desconto de 50% para planos anuais
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/subscriptions/create`, {
        customerId: clientInfo.customerId,
        planId: planData.planId,
        cardId: cardId,
        finalAmount: finalAmount,
        planName: planData.planName // Certifique-se de enviar o nome do plano correto
      });

      console.log('Resposta da API ao criar assinatura:', response.data);
      const orderId = response.data.orderId;
      const chargeId = response.data.chargeId;
      const status = response.data.status || 'Status indefinido';

      if (!orderId) {
        console.error('Order ID não definido na resposta da API');
      }

      console.log('Order ID:', orderId);
      console.log('Charge ID:', chargeId);
      console.log('Status:', status);

      if (status === 'analyzing') {
        setStatusMessage({ success: true, message: 'Pagamento em análise. Por favor, aguarde a confirmação.', status: status });
      } else {
        setStatusMessage({ success: true, message: 'Assinatura criada com sucesso!', status: status });
      }

      setTimeout(() => {
        setLoading(false); // Pare a animação de carregamento
        setActiveStep((prev) => prev + 1);
      }, 5000);
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      const errorMessage = (error as any).response?.data || (error as any).message;
      console.error('Detalhes do erro:', errorMessage);

      // Tratamento de recusas reais baseadas no refuse_reason
      if ((error as any).response && (error as any).response.data && (error as any).response.data.refuse_reason) {
        const axiosError = error as any;
        switch (axiosError.response.data.refuse_reason) {
          case 'insufficient_funds':
            setStatusMessage({ success: false, message: 'Fundos insuficientes. Por favor, verifique seu saldo e tente novamente.', status: 'insufficient_funds' });
            break;
          case 'expired_card':
            setStatusMessage({ success: false, message: 'Cartão expirado. Por favor, use um cartão válido.', status: 'expired_card' });
            break;
          case 'acquirer':
            setStatusMessage({ success: false, message: 'Erro no adquirente. Por favor, tente novamente mais tarde.', status: 'acquirer' });
            break;
          case 'antifraud':
            setStatusMessage({ success: false, message: 'Transação recusada por suspeita de fraude. Por favor, entre em contato com o suporte.', status: 'antifraud' });
            break;
          default:
            setStatusMessage({ success: false, message: 'Erro ao criar assinatura. Por favor, tente novamente.', status: (error as any).response.data.refuse_reason });
        }
      } else {
        setStatusMessage({ success: false, message: 'Erro ao criar assinatura. Por favor, tente novamente.', status: JSON.stringify(errorMessage) });
      }

      setTimeout(() => {
        setLoading(false); // Pare a animação de carregamento
        setActiveStep((prev) => prev + 1);
      }, 5000);
    }
  };

  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <ClientInfoForm onNext={handleNext} />;
      case 1:
        return <CreditCardInfo onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ReviewPaymentInfo onNext={handleNext} onBack={handleBack} />;
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
                <p className="text-xl mt-4">Processando...</p>
              </div>
            ) : statusMessage ? (
              statusMessage.success ? (
                <>
                  <CheckCircleIcon className="text-green-500 animate-bounce" style={{ fontSize: 80 }} />
                  <p className="text-green-500 text-xl mt-4">{statusMessage.message}</p>
                  {statusMessage.status === 'approved' && (
                    <a href="https://www.exemplo.com" className="mt-4 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                      Acessar
                    </a>
                  )}
                </>
              ) : (
                <>
                  <CancelIcon className="text-red-500 animate-shake" style={{ fontSize: 80 }} />
                  <p className="text-red-500 text-xl mt-4">{statusMessage.message}</p>
                  <p className="text-red-500 text-xl mt-4">Status: {statusMessage.status}</p>
                </>
              )
            ) : null}
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
                {renderStepComponent()}
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
