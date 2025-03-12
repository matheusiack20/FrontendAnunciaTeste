'use client';
import GenerateTitleAndDescription from '@/components/generateInfos/GenerateTitleAndDescription';
import RegisterNewProduct from '@/components/blingForm/RegisterNewProduct';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { BlingContextProvider } from '@/context/blingContext';
import OlistRegisterNewProduct from '@/components/olistForm/OlistRegisterNewProduct';
import { OlistContextProvider } from '@/context/olistContext';

export default function Home() {
  const [selectedErp, setSelectedErp] = useState('');
  const [step, setStep] = useState(1);
  const [clientInfo, setClientInfo] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const erpFromLocalStorage = localStorage.getItem('selectedErp');
      setSelectedErp(erpFromLocalStorage || '');
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const olistAccessToken = urlParams.get('olistAccessToken');
    const olistRefreshToken = urlParams.get('olistRefreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    } else if (olistAccessToken && olistRefreshToken) {
      localStorage.setItem('olistAccessToken', olistAccessToken);
      localStorage.setItem('olistRefreshToken', olistRefreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  const handleNext = (data: any) => {
    if (step === 1) {
      setClientInfo(data);
    } else if (step === 2) {
      setPaymentInfo(data);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <>
      <Header selectedErp={selectedErp} setSelectedErp={setSelectedErp} />
      <div className="p-6 max-w-4xl mx-auto">
        <GenerateTitleAndDescription />
        {selectedErp === 'bling' ? (
          <BlingContextProvider>
            <RegisterNewProduct />
          </BlingContextProvider>
          ) : selectedErp === 'olist' ? (
            <OlistContextProvider>
              <OlistRegisterNewProduct />
            </OlistContextProvider>
          ) : (
            <p className='text-red-500'>Por favor, selecione um ERP.</p>
          )}
      </div>
    </>
  );
}