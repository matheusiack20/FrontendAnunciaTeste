import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Fade, IconButton } from '@mui/material';
import { ErrorOutline, Close } from '@mui/icons-material';

interface ModalMaxLimitReachedProps {
  open: boolean;
  onClose: () => void;
  onViewItems?: () => void;
}

const ModalMaxLimitReached: React.FC<ModalMaxLimitReachedProps> = ({ open, onClose, onViewItems }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={500}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          padding: 3,
          boxShadow: 3,
          width: '90%',
          maxWidth: '600px',
          border: '2px solid #CEFF03',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
        <DialogTitle sx={{ padding: 0, marginBottom: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <ErrorOutline sx={{ color: 'error.main', marginRight: 1, fontSize: 32 }} />
            <Typography variant="h5" color="error.main" fontWeight="bold">
              Limite Atingido
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: 0, marginBottom: 3 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            O limite máximo foi alcançado. Faça upgrade para um plano exclusivo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: 0 }}>
          {onViewItems && (
            <Button
              onClick={onViewItems}
              color="secondary"
              variant="outlined"
              sx={{ marginRight: 2, fontSize: '0.875rem', textTransform: 'none' }}
            >
              Ver Itens
            </Button>
          )}

          <Button
            variant="contained"
            sx={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              backgroundColor: '#CEFF03',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '30px',
              boxShadow: '0px 0px 10px #CEFF03',
              animation: 'glow 1.5s infinite alternate, pulse 2s infinite',
              '@keyframes glow': {
                '0%': { boxShadow: '0px 0px 10px #CEFF03' },
                '100%': { boxShadow: '0px 0px 20px #CEFF03' },
              },
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
              '&:hover': {
                backgroundColor: '#b2e600',
                boxShadow: '0px 0px 25px #CEFF03',
                transform: 'scale(1.05)',
              },
            }}
            component="a"
            href={`${process.env.NEXT_PUBLIC_AUTENTICA_LOGIN}/sobre`}
            rel="noopener noreferrer"
          >
            Upgrade Agora
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalMaxLimitReached;
