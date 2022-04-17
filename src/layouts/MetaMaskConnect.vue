<template>
  <CardConnect 
    :walletOptions="walletOptions" 
    :account="account" 
    :errorMessage="errorMessage"
    @connect="onConnectWallet" 
  />
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import CardConnect from "@/components/card-connect.vue";

import Web3 from "web3";

import type { Ref } from "vue";
import { CustomWindow } from "@/types/index";
declare let window: CustomWindow;

export default defineComponent({
  components: { CardConnect },

  setup() {
    const account: Ref<string> = ref("");
    const errorMessage: Ref<string> = ref("");
    const web3: Web3 = new Web3 (
      Web3.givenProvider || "ws://some.local-or-remote.node:8546"
    );
    const walletOptions: { name: string, logo: string } = reactive({
      name: "MetaMask",
      logo: "/img/metamask.svg",
    });

    onMounted(() => {
      getAccounts();
      subscribeToEvents();
    });

    const subscribeToEvents = (): void => {
      window.ethereum.on("accountsChanged", accountChangeHandler);
    };

    const onConnectWallet = async (): Promise<void> => {
      try{
        if (window.ethereum) {
          await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } else errorMessage.value = "Please install MetaMask!";
      }
      catch(error: any) {
        errorMessage.value = error.message;
      }
    };

    const accountChangeHandler = (accounts: string[]): void => {
      account.value = accounts[0];
      errorMessage.value = "";
    };

    const getAccounts = async (): Promise<void> => {
      try{
        const accounts = await web3.eth.getAccounts();
        if (accounts.length) accountChangeHandler(accounts);
      }
      catch(error: any) {
        errorMessage.value = error.message;
      }
    };

    return {
      account,
      errorMessage,
      walletOptions,
      onConnectWallet
    }
  },
})
</script>
