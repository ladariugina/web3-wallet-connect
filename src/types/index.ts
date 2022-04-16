import { MetaMaskInpageProvider } from "@metamask/providers";

export interface CustomWindow extends Window {
  ethereum: MetaMaskInpageProvider;
}