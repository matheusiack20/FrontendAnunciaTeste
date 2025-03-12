import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BarChartIcon from '@mui/icons-material/BarChart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Logout from '@mui/icons-material/Logout';
import Link from 'next/link';
import BookIcon from '@mui/icons-material/Book';
import Image from 'next/image';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth';

export interface AuthProps {
  user: { plan?: 1 | 2 | 3; announcementCount?: number; image?: string } & Partial<User> | null;
  children?: React.ReactNode;
}

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

const AccountMenu: React.FC<AuthProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const logout = () => {
    Cookies.remove('authToken');
    window.location.href = 'https://anuncia.mapmarketplaces.com/';
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Minha Conta">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar className="bg-[#a8a419]" sx={{ width: 32, height: 32 }}>
              {user?.image ? (
                <Image src={user.image} alt="Avatar" width={32} height={32} style={{ borderRadius: '50%' }} />
              ) : (
                user?.name?.charAt(0)
              )}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href={'/user-account'}>
          <MenuItem onClick={handleClose}>
            <Avatar />
            <div className="ml-3">
              Minha Conta<br />
              {user?.email || 'emailDoCliente@email.com'}
            </div>
          </MenuItem>
        </Link>
        <Divider />
        <Link href={'/package-consume'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <BarChartIcon className="text-[#a8a419]" fontSize="small" />
            </ListItemIcon>
            Consumo do Pacote
          </MenuItem>
        </Link>
        <Link href={'/my-plans'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LocalOfferIcon className="text-[#a8a419]" fontSize="small" />
            </ListItemIcon>
            Adquirir novo plano
          </MenuItem>
        </Link>
        <Link href={'/my-bills'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <RequestQuoteIcon className="text-[#a8a419]" fontSize="small" />
            </ListItemIcon>
            Minhas Faturas
          </MenuItem>
        </Link>
        <div className="ml-4 text-[#E1DF36] font-bold">
          <p>Suporte</p>
        </div>
        <Link href={'/support'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SupportAgentIcon className="text-[#a8a419]" fontSize="small" />
            </ListItemIcon>
            Fale Conosco
          </MenuItem>
        </Link>
        <Link href={'/manual'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <BookIcon className="text-[#a8a419]" fontSize="small" />
            </ListItemIcon>
            Manual do Usuário
          </MenuItem>
        </Link>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout className="text-[red]" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default withAuth(AccountMenu);