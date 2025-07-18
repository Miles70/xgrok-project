// pages/_app.js
import { WagmiProvider, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { metaMask } from '@wagmi/connectors';
import { http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/App.css';

const config = createConfig({
  chains: [bsc],
  connectors: [metaMask()],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <Component {...pageProps} />
      </WagmiProvider>
    </QueryClientProvider>
  );
}