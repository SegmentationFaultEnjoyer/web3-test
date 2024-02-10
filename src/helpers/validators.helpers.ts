import {
  required as _required,
  email as _email,
  minLength as _minLength,
  maxLength as _maxLength,
  sameAs as _sameAs,
  not as _not,
} from '@vuelidate/validators'
import { ValidationRule } from '@vuelidate/core'
import { Ref, unref } from 'vue'
import { createI18nMessage, MessageProps } from '@vuelidate/validators'
import get from 'lodash/get'
import { i18n } from '@/localization'
import { utils } from 'ethers'
import { BN, BnLike } from '@distributedlab/tools'

const { t } = i18n.global || i18n

const messagePath = ({ $validator }: MessageProps) =>
  `validations.field-error_${$validator}`

const withI18nMessage = createI18nMessage({ t, messagePath })

export const required = <ValidationRule>withI18nMessage(_required)

export const email = <ValidationRule>withI18nMessage(_email)

export const not = (validator: ValidationRule): ValidationRule =>
  <ValidationRule>withI18nMessage(_not(validator))

export const minLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_minLength(length))

export const maxLength = (length: number): ValidationRule =>
  <ValidationRule>withI18nMessage(_maxLength(length))

export const sameAs = (field: Ref): ValidationRule => {
  return <ValidationRule>withI18nMessage(_sameAs(field, get(field, '_key')))
}

export const walletAddress = <ValidationRule>(
  withI18nMessage((value: string) => {
    return utils.isAddress(value)
  })
)

/**
 *  Vuelidate validator to validate Big Number amount
 * @param target - Target amount. Expected to be received as BigInt
 * @param decimals - Amount decimals
 * @param value - Value that will be passed to the validator expected to be
 * regular number
 *
 * @returns Whether the given value is less or equal to target value
 *
 * @example
 * const form = reactive({
 *  someAmount: '0.2'
 * })
 *
 * useFormValidation(form, {
 *  someAmount: enoughBnAmount("1000000000000000000")
 * })
 */
export const enoughBnAmount = (
  target: BnLike | Ref<BnLike>,
  decimals: number,
): ValidationRule =>
  <ValidationRule>withI18nMessage((amount: string | Ref<string>) => {
    return BN.fromRaw(unref(amount), decimals).lte(
      BN.fromBigInt(unref(target), decimals),
    )
  })
