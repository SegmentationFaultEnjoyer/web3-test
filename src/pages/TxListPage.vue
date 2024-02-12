<template>
  <div class="tx-list-page">
    <h1 class="tx-list-page__title">
      {{ $t('tx-list-page.title') }}
    </h1>
    <wallet-not-connected
      v-if="!provider.isConnected"
      @connect="provider.connect"
    />
    <main v-else class="tx-list-page__main">
      <select-field
        v-model="selectedChain"
        :note="$t('tx-list-page.select-chain-note')"
        :label="$t('tx-list-page.select-chain-lbl')"
        :value-options="(SUPPORTED_CHAINS_NAMES as string[])"
      />
      <template v-if="isLoaded">
        <error-message
          v-if="isLoadFailed"
          :message="$t('tx-list-page.error-msg')"
        />
        <ul v-else-if="txList.length" class="tx-list-page__list">
          <li class="tx-list-page__list-item tx-list-page__list-item--header">
            <span v-for="label in labels" :key="label">{{ label }}</span>
          </li>
          <li
            v-for="item in txList"
            :key="item.hash"
            class="tx-list-page__list-item"
          >
            <span>{{ cropAddress(item.hash) }}</span>
            <span>{{ cropAddress(item.from) }}</span>
            <span>{{ item.blockNumber }}</span>
            <span v-if="item.to">{{ cropAddress(item.to) }}</span>
          </li>
        </ul>
        <no-data-message v-else :message="$t('tx-list-page.no-data-msg')" />
      </template>
      <loader v-else />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { providers } from 'ethers'

import {
  WalletNotConnected,
  Loader,
  ErrorMessage,
  NoDataMessage,
} from '@/common'
import { useNetworkStore, useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, cropAddress } from '@/helpers'
import { SelectField } from '@/fields'
import { chainToScanMap } from '@/consts'
import { ChainId } from '@distributedlab/w3p'

const TX_AMOUNT = 10
const labels = ['Hash', 'From', 'Block Number', 'To']

const networkStore = useNetworkStore()
const web3Store = useWeb3ProvidersStore()

const provider = computed(() => web3Store.provider)

const SUPPORTED_CHAINS = Array.from(chainToScanMap.keys())
const SUPPORTED_CHAINS_NAMES = SUPPORTED_CHAINS.map(
  el =>
    networkStore.chainList.find(chain => chain.chainId === Number(el))?.name ||
    'Unknown chain',
)

const selectedChain = ref<ChainId>()
const txList = ref<providers.TransactionResponse[]>([])

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const getChain = () => {
  const index = SUPPORTED_CHAINS_NAMES.findIndex(
    el => el === selectedChain.value,
  )

  if (!index) return

  return SUPPORTED_CHAINS[index]
}

const loadTxList = async () => {
  if (!provider.value.address || !selectedChain.value) return

  const selectedChainId = getChain()

  if (selectedChainId !== provider.value.chainId) return

  isLoadFailed.value = false
  isLoaded.value = false
  try {
    const list = await provider.value.getLastTransactions(
      provider.value.address,
      TX_AMOUNT,
    )

    txList.value = list
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  } finally {
    isLoaded.value = true
  }
}

watch(
  () => provider.value.chainId,
  () => {
    if (!SUPPORTED_CHAINS.some(el => el === provider.value.chainId)) return

    const index = SUPPORTED_CHAINS.findIndex(
      el => el === provider.value.chainId,
    )

    if (!index) return

    selectedChain.value = SUPPORTED_CHAINS_NAMES[index]
  },
  { immediate: true },
)

watch(
  () => [provider.value.address, provider.value.chainId, selectedChain.value],
  loadTxList,
  { immediate: true },
)

watch(selectedChain, () => {
  if (!selectedChain.value) return

  const chainId = getChain()

  if (!chainId) return

  provider.value.switchChain(Number(chainId))
})
</script>

<style lang="scss" scoped>
.tx-list-page {
  @include app-page;
}

.tx-list-page__title {
  @include app-page-title;
}

.tx-list-page__main {
  display: flex;
  flex-direction: column;
  gap: toRem(25);
  width: clamp(toRem(300), 100%, toRem(550));
}

.tx-list-page__list {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
}

.tx-list-page__list-item {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(toRem(100), 1fr));
  gap: toRem(20);
  background-color: var(--primary-light);
  padding: toRem(8);
  border-radius: toRem(8);

  &--header {
    font-weight: 500;
  }
}
</style>
