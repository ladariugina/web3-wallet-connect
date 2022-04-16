import { MetaMaskInpageProvider } from "@metamask/providers";

export interface Wallet {
  account: string
  errorMessage: string,
  provider: WalletConnect | null,
  web3: Web3 | null,
}

export interface CustomWindow extends Window {
  ethereum: MetaMaskInpageProvider;
}