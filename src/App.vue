<template>
  <WalletConnect />
  <MetaMaskConnect />
</template>

<script lang="ts">
import WalletConnect from './layouts/WalletConnect.vue';
import MetaMaskConnect from './layouts/MetaMaskConnect.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    WalletConnect,
    MetaMaskConnect
  },
});
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap')
    
body
  margin: 0
  background: #FAFAFA

button
  cursor: pointer
  outline: none
  background: none
  border: none
  box-shadow: none

#app
  font-family: Roboto, arial, helvetica, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  margin-top: 60px
  display: flex
  justify-content: center
  gap: 20px
</style>