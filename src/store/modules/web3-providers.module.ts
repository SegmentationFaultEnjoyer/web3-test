import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useProvider } from '@/composables'

import {
  ProviderDetector,
  PROVIDERS,
  MetamaskProvider,
  RawProvider,
  FallbackEvmProvider,
} from '@distributedlab/w3p'
import { router } from '@/router'
import { useNetworkStore } from './networks.module'

type SUPPORTED_PROVIDERS = PROVIDERS | FALLBACK_PROVIDERS

enum FALLBACK_PROVIDERS {
  MetamaskFallback = 'metamask-fallback',
}

class MetamaskFallbackProvider extends FallbackEvmProvider {
  constructor(rawProvider: RawProvider) {
    super(rawProvider)
  }

  static get providerType() {
    return FALLBACK_PROVIDERS.MetamaskFallback
  }

  async connect(): Promise<void> {
    try {
      const METAMASK_APP_CONNECT_URL = `https://metamask.app.link/dapp/${window.location.host}${router.currentRoute.value.fullPath}`

      window.open(METAMASK_APP_CONNECT_URL)
    } catch (error) {
      window.location.reload()
    }
  }
}

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, () => {
  const provider = useProvider()
  const networkStore = useNetworkStore()

  const chainInfo = ref<ReturnType<(typeof networkStore)['getChainInfo']>>()

  const providerDetector = computed(
    () => new ProviderDetector<SUPPORTED_PROVIDERS>(),
  )

  async function detectProviders() {
    await providerDetector.value.init()
  }

  async function init() {
    const metamaskProvider = providerDetector.value.getProvider(
      PROVIDERS.Metamask,
    )

    // if metamask provider is present --> init it
    if (metamaskProvider) {
      await provider.init(MetamaskProvider, {
        providerDetector: providerDetector.value,
      })
      return
    }

    // if no metamask provider found --> fallback is main provider
    await provider.init(MetamaskFallbackProvider, {
      providerDetector: providerDetector.value,
    })
  }

  watch(
    () => provider.chainId?.value,
    () => {
      if (!provider.chainId?.value) return

      chainInfo.value = networkStore.getChainInfo(provider.chainId.value)
    },
  )

  return {
    detectProviders,
    init,

    provider,
    chainInfo,
  }
})
