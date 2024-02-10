<template>
  <div class="no-data-message" :style="{ '--icon-size': `${iconSize}px` }">
    <icon class="no-data-message__icon" :name="iconName" />
    <span v-if="message" class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    message?: string
    iconName?: ICON_NAMES
    iconSize?: number
  }>(),
  { message: '', iconName: ICON_NAMES.archive, iconSize: 50 },
)
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  text-align: center;
  grid-gap: toRem(12);
}

.no-data-message__icon {
  width: var(--icon-size);
  height: var(--icon-size);
}

.no-data-message__message {
  font-size: toRem(18);
}
</style>
