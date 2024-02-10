<template>
  <div class="wallet-not-connected">
    <p class="wallet-not-connected__hint">
      {{ $t('wallet-not-connected.connect-wallet-hint') }}
    </p>
    <app-button
      size="large"
      :text="$t('wallet-not-connected.connect-btn')"
      :icon-right="$icons.metamask"
      @click="onConnect"
    />
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'

const emit = defineEmits<{
  (event: 'connect'): void
}>()

const onConnect = () => {
  emit('connect')
}
</script>

<style lang="scss" scoped>
.wallet-not-connected {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(10);
}

.wallet-not-connected__hint {
  font-size: toRem(18);
}
</style>
