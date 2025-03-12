import React, { useEffect, useState } from 'react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Image from 'next/image';

// Importação de imagens das bandeiras
const cartao_visa = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_visa.png';
const cartao_mastercard = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_Mastercard.png';
const cartao_amex = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_American_Express.png';
const cartao_elo = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_elo.png';
const cartao_hipercard = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_hipercard.png';
const cartao_jcb = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_jcb.png';
const cartao_diners = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_Diners.png';
const cartao_discover = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_discover.png';
const cartao_hiper = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_hiper.png';
const cartao_cabal = 'https://pub-89239b4811024aaaa4f192425e55f28a.r2.dev/logo_cabal.png';

type CardType = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'jcb' | 'diners' | 'discover' | 'hiper' | 'cabal';

const bandeiras: { [key in CardType]: string } = {
    visa: cartao_visa,
    mastercard: cartao_mastercard,
    amex: cartao_amex,
    elo: cartao_elo,
    hipercard: cartao_hipercard,
    jcb: cartao_jcb,
    diners: cartao_diners,
    discover: cartao_discover,
    hiper: cartao_hiper,
    cabal: cartao_cabal
};

interface ReviewPaymentInfoProps {
    onNext: () => void;
    onBack: () => void;
}

const ReviewPaymentInfo: React.FC<ReviewPaymentInfoProps> = ({ onNext, onBack }) => {
    const [clientInfo, setClientInfo] = useState(() => {
        const savedData = sessionStorage.getItem('clientInfoForm');
        return savedData ? JSON.parse(savedData) : {};
    });

    const [paymentInfo, setPaymentInfo] = useState(() => {
        const savedData = sessionStorage.getItem('creditCardInfoForm');
        return savedData ? JSON.parse(savedData) : {};
    });

    const [bandeira, setBandeira] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const cardType = getCardType(paymentInfo.numeroCartao);
        setBandeira(cardType ? bandeiras[cardType] : null);
    }, [paymentInfo]);

    const getCardType = (number: string): CardType | '' => {
        const patterns: { [key in CardType]: RegExp } = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            diners: /^3(?:0[0-5]|[68])/,
            discover: /^6(?:011|5)/,
            jcb: /^(?:2131|1800|35)/,
            hipercard: /^(606282|3841)/,
            elo: /^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363|6504|6505|6506|6507|6509|6516|6550|6551|6552)/,
            hiper: /^38/,
            cabal: /^58/
        };

        for (const [card, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) {
                return card as CardType;
            }
        }
        return '';
    };

    const handleNext = async () => {
        setIsLoading(true);
        try {
            const response = await processPayment(paymentInfo); // Supondo que processPayment é a função que faz a chamada à API de pagamento
            if (response.status === 'refused') {
                if (response.refuse_reason) {
                    handleRefusal(response.refuse_reason);
                } else {
                    alert('Pagamento recusado: Motivo desconhecido.');
                }
            } else if (response.status === 'analyzing') {
                alert('Pagamento em análise. Por favor, aguarde a confirmação.');
                onNext();
            } else {
                onNext();
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            // Tratar erro genérico
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefusal = (reason: string) => {
        switch (reason) {
            case 'insufficient_funds':
                alert('Pagamento recusado: Fundos insuficientes.');
                break;
            case 'expired_card':
                alert('Pagamento recusado: Cartão expirado.');
                break;
            case 'acquirer':
                alert('Pagamento recusado: Problema com o adquirente.');
                break;
            case 'antifraud':
                alert('Pagamento recusado: Suspeita de fraude.');
                break;
            default:
                alert('Pagamento recusado: Motivo desconhecido.');
                break;
        }
    };

    return (
        <div className='gap-1 flex flex-col'>
            <div className="w-full border rounded-xl h-auto p-2 py-3 flex justify-between items-center">
                <div>
                    <h1 className="font-bold mb-2">Identificação</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col text-xs">
                            <span>Nome: {clientInfo.nome}</span>
                            <span>Email: {clientInfo.email}</span>
                            <span>CPF: {clientInfo.cpf}</span>
                            <span>Celular: {clientInfo.celular}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <InsertEmoticonIcon className='text-5xl mr-10' />
                </div>
            </div>
            <div className="w-full border rounded-xl h-auto p-2 py-3 flex justify-between items-center">
                <div>
                    <h1 className="font-bold mb-2">Endereço de Cobrança</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col text-xs">
                            <span>CEP: {clientInfo.cep}</span>
                            <span>Logradouro: {clientInfo.logradouro}</span>
                            <span>Número: {clientInfo.numero}</span>
                            <span>Complemento: {clientInfo.complemento}</span>
                            <span>Bairro: {clientInfo.bairro}</span>
                            <span>Cidade: {clientInfo.cidade} - {clientInfo.estado}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <AttachMoneyIcon className='text-5xl mr-10' />
                </div>
            </div>
            <div className="w-full border rounded-xl h-auto p-2 py-3 flex justify-between items-center">
                <div>
                    <h1 className="font-bold mb-2">Pagamento</h1>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col text-xs">
                            <span>Nome do Titular: {paymentInfo.nomeTitular}</span>
                            <span>Número do Cartão: **** **** **** {paymentInfo.numeroCartao.slice(-4)}</span>
                            <span>Validade: {paymentInfo.validade}</span>
                        </div>
                    </div>
                </div>
                <div>
                    {bandeira ? <Image src={bandeira} alt="Bandeira do Cartão" className="h-12 ml-2 mr-10" width={48} height={48} style={{ objectFit: 'contain' }} /> : <CreditCardIcon className='text-5xl mr-10' />}
                </div>
            </div>
            <div className="flex justify-between mt-4">
                <button onClick={onBack} className="bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#464647] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">Voltar</button>
                <button onClick={handleNext} className="bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50" disabled={isLoading}>
                    {isLoading ? 'Carregando...' : 'Finalizar Compra'}
                </button>
            </div>
        </div>
    );
}

async function processPayment(paymentInfo: any) {
    // Simulate an API call to process the payment
    return new Promise<{ status: string, refuse_reason?: string }>((resolve) => {
        setTimeout(() => {
            // Simulate different responses based on card number for demonstration purposes
            if (paymentInfo.numeroCartao.endsWith('1')) {
                resolve({ status: 'refused', refuse_reason: 'insufficient_funds' });
            } else if (paymentInfo.numeroCartao.endsWith('2')) {
                resolve({ status: 'refused', refuse_reason: 'expired_card' });
            } else if (paymentInfo.numeroCartao.endsWith('3')) {
                resolve({ status: 'refused', refuse_reason: 'acquirer' });
            } else if (paymentInfo.numeroCartao.endsWith('4')) {
                resolve({ status: 'refused', refuse_reason: 'antifraud' });
            } else if (paymentInfo.numeroCartao.endsWith('5')) {
                resolve({ status: 'analyzing' });
            } else {
                resolve({ status: 'approved' });
            }
        }, 2000); // Simulate network delay
    });
}

export default ReviewPaymentInfo;