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

import { Wallet, CustomWindow } from "@/types/index";
declare let window: CustomWindow;

export default defineComponent({
  components: { CardConnect },

  data(): Wallet {
    return {
      account: "",
      errorMessage: "",
      provider: null,
      web3: new Web3(
        Web3.givenProvider || "ws://some.local-or-remote.node:8546"
      ),
      walletOptions: {
        name: "MetaMask",
        logo: "/img/metamask.svg",
      }
    }
  },
  
  computed: {
    isAccountConnect(): boolean {
      return !!this.account;
    }
  },

  mounted() {
    this.getAccounts();
    this.subscribeToEvents();
  },

  methods: {
    async onConnectWallet(): Promise<void> {
      try{
        if (window.ethereum) {
          this.provider = window.ethereum;
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } else this.errorMessage = "Please install MetaMask!";
      }
      catch(error: any) {
        this.errorMessage = error.message;
      }
    },

    async getAccounts() {
      try{
        const accounts = await this.web3.eth.getAccounts();
        if (accounts.length) this.accountChangeHandler(accounts);
      }
      catch(error: any) {
        this.errorMessage = error.message;
      }
    },

    accountChangeHandler(accounts: string[]): void {
      this.account = accounts[0];
      this.errorMessage = "";
    },

    subscribeToEvents(): void {
      window.ethereum.on("accountsChanged", this.accountChangeHandler);
    }
  },
})
</script>
