<template>
  <div class="card-connect">
    <img class="logo" :src="walletOptions.logo" />
    <div>
      <span>{{ walletOptions.name }}</span>
      <span v-if="isAccountConnect"> CONNECTED</span>
      <span v-else> NOT CONNECTED</span>
    </div>
    <button class="button" v-if="!isAccountConnect" @click="onConnectWallet">
      {{ walletOptions.name }}
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

export default defineComponent({
  props: {
    account: String,
    walletOptions: Object,
    errorMessage: String,
  },
  emits: ['connect'],
  computed: {
    isAccountConnect(): boolean {
      return !!this.account;
    }
  },
  methods: {
    onConnectWallet() {
      this.$emit('connect');
    }
  }
})
</script>

<style lang="sass" scoped>
.card-connect
  display: grid
  grid-gap: 30px
  text-align: center
  grid-auto-rows: max-content

.logo
  height: 50px
  width: 100%
  object-fit: contain

.button
  padding: 10px 20px
  background: #297ACC
  font-family: Roboto, arial, helvetica, sans-serif
  font-weight: 500
  font-size: 16px
  color: #FFFFFF
  border-radius: 5px
  border: 1px solid transparent
  transition: border-color ease .3s, background ease .3s

  &:hover
    background: #408FDF
    border-color: #7EBEF5
      
  &:disabled
    opacity: .7
</style>