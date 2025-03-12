import type { Metadata } from 'next';
import Script from 'next/script'; // Importar Script do Next.js
import { Inter as FontSans, Urbanist as FontUrbanist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { GenerateDataProvider } from '@/context/generateDataContext';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import ClientWrapper from '../components/rootLayout/rootLayout'; // Importar o ClientWrapper

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontUrbanist = FontUrbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'AnuncIA - Crie seu anúncio personalizado',
  description: 'Crie seu anúncio personalizado, com as palavras mais buscadas',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
    <head>
      {/* Pixel do Facebook */}
      <Script strategy="afterInteractive" id="fb-pixel">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1804011207001759');
          fbq('track', 'PageView');
        `}
      </Script>

      <link rel="icon" href="https://i0.wp.com/mapmarketplaces.com/wp-content/uploads/2023/03/Isotipo-branca-e-verde.png?fit=32%2C25&#038;ssl=1" sizes="32x32"/>
      <link rel="icon" href="https://i0.wp.com/mapmarketplaces.com/wp-content/uploads/2023/03/Isotipo-branca-e-verde.png?fit=192%2C151&#038;ssl=1" sizes="192x192"/>
    </head>
    <body
      className={cn(
        'min-h-screen bg-background font-sans antialiased bg-[#282828] text-white',
        fontSans.variable,
        fontUrbanist.variable
      )}
    >
      <ClientWrapper>
        <GenerateDataProvider>{children}</GenerateDataProvider>
        <Toaster />
        <Footer />
      </ClientWrapper>
    </body>
    </html>
  );
}

export default RootLayout;
