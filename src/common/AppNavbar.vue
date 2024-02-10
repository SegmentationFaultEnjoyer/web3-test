<template>
  <nav class="app-navbar">
    <app-button
      class="app-navbar__link"
      :scheme="'flat'"
      :text="$t('app-navbar.balance-link')"
      :route="{ name: $routes.balance }"
    />
    <app-button
      class="app-navbar__link"
      :scheme="'flat'"
      :text="$t('app-navbar.send-tx-link')"
      :route="{ name: $routes.sendTx }"
    />
    <app-button
      class="app-navbar__link"
      :scheme="'flat'"
      :text="$t('app-navbar.tx-list-link')"
      :route="{ name: $routes.txList }"
    />
    <app-button
      scheme="flat"
      :text="
        provider.address
          ? cropAddress(provider.address)
          : $t('app-navbar.connect-btn')
      "
      @click="handleConnectClick"
    />
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { AppButton } from '@/common'
import { useWeb3ProvidersStore } from '@/store'
import {
  BUS_EVENTS,
  ErrorHandler,
  bus,
  copyToClipboard,
  cropAddress,
} from '@/helpers'
import { useI18n } from 'vue-i18n'

const web3Store = useWeb3ProvidersStore()
const provider = computed(() => web3Store.provider)

const { t } = useI18n({ useScope: 'global' })

const handleConnectClick = async () => {
  if (!provider.value.isConnected) {
    await provider.value.connect()
    return
  }

  try {
    await copyToClipboard(provider.value.address || '')

    bus.emit(BUS_EVENTS.info, t('app-navbar.copy-msg'))
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.app-navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(24);
  padding: toRem(24) var(--app-padding-right) toRem(24) var(--app-padding-left);
  background: var(--background-primary-main);
  border-bottom: var(--border-primary-main);

  & > *:last-child {
    margin-left: auto;
  }

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.app-navbar__link {
  opacity: 0.25;

  &.router-link-active {
    opacity: 1;
  }
}
</style>
