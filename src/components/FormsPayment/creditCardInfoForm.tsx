import React, { useState, useEffect } from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Image, { StaticImageData } from 'next/image';

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

interface CreditCardInfoProps {
    onNext: (formData: any) => void;
    onBack: () => void;
}

const CreditCardInfo: React.FC<CreditCardInfoProps> = ({ onNext, onBack }) => {
    const [formData, setFormData] = useState(() => {
        const savedData = sessionStorage.getItem('creditCardInfoForm');
        return savedData ? JSON.parse(savedData) : {
            nomeTitular: '', numeroCartao: '', validade: '', cvv: '', cupom: ''
        };
    });
    const [bandeira, setBandeira] = useState<string | null>(null);
    const [cvvLength, setCvvLength] = useState(3);

    useEffect(() => {
        sessionStorage.setItem('creditCardInfoForm', JSON.stringify(formData));
        const cardType = getCardType(formData.numeroCartao);
        setBandeira(cardType ? bandeiras[cardType] : null);
        setCvvLength(cardType === 'amex' ? 4 : 3);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'numeroCartao') {
            const cardType = getCardType(value);
            setBandeira(cardType ? bandeiras[cardType] : null);
            setCvvLength(cardType === 'amex' ? 4 : 3);
        }
    };

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

    const handleValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = e.target;
        if (value.length === 2 && !value.includes('/')) {
            value = value + '/';
        } else if (value.length === 3 && value.includes('/')) {
            value = value.slice(0, 2);
        }
        setFormData({ ...formData, validade: value });
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (/^\d*$/.test(value) && value.length <= cvvLength) {
            setFormData({ ...formData, cvv: value });
        }
    };

    return (
        <div className="w-full border rounded-xl h-auto p-2 py-3">
            <h1 className="font-bold mb-5">Pagamento</h1>
            <div className="w-full flex flex-row flex-wrap gap-2">
                <div className="w-2/5">
                    <h1>Nome do titular</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="nomeTitular" 
                            value={formData.nomeTitular} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite o nome do titular..."
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <h1>Número do Cartão</h1>
                    <div className="mt-2 p-1 w-full flex items-center justify-between whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="numeroCartao" 
                            value={formData.numeroCartao} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="0000 0000 0000 0000"
                        />
                        {bandeira ? <Image src={bandeira} alt="Bandeira do Cartão" className="h-6 ml-2" width={24} height={24} style={{ objectFit: 'contain' }} /> : <CreditCardIcon />}
                    </div>
                </div>
                <div className="w-2/5">
                    <h1>Validade</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="validade" 
                            value={formData.validade} 
                            onChange={handleValidadeChange} 
                            className="w-full border-none outline-none"
                            placeholder="MM/AA"
                            maxLength={5}
                        />
                    </div>
                </div>
                <div className="w-1/2">
                    <h1>CVV</h1>
                    <div className="mt-2 p-1 w-full flex items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="cvv" 
                            value={formData.cvv} 
                            onChange={handleCvvChange} 
                            className="w-full border-none outline-none"
                            placeholder="000"
                            maxLength={cvvLength}
                        />
                    </div>
                </div>
                <h1 className="w-full font-bold">Você possui cupom de desconto?</h1>
                <div className="w-1/2">
                    <div className="mt-2 p-1 w-full flex justify-between items-center whitespace-nowrap rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
                        <input 
                            type="text" 
                            name="cupom" 
                            value={formData.cupom} 
                            onChange={handleChange} 
                            className="w-full border-none outline-none"
                            placeholder="Digite o CUPOM"
                        />
                        <button
                            className="w-20 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50"
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
                <div className="w-full flex justify-end items-center mt-4 gap-2">
                    <button
                        className="w-36 bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#464647] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50"
                        onClick={onBack}
                    >
                        Voltar
                    </button>
                    <button
                        onClick={() => onNext(formData)}
                        className="w-36 bg-[#dafd00] text-black px-4 py-2 rounded-md hover:bg-[#979317] transition shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50"
                    >
                        Avançar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreditCardInfo;