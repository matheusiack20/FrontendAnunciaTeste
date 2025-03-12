"use client"
import React, { useState, useEffect } from 'react';
import PlanPriceCard from './plansCards';
import axios from 'axios';
import {assinouPlanoEspecialistaAnual,assinouPlanoEspecialistaMensal,assinouPlanoInicianteAnual,assinouPlanoInicianteMensal,assinouPlanoProAnual,assinouPlanoProMensal} from '../../../trackingMeta';

const PlansPriceBoard: React.FC = () => {
    const [checked, setChecked] = useState<boolean>(true); // Inicialize como true para que o anual apareça primeiro
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Define default plans as fallback
                const defaultPlans = [
                    { name: 'Iniciante', amount: 5770, interval: 'month', intervalCount: 1, description: 'Plano Iniciante Mensal: Ideal para iniciantes' },
                    { name: 'Iniciante', amount: 4770, interval: 'year', intervalCount: 1, description: 'Plano Iniciante Anual: Economize mais', finalAmount: 9540 },
                    { name: 'Especialista', amount: 28440, interval: 'month', intervalCount: 1, description: 'Plano Especialista Mensal: Para usuários intermediários' },
                    { name: 'Especialista', amount: 28440, interval: 'year', intervalCount: 1, description: 'Plano Especialista Anual: Melhor custo-benefício', finalAmount: 47400 },
                    { name: 'Pro', amount: 46890, interval: 'month', intervalCount: 1, description: 'Plano Pro Mensal: Para usuários avançados' },
                    { name: 'Pro', amount: 46890, interval: 'year', intervalCount: 1, description: 'Plano Pro Anual: Máxima economia', finalAmount: 78140 },
                ];

                try {
                    // Attempt to fetch plans from API
                    const response = await axios.get('https://api.mapmarketplaces.com/api/plans');
                    
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        console.log('Plans fetched successfully:', response.data);
                        setPlans(response.data);
                    } else {
                        console.log('API returned empty or invalid data, using default plans');
                        setPlans(defaultPlans);
                    }
                } catch (apiError) {
                    console.error('Error fetching plans from API:', apiError);
                    console.log('Using default plans as fallback');
                    setPlans(defaultPlans);
                }
            } catch (error) {
                console.error('Error in fetchPlans function:', error);
                setError('Falha ao carregar os planos. Por favor, tente novamente mais tarde.');
                
                // Still set default plans as fallback even if there's an error
                const defaultPlans = [
                    { name: 'Iniciante', amount: 5770, interval: 'month', intervalCount: 1, description: 'Plano Iniciante Mensal: Ideal para iniciantes' },
                    { name: 'Iniciante', amount: 4770, interval: 'year', intervalCount: 1, description: 'Plano Iniciante Anual: Economize mais', finalAmount: 9540 },
                    { name: 'Especialista', amount: 28440, interval: 'month', intervalCount: 1, description: 'Plano Especialista Mensal: Para usuários intermediários' },
                    { name: 'Especialista', amount: 28440, interval: 'year', intervalCount: 1, description: 'Plano Especialista Anual: Melhor custo-benefício', finalAmount: 47400 },
                    { name: 'Pro', amount: 46890, interval: 'month', intervalCount: 1, description: 'Plano Pro Mensal: Para usuários avançados' },
                    { name: 'Pro', amount: 46890, interval: 'year', intervalCount: 1, description: 'Plano Pro Anual: Máxima economia', finalAmount: 78140 },
                ];
                setPlans(defaultPlans);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleToggle = () => {
        setChecked(!checked);
    };

    const handleSubscribe = async (plan: any) => {
        try {
            console.log('Tentando criar plano com os seguintes dados:', plan);
            
            // Determine appropriate values
            const finalAmount = checked ? (plan.finalAmount || plan.amount) : plan.amount;
            const interval = checked ? 'year' : 'month';
            const intervalCount = 1;
            
            console.log('Dados do plano que serão enviados para a API:', {
                name: plan.name,
                amount: finalAmount,
                interval,
                intervalCount
            });
            
            const response = await axios.post('https://api.mapmarketplaces.com/api/plans/create', {
                name: plan.name,
                amount: finalAmount,
                interval,
                intervalCount
            });

            if (response.status === 404) {
                console.error('API endpoint not found');
                alert('API endpoint not found. Please check the URL or try again later.');
                return;
            }
            
            // Track subscription events
            switch (plan.name) {
                case 'Iniciante':
                    if (checked) {
                        assinouPlanoInicianteAnual();
                    } else {
                        assinouPlanoInicianteMensal();
                    }
                    break;
                case 'Especialista':
                    if (checked) {
                        assinouPlanoEspecialistaAnual();
                    } else {
                        assinouPlanoEspecialistaMensal();
                    }
                    break;
                case 'Pro': 
                    if (checked) {
                        assinouPlanoProAnual();
                    } else {
                        assinouPlanoProMensal();
                    }
                    break;
            }
            
            const planId = response.data.plan.id;
            console.log('Plan ID:', planId);

            // Generate token ID for the selected plan
            const tokenResponse = await axios.post('https://api.mapmarketplaces.com/api/tokens/generate', {
                planId: planId,
                planName: plan.name,
                planAmount: finalAmount,
                planInterval: interval,
                planIntervalCount: intervalCount,
                planDescription: plan.description || ''
            });

            if (tokenResponse.status === 404) {
                console.error('Token generation endpoint not found');
                alert('Token generation endpoint not found. Please check the URL or try again later.');
                return;
            }

            const tokenId = tokenResponse.data.tokenId;
            console.log('Token ID:', tokenId);
            
            // Redirect to checkout with token ID
            window.location.href = `/checkout?tokenId=${tokenId}`;
        } catch (error) {
            console.error('Erro ao criar plano:', error);
            const errorMessage = (error as any).response?.data || (error as any).message;
            console.error('Detalhes do erro:', errorMessage);
            alert('Erro ao criar plano. Por favor, tente novamente.');
        }
    };

    // Filter plans based on the selected mode (annual or monthly)
    const filteredPlans = plans.filter(plan => {
        if (!plan || !plan.interval) {
            console.log('Plano inválido ou sem propriedade interval:', plan);
            return false;
        }
        
        // Filter based on interval
        return checked ? 
            (plan.interval === 'year' || plan.interval === 'yearly' || plan.interval === 'anual') : 
            (plan.interval === 'month' || plan.interval === 'monthly' || plan.interval === 'mensal');
    });

    console.log('Planos filtrados:', filteredPlans);
    console.log('Modo selecionado:', checked ? 'Anual' : 'Mensal');

    return (
        <section className='flex flex-col items-center'>
            <div id='toggle-switch-plans'
                className={`select-none text-[18px] border border-[#dafd00] relative flex w-72 h-16 rounded-full cursor-pointer transition-colors duration-300 bg-[#282828]`}
                onClick={handleToggle}
            >
                <div className="z-10 flex-1 flex items-center justify-center mr-3">
                    <div className='flex items-center'>
                        <span className={`font-bold transition-colors ${!checked ? 'text-white' : 'text-black'}`}>Anual</span>
                        <div className='font-bold ml-2 text-[12px] bg-green-600 rounded-sm p-[1.5px] text-white'>
                            50% off
                        </div>
                    </div>
                </div>
                <div className="z-10 flex-1 flex items-center justify-center text-black">
                    <span className={`font-bold transition-colors ${checked ? 'text-white' : 'text-black'}`}>Mensal</span>
                </div>
                <div
                    className={`absolute top-1 left-0 h-14 bg-[#dafd00] rounded-full transform transition-all duration-300 ${
                        checked ? 'w-32 translate-x-2' : 'w-36 translate-x-[140px]'
                    }`}
                />
            </div>
            <div id='my-plans-board' className='mt-8 flex flex-wrap justify-center'>
                {loading ? (
                    <p>Carregando planos...</p>
                ) : error ? (
                    <p>Erro: {error}</p>
                ) : filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => {
                        const monthlyPrice = plan.amount;
                        const annualPrice = plan.finalAmount || plan.amount;

                        return (
                            <PlanPriceCard
                                key={plan.name + (plan.description || '') + (checked ? 'anual' : 'mensal')}
                                isCheckedAnualMode={checked}
                                name={plan.name}
                                price={checked ? annualPrice : monthlyPrice}
                                discount={checked ? 50.00 : 0}
                                benefits={plan.description || `Descrição de teste para ${plan.name}`}
                                onSubscribe={() => handleSubscribe(plan)}
                            />
                        );
                    })
                ) : (
                    <p>Nenhum plano disponível para esta modalidade</p>
                )}
            </div>
        </section>
    );
}

export default PlansPriceBoard;