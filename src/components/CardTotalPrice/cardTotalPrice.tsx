import { useEffect, useState } from 'react';
import Image from "next/image";
import anunciaLogo from '../../../public/anuncIALogo.png';

interface CardTotalPriceProps {
    planData: {
        planName?: string;
        planAmount?: number;
        discount?: number;
        planInterval?: string;
    };
}

const CardTotalPrice: React.FC<CardTotalPriceProps> = ({ planData }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Mark that we're on the client side
    }, []);

    if (!isClient || !planData || !planData.planName) {
        return null; // Optionally return null or a loading spinner while waiting for the client-side render
    }

    const getBackgroundGradient = (planName: string) => {
        if (planName.includes('Ouro')) {
            return 'linear-gradient(135deg, #AE8625, #F7EF8A, #D2AC47, #EDC967)'; // Gradiente de ouro
        } else if (planName.includes('Prata')) {
            return 'linear-gradient(135deg, #C0C0C0, #E0E0E0, #A9A9A9, #D3D3D3)'; // Gradiente de prata
        } else if (planName.includes('Bronze')) {
            return 'linear-gradient(135deg, #CD7F32, #D8B384, #A97142, #C88F65)'; // Gradiente de bronze
        } else {
            return 'linear-gradient(135deg, #F6F7F9, #FFFFFF)'; // Gradiente padrão
        }
    };

    const backgroundGradient = getBackgroundGradient(planData.planName);
    const discountedAmount = planData.planInterval === 'year' ? planData.planAmount! * 0.5 : planData.planAmount!;

    return (
        <div className="">
            <div className="m-3 w-72 h-96 rounded-lg border border-black border-opacity-25 flex flex-col items-center justify-around">
                <div className="rounded-2xl w-48 p-4" style={{ background: backgroundGradient }}>
                    <Image className="w-full h-full" src={anunciaLogo} alt="logo_product" />
                </div>
                <div className="flex flex-col items-center border border-black border-opacity-25 w-3/4 rounded-t-2xl">
                    <h1 className="my-3 font-black text-xl">Meu Pedido</h1>
                    <table className="bg-white w-full font-normal border-collapse">
                        <thead>
                            <tr>
                                <th className="font-normal border border-black border-opacity-25">Produto</th>
                                <th className="font-normal border border-black border-opacity-25">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-normal text-sm text-center py-5 border border-black border-opacity-25">
                                    {planData.planName} <span className="font-bold">1x</span>
                                </td>
                                <td className="font-normal text-sm text-center border border-black border-opacity-25">
                                    R$ {((planData.planAmount ?? 0) / 100).toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                            {planData.planInterval === 'year' && (
                                <tr>
                                    <td className="font-normal text-sm text-center py-5 border border-black border-opacity-25">
                                        Desconto
                                    </td>
                                    <td className="font-normal text-sm text-center border border-black border-opacity-25">
                                        -50%
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td className="font-bold text-sm text-center border border-black border-opacity-25">
                                    Total
                                </td>
                                <td className="text-sm text-center border border-black border-opacity-25">
                                    R$ {(discountedAmount / 100).toFixed(2).replace('.', ',')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CardTotalPrice;
