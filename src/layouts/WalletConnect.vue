<template>
  <CardConnect 
    :walletOptions="walletOptions" 
    :account="account" 
    :errorMessage="errorMessage"
    @connect="onConnectWallet" 
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardConnect from "@/components/card-connect.vue";

import Web3 from "web3";
import WalletConnect from "@walletconnect/client";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { IInternalEvent } from "@walletconnect/types";
import { Wallet } from "@/types/index";

export default defineComponent({
  components: { CardConnect },

  data(): Wallet {
    return {
      account: "",
      errorMessage: "",
      provider: null,
      web3: null,
      walletOptions: {
        name: "WalletConnect",
        logo: "/img/wallet-connect.svg",
      }
    }
  },

  mounted() {
    const session = this.getSession()
    if (session) {
      this.provider = new WalletConnect(session);
      this.account = this.provider.accounts[0];

      this.subscribeToEvents()
    }
  },

  methods: {
    getSession(): any {
      const local = localStorage ? localStorage.getItem("walletconnect") : null;
      let session = null;
      if (local) session = JSON.parse(local);
      return session;
    },

    async onConnectWallet(): Promise<void> {
      this.provider = new WalletConnectProvider({
        infuraId: "90e4b7922ee441e2a2c53d60f9da525c",
      });
      await this.provider.enable();
      this.web3 = new Web3(this.provider);
      this.getAccounts();
      this.subscribeToEvents();
    },

    subscribeToEvents(): void {
      if (!this.provider) return;
      if (!this.provider.connected) this.provider.createSession()

      this.provider.on("connect", (error: Error, payload: IInternalEvent) => {
        if (error) console.log(error)
        this.accountChangeHandler(payload.params[0].accounts);
      });

      this.provider.on("disconnect", () => {
        this.account = "";
        this.provider = null;
        this.errorMessage = "";
      });
    },
    async getAccounts(): Promise<void> {
      try{
        const accounts = await this.web3.eth.getAccounts()
        this.accountChangeHandler(accounts)
      }
      catch(error: any) {
        this.errorMessage = error.message;
      }
    },
    accountChangeHandler(accounts: string[]): void {
      this.account = accounts[0];
      this.errorMessage = "";
    },
  },
})
</script>
