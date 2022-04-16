import { MetaMaskInpageProvider } from "@metamask/providers";

export interface Wallet {
  account: string
  errorMessage: string,
  provider: WalletConnect | null,
  web3: Web3 | null,
  walletOptions: { name: string, logo: string }
}

export interface CustomWindow extends Window {
  ethereum: MetaMaskInpageProvider;
}