'use client'

import React, {useEffect, useState} from 'react';
import Header from "@/components/Header/Header";
import AccountConfigMenu from "@/components/AccountConfigMenu/AccountConfigMenu";

interface ConfigLayoutPageProps {
  content: React.ReactNode;
}

const ConfigLayoutPage: React.FC<ConfigLayoutPageProps> = ({ content })=> {
    const [selectedErp, setSelectedErp] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const erpFromLocalStorage = localStorage.getItem('selectedErp');
        setSelectedErp(erpFromLocalStorage || '');
        }
    }, []);

    return(
        <div>
            <Header selectedErp={selectedErp} setSelectedErp={setSelectedErp}/>
            <section className="min-h-dvh h-full w-full">
                <div className="min-h-dvh h-full flex flex-row w-full justify-between">
                    <AccountConfigMenu/>
                    <div className="w-4/5 h-auto pt-[40px] pb-[80px] m-1 text-black bg-white rounded-md">
                        {content}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ConfigLayoutPage;