import { useAppKit } from '@reown/appkit/react';

export default function WalletConnect() {
  const { connect, disconnect, isConnected, address, isConnecting } = useAppKit();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button 
          onClick={connect}
          disabled={isConnecting}
          className="connect-button"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <span className="address">{formatAddress(address)}</span>
          <button 
            onClick={disconnect}
            className="disconnect-button"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 