'use client';

import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import BlingLogo from '../ApisAuthConnect/blingAuthConnect/blingLogo';
import { OlistLogo } from '../ApisAuthConnect/OlistAuthConnect/OlistLogo';
import Image from 'next/image';
import anunciaLogo from '/public/anuncIALogo.png'
import AccountMenu from './UserMenu';

interface HeaderProps {
  selectedErp: string;
  setSelectedErp: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedErp, setSelectedErp }) => {
  const [erpOptions, setErpOptions] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const blingToken = localStorage.getItem('accessToken');
      const olistToken = localStorage.getItem('olistAccessToken');

      const options = [];
      if (blingToken) {
        options.push(
          <option key="bling" value="bling">
            Bling
          </option>,
        );
      }
      if (olistToken) {
        options.push(
          <option key="olist" value="olist">
            Olist
          </option>,
        );
      }

      setErpOptions(options);
    }
  }, []);

  const handleErpChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedErp(selectedValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedErp', selectedValue);
    }
  };

  const renderErpLogos = () => {
    switch (selectedErp) {
      case 'bling':
        return <BlingLogo />;
      case 'olist':
        return <OlistLogo />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.header}>
      <Link href="/">
        <Image className={styles.logoAnuncia} src={anunciaLogo} alt="" priority/>
      </Link>
      <div className='flex gap-5'>
        <Link href="/" className={styles.buttons}>
          Criar Produto
        </Link>
        <Link href="/connections" className={styles.buttons}>
          Conexões
        </Link>
      </div>
      <div className={`${styles.erpSelectContainer} border border-gray-300 rounded-md`}>
        {renderErpLogos()}
        <select
          required
          onChange={handleErpChange}
          value={selectedErp}
          className="flex h-10 w-full items-center justify-between bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer"
        >
          <option value="" disabled>
            HUBs
          </option>
          {erpOptions}
        </select>
      </div>
      <AccountMenu/>
    </div>
  );
};

export default Header;
