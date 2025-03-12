import { useState } from 'react';
import styles from './AuthConnect.module.scss';
import Cookies from 'js-cookie';

interface AuthConnectProps {
  title: string;
  logo: React.ReactNode;
  handleLogout: ()=>void;
  handleConnect: string;
  accessToken: string | null;
}

export const AuthConnect: React.FC<AuthConnectProps> = ({title, logo, handleLogout, handleConnect, accessToken }) => {
  return(
    <div className={styles.connectContainer}>

      <div className={styles.connectSection}>
        {logo}
        <h1 className={styles.connectTitle}>{title}</h1>
      </div>
      {accessToken ? (
        <button onClick={handleLogout} className={styles.disconnectButton}>
          Desconectar
        </button>
      ) : (
        <a href={handleConnect}>
          <button className={styles.connectButton}>Conectar</button>
        </a>
      )}
    </div>
  )
}