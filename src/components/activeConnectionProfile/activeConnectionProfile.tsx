'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import BlingLogo from "../ApisAuthConnect/blingAuthConnect/blingLogo";
import { OlistLogo } from "../ApisAuthConnect/OlistAuthConnect/OlistLogo";

const connectApiURLBling = `${process.env.NEXT_PUBLIC_URL}/blingAuth`;
const connectApiURLOlist = `${process.env.NEXT_PUBLIC_URL}/auth/olist`;



interface AuthConnectActiveConnectionProps {
    title: string;
    logo: React.ReactNode;
    handleConnect: string;
    accessToken: string | null;
}

const AuthConnectActiveConnection: React.FC<AuthConnectActiveConnectionProps> = ({title ,logo, handleConnect, accessToken}) => {
    
    return(
        <div className="mt-3 flex justify-between items-center w-full p-3 rounded-lg shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50">
            <div className="w-[35px]">{logo}</div>
            <div className="flex flex-col justify-start w-[360px]">
                <h1>{title}</h1>
                <h2 className="opacity-75">Conecte uma conta {title} para criar seus anúncios</h2>
            </div>
            {accessToken ? (
                <button className="p-2 text-green-700 border border-green-700 rounded-lg">CONECTADO</button>
            ) : (
                <Link href={handleConnect}>
                    <button className="p-2 text-green-700 border border-green-700 rounded-lg">CONECTAR</button>
                </Link>
            )}
        </div>
    );
}

const ActiveConnectionProfile = () => {


    const [blingToken, setBlingToken] = useState<string | null>(null);
    const [olistToken, setOlistToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const olist = localStorage.getItem('olistAccessToken');
        setBlingToken(token);
        setOlistToken(olist);
    }, []);
    return (
        <div>
            <h1>Conexões ativas</h1>
            <h2 className="mt-3 opacity-75">Abaixo são apresentadas todas as conexões ativas</h2>
            <AuthConnectActiveConnection
                title="Bling!"
                logo={<BlingLogo/>}
                handleConnect={connectApiURLBling}
                accessToken={blingToken}
            />
            <AuthConnectActiveConnection
                title="Olist"
                logo={<OlistLogo/>}
                handleConnect={connectApiURLOlist}
                accessToken={olistToken}
            />
        </div>
    );
}

export default ActiveConnectionProfile; 