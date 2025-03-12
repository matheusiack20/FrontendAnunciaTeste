'use client';

import React from 'react';
//import withAuth from '@/hoc/withAuth';

interface AuthProps {
  children?: React.ReactNode;
}

const ClientWrapper: React.FC<AuthProps> = ({ children }) => {
  return <>{children}</>;
};

export default ClientWrapper;