<template>
  <div class="balance-page">
    <header class="balance-page__header">
      <h1 class="balance-page__title">
        {{ $t('balance-page.title') }}
      </h1>
    </header>
    <main class="balance-page__main">
      <wallet-not-connected
        v-if="!provider.isConnected"
        @connect="provider.connect"
      />
      <template v-else>
        <template v-if="isLoaded">
          <error-message
            v-if="isLoadFailed"
            class="balance-page__error-msg"
            :message="$t('balance-page.error-msg')"
          />
          <template v-else-if="balanceToDisplay">
            <section class="balance-page__balance-info">
              <div class="balance-page__balance-info-item">
                <span>{{ $t('balance-page.address-lbl') }}</span>
                <span>{{ cropAddress(provider.address!) }}</span>
              </div>
              <div class="balance-page__balance-info-item">
                <span>{{ $t('balance-page.balance-lbl') }}</span>
                <span>{{ balanceToDisplay }}</span>
              </div>
              <div class="balance-page__balance-info-item">
                <span>{{ $t('balance-page.chain-lbl') }}</span>
                <span>{{ web3Store.chainInfo?.name }}</span>
              </div>
            </section>
          </template>
          <no-data-message
            v-else
            class="balance-page__no-data-msg"
            :message="$t('balance-page.no-data-msg')"
          />
        </template>
        <loader class="balance-page__loader" v-else />
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useWeb3ProvidersStore } from '@/store'
import {
  ErrorMessage,
  NoDataMessage,
  Loader,
  WalletNotConnected,
} from '@/common'
import { ErrorHandler, cropAddress, formatAssetFromWei } from '@/helpers'

const FORMATTING_DECIMALS = 5

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const balance = ref<string>()

const isLoaded = ref(false)
const isLoadFailed = ref(false)

const balanceToDisplay = computed(
  () =>
    balance.value &&
    web3Store.chainInfo &&
    `${formatAssetFromWei(
      balance.value,
      web3Store.chainInfo.nativeCurrency.decimals,
      FORMATTING_DECIMALS,
    )} ${web3Store.chainInfo.nativeCurrency.symbol}`,
)

const loadBalance = async () => {
  if (!provider.value.address || !provider.value.chainId) return

  isLoaded.value = false
  isLoadFailed.value = false

  try {
    const userBalance = await provider.value.getBalance(provider.value.address)

    balance.value = userBalance
  } catch (error) {
    ErrorHandler.processWithoutFeedback(error)
    isLoadFailed.value = true
  } finally {
    isLoaded.value = true
  }
}

watch(() => [provider.value.address, provider.value.chainId], loadBalance, {
  immediate: true,
})
</script>

<style lang="scss" scoped>
.balance-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(40);
  padding: toRem(40);
}

.balance-page__loader,
.balance-page__error-msg,
.balance-page__no-data-msg {
  margin-top: toRem(100);
}

.balance-page__title {
  font-weight: 600;
  font-size: toRem(32);
}

.balance-page__balance-info {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
  min-width: toRem(280);
}

.balance-page__balance-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-light);
  border-radius: toRem(8);
  padding: toRem(8);

  & > *:first-child {
    font-weight: 500;
  }

  & > *:last-child {
    color: var(--text-primary-light);
  }
}
</style>
