<template>
  <div class="card-connect">
    <img class="logo" src="/img/wallet-connect.svg" />
    <div>
      <span>WalletConnect</span>
      <span v-if="isAccountConnect"> CONNECTED</span>
      <span v-else> NOT CONNECTED</span>
    </div>
    <button class="button" v-if="!isAccountConnect" @click="onConnectWallet">
      WalletConnect
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
import WalletConnect from "@walletconnect/client";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { IInternalEvent } from "@walletconnect/types";
import { Wallet } from "@/handlers/types";

export default defineComponent({
  data(): Wallet {
    return {
      account: '',
      errorMessage: '',
      provider: null,
      web3: null,
    }
  },

  computed: {
    isAccountConnect(): boolean {
      return !!this.account;
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

    async getAccounts(): Promise<void> {
      await this.web3.eth.getAccounts()
        .then((accounts: string[]) => {
          this.accountChangeHandler(accounts[0])
        })
    },

    async subscribeToEvents() {
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

    accountChangeHandler(newAccount: string): void {
      this.account = newAccount;
      this.errorMessage = "";
    },
  },
})
</script>
