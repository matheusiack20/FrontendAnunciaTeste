'use client';

import React, { useEffect } from 'react';
import ConfigLayoutPage from "@/components/configLayoutPage/page";
import SecurityAccountProfile from "@/components/securityAccountProfile/securityAccountProfile";
import UserProfileInfo from '@/components/userProfileInfo/userProfileInfo';
import ActiveConnectionProfile from '@/components/activeConnectionProfile/activeConnectionProfile';

const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
          {children}
      </div>
    );
};

const ContentPageUserAccount: React.FC = () => {
    // Adicionar efeito para salvar dados do usuário para uso no checkout
    useEffect(() => {
        // Esta função salva os dados do usuário da página de conta para uso no checkout
        const saveUserDataForCheckout = () => {
            // Verificar se está no navegador
            if (typeof window === 'undefined') return;
            
            try {
                // Tentar obter dados do usuário a partir do localStorage
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        // Salvar na sessionStorage para uso no checkout
                        const parsedUser = JSON.parse(userData);
                        sessionStorage.setItem('accountUserData', JSON.stringify(parsedUser));
                        console.log('Dados do usuário salvos para checkout:', parsedUser);
                    } catch (e) {
                        console.error('Erro ao processar dados do usuário:', e);
                    }
                }
            } catch (error) {
                console.error('Erro ao salvar dados do usuário para checkout:', error);
            }
        };
        
        // Executar a função quando o componente montar
        saveUserDataForCheckout();
    }, []);
    
    return (
      <div id="user-account" className="h-full w-full flex justify-center">
          <div className="w-3/5">
              <div className="border-b-[1px] border-black mb-[25px] pb-[25px] border-opacity-30">
                  <h1 className="text-[20px] font-sans font-medium">Conta do Usuário</h1>
                  <h2 className="mt-3 text-[16px]">Gerencie as informações da sua conta.</h2>
              </div>
              {/* Adiciona o componente UserProfileInfo */}
              <UserProfileInfo />
              <SectionWrapper>
                  <ActiveConnectionProfile />
              </SectionWrapper>
              <SecurityAccountProfile />
          </div>
      </div>
    );
};

const UserAccount: React.FC = () => {
    return (
      <ConfigLayoutPage content={<ContentPageUserAccount />} />
    );
};

export default UserAccount;