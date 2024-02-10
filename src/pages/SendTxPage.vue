<template>
  <div class="send-tx-page">
    <h1 class="send-tx-page__title">
      {{ $t('send-tx-page.title') }}
    </h1>
    <wallet-not-connected
      v-if="!provider.isConnected"
      @connect="provider.connect"
    />
    <form v-else class="send-tx-page__form" @submit.prevent="submit">
      <input-field
        v-model="form.recipient"
        :label="$t('send-tx-page.recipient-lbl')"
        :placeholder="$t('send-tx-page.recipient-placeholder')"
        :disabled="isFormDisabled"
        :error-message="getFieldErrorMessage('recipient')"
        @blur="touchField('recipient')"
      />
      <input-field
        v-model="form.amount"
        :label="$t('send-tx-page.amount-lbl')"
        :placeholder="$t('send-tx-page.amount-placeholder')"
        :disabled="isFormDisabled"
        :error-message="getFieldErrorMessage('amount')"
        :note="
          $t('send-tx-page.amount-note', {
            balance: formatAssetFromWei(
              userBalance,
              web3Store.chainInfo?.nativeCurrency.decimals,
              5,
            ),
          })
        "
        @blur="touchField('amount')"
      />
      <app-button
        class="send-tx-page__submit-btn"
        type="submit"
        size="large"
        :text="$t('send-tx-page.submit-btn')"
        :disabled="isFormDisabled"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { AppButton, WalletNotConnected } from '@/common'
import { InputField } from '@/fields'
import { useForm, useFormValidation } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import {
  ErrorHandler,
  required,
  walletAddress,
  enoughBnAmount,
  formatAssetFromWei,
  bus,
  BUS_EVENTS,
} from '@/helpers'
import { BN } from '@distributedlab/tools'
import { useI18n } from 'vue-i18n'

const DEFAULT_DECIMALS = 18

const form = reactive({
  recipient: '',
  amount: '',
})
const userBalance = ref('')

const web3Store = useWeb3ProvidersStore()
const { t } = useI18n({ useScope: 'global' })

const provider = computed(() => web3Store.provider)

const { disableForm, enableForm, isFormDisabled } = useForm()
const { isFormValid, touchField, getFieldErrorMessage } = useFormValidation(
  form,
  {
    recipient: {
      required,
      walletAddress,
    },
    amount: {
      required,
      enoughBnAmount: enoughBnAmount(
        userBalance,
        web3Store.chainInfo?.nativeCurrency.decimals ?? DEFAULT_DECIMALS,
      ),
    },
  },
)

const clearForm = () => {
  form.amount = ''
  form.recipient = ''
}

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    const amountToSend = BN.fromRaw(
      form.amount,
      web3Store.chainInfo?.nativeCurrency.decimals ?? DEFAULT_DECIMALS,
    ).value

    await provider.value.signAndSendTx({
      to: form.recipient,
      value: amountToSend,
    })

    bus.emit(
      BUS_EVENTS.success,
      t('send-tx-page.success-msg', {
        amount: formatAssetFromWei(amountToSend),
        currency: web3Store.chainInfo?.nativeCurrency.symbol,
      }),
    )

    clearForm()
    loadBalance()
  } catch (error) {
    ErrorHandler.process(error)
  } finally {
    enableForm()
  }
}

const loadBalance = async () => {
  if (!provider.value.address) return

  try {
    const balance = await provider.value.getBalance(provider.value.address)

    userBalance.value = balance
  } catch (error) {
    ErrorHandler.process(error)
  }
}

watch(() => provider.value.address, loadBalance, {
  immediate: true,
})
</script>

<style lang="scss" scoped>
.send-tx-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(40);
  padding: toRem(40);
}

.send-tx-page__title {
  font-weight: 600;
  font-size: toRem(32);
}

.send-tx-page__form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  width: clamp(toRem(300), 100%, toRem(500));
}

.send-tx-page__submit-btn {
  align-self: flex-end;
}
</style>
