'use client';

import React from 'react';
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