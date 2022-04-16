<template>
  <WalletConnect />
  <MetaMaskConnect />
</template>

<script lang="ts">
import WalletConnect from './components/WalletConnect.vue';
import MetaMaskConnect from './components/MetaMaskConnect.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    WalletConnect,
    MetaMaskConnect
  },
});
</script>