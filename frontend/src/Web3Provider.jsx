import '@rainbow-me/rainbowkit/styles.css';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { sepolia } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from environment variable
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// 2. Create a metadata object - optional
const metadata = {
  name: 'Todo App Web3',
  description: 'A decentralized todo application',
  url: 'http://localhost:5173', // Update this for production
  icons: ['https://assets.reown.com/reown-profile-pic.png']
};

// 3. Set the networks (using Sepolia for development)
const networks = [sepolia];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitProvider; 