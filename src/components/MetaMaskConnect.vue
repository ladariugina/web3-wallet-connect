<template>
  <div class="card-connect">
    <img class="logo" src="/img/metamask.svg" />
    <div>
      <span>MetaMask</span>
      <span v-if="isAccountConnect"> CONNECTED</span>
      <span v-else> NOT CONNECTED</span>
    </div>
    <button class="button" v-if="!isAccountConnect" @click="onConnectWallet">
      Connect MetaMask
    </button>
    <div v-else>
      Address:
      <span>{{ account }}</span>
    </div>
    <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Web3 from "web3";

import { Wallet, CustomWindow } from "@/handlers/types";
declare let window: CustomWindow;

export default defineComponent({
  data(): Wallet {
    return {
      account: '',
      errorMessage: '',
      provider: null,
      web3: new Web3(
        Web3.givenProvider || "ws://some.local-or-remote.node:8546"
      )
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
      await this.detectProvider()
    },

    async detectProvider(): Promise<void> {
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
