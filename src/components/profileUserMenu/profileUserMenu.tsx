import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import React from 'react';
import withAuth, { AuthProps } from '../../hoc/withAuth';


  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    // Adicione outros campos conforme necessário
  }

export const ProfileUserMenu: React.FC<AuthProps> = ({ user }) => {
    if (!user) {
        return <div>Erro: Usuário não autenticado</div>;
    }
    
    return (
        <div className='flex flex-row items-center gap-5 pt-5 mb-5 border-t border-t-white border-opacity-50'>
            <Link href={'/user-account'}>
                <div className='flex ml-5'>
                    <div>
                        <AccountCircleIcon className='text-[60px]' />
                    </div>
                    <div className='flex flex-col gap-3 ml-2'>
                        <span>{user.name}</span>
                        <span className='opacity-50'>Aumentando</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default withAuth(ProfileUserMenu);