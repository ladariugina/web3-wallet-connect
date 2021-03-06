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

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

import type { Ref } from "vue";
import { IConnector, IInternalEvent, IWalletConnectOptions } from "@walletconnect/types";

export default defineComponent({
  components: { CardConnect },

  setup() {
    const account: Ref<string> = ref("");
    const errorMessage: Ref<string> = ref("");
    const provider: Ref<IConnector | null> = ref(null);
    const walletOptions: { name: string, logo: string } = reactive({
      name: "WalletConnect",
      logo: "/img/wallet-connect.svg",
    });

    onMounted(() => {
      const session = getSession();
      if (session) {
        provider.value = new WalletConnect(session);
        account.value = provider.value.accounts[0];
        subscribeToEvents();
      }
    });

    const getSession = (): IWalletConnectOptions => {
      const local = localStorage ? localStorage.getItem("walletconnect") : null;
      let session = null;
      if (local) session = JSON.parse(local);
      return session;
    };

    const subscribeToEvents = (): void => {
      if (!provider.value) return;
      if (!provider.value.connected) provider.value.createSession()

      provider.value.on("connect", (error: Error | null, payload: IInternalEvent) => {
        if (error) errorMessage.value = (error as Error).message;
        accountChangeHandler(payload.params[0].accounts);
      });

      provider.value.on("disconnect", () => {
        account.value = "";
        provider.value = null;
        errorMessage.value = "";
      });
    };

    const onConnectWallet = async (): Promise<void> => {
      provider.value = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
      });
      subscribeToEvents();
    };

    const accountChangeHandler = (accounts: string[]): void => {
      account.value = accounts[0];
      errorMessage.value = "";
    };

    return {
      account,
      errorMessage,
      walletOptions,
      onConnectWallet,
    }
  },
})
</script>
