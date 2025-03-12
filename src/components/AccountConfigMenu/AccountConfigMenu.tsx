import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BarChartIcon from '@mui/icons-material/BarChart';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BookIcon from '@mui/icons-material/Book';
import { ProfileUserMenu } from "../profileUserMenu/profileUserMenu";

const AccountConfigMenu = () => {
    const pathname = usePathname();

    const getBackgroundColor = (path: string) => {
        return pathname === path ? '#dafd00' : '#D9D9D9';
    };

    return (
        <section className="h-auto w-[20%]">
            <div id='user-menu-nav' className="flex flex-col justify-between pt-3 h-full w-[100%] border-r-[1px] border-r-white border-opacity-50">
                <div className="pl-5">
                    <div className="font-bold">
                        <h1>Geral</h1>
                    </div>
                    <Link href={'/user-account'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/user-account') }}>
                                <PersonIcon/>
                            </div>
                            <span className="ml-10">Minha Conta</span>
                        </div>
                    </Link>
                    <Link href={'/my-plans'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/my-plans') }}>
                                <LocalOfferIcon/>
                            </div>
                            <span className="ml-10">Adquirir novo plano</span>
                        </div>
                    </Link>
                    <Link href={'/package-consume'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/package-consume') }}>
                                <BarChartIcon/>
                            </div>
                            <span className="ml-10">Consumo do pacote</span>
                        </div>
                    </Link>
                    <Link href={'/my-bills'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/my-bills') }}>
                                <RequestQuoteIcon/>
                            </div>
                            <span className="ml-10">Minhas Faturas</span>
                        </div>
                    </Link>
                    <h1 className="mt-3 font-bold">Ajuda</h1>
                    <Link href={'/support'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/support') }}>
                                <SupportAgentIcon/>
                            </div>
                            <span className="ml-10">Fale Conosco</span>
                        </div>
                    </Link>
                    <Link href={'/manual'}>
                        <div className="flex flex-row items-center justify-start mt-3">
                            <div className="text-black w-6 h-6 p-5 flex justify-center items-center rounded-lg" style={{ backgroundColor: getBackgroundColor('/manual') }}>
                                <BookIcon/>
                            </div>
                            <span className="ml-10">Manual do Usuário</span>
                        </div>
                    </Link>
                </div>
                <ProfileUserMenu user={null} />
            </div>
        </section>
    );
}

export default AccountConfigMenu;