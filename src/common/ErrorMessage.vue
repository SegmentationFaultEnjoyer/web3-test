<template>
  <div class="error-message" :style="{ '--icon-size': `${iconSize}px` }">
    <icon class="error-message__img" :name="iconName" />
    <h3 v-if="title" class="error-message__title">
      {{ title }}
    </h3>
    <p class="error-message__message">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    title?: string
    message?: string
    iconName?: ICON_NAMES
    iconSize?: number
  }>(),
  {
    title: '',
    message: '',
    iconSize: 50,
    iconName: ICON_NAMES.exclamationCircle,
  },
)
</script>

<style lang="scss" scoped>
.error-message {
  display: grid;
  place-items: center;
  text-align: center;
  grid-gap: toRem(12);
}

.error-message__img {
  width: var(--icon-size);
  height: var(--icon-size);
  color: var(--error-main);
}

.error-message__title {
  font-size: toRem(24);
  color: var(--error-main);
}

.error-message__message {
  font-size: toRem(18);
  color: var(--error-main);
}
</style>
