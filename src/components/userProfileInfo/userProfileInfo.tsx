'use client';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import withAuth, { AuthProps } from '../../hoc/withAuth';

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
    image: string;
    plan: 1 | 2 | 3;
    announcementCount: number;
}

interface UserProfileInfoProps extends AuthProps {
    user: ({ plan?: 1 | 2 | 3; announcementCount?: number; } & Partial<User>) | null;
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ user = null }) => {
    if (!user) {
        return <div>Loading...</div>;
    }
    const [firstName, ...lastName] = (user.name ?? '').split(' ');

    return (
      <div id='profile-user' className="">
          <div className='flex items-center justify-between'>
              <div className='flex flex-row items-center gap-5'>
                  <div>
                      <AccountCircleIcon className='text-[75px]' />
                  </div>
                  <div className='flex flex-col gap-3'>
                      <span>{user.name}</span>
                      <span>{user.email}</span>
                  </div>
              </div>
              <div>
                  <span className='font-extrabold'>N° de cliente: {user._id}</span>
              </div>
          </div>
          <div className='flex flex-row justify-between w-full mt-5'>
              <div className='w-2/5'>
                  <h1>Primeiro Nome</h1>
                  <div className='bg-[#DDD5D5] rounded-lg p-3 shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50'>
                      <span className='opacity-50'>{firstName}</span>
                  </div>
              </div>
              <div className='w-2/4'>
                  <h1>Segundo Nome</h1>
                  <div className='bg-[#DDD5D5] w-full rounded-lg p-3 shadow-gray-500 shadow-sm border border-gray-500 border-opacity-50'>
                      <span className='opacity-50'>{lastName.join(' ')}</span>
                  </div>
              </div>
          </div>
      </div>
    );
}

export default withAuth(UserProfileInfo);