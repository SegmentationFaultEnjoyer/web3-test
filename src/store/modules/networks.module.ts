import { ErrorHandler } from '@/helpers'
import { ChainId } from '@distributedlab/w3p'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type ChainInfo = {
  name: string
  chainId: number
  shortName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpc: string[]
  faucets: string[]
  infoUrl: string
}

const STORE_NAME = 'networks-store'
const CHAIN_LIST_URL = 'https://chainid.network/chains_mini.json'

export const useNetworkStore = defineStore(STORE_NAME, () => {
  const chainList = ref<ChainInfo[]>([])

  const init = async () => {
    try {
      const data: ChainInfo[] = await (await fetch(CHAIN_LIST_URL)).json()

      chainList.value = data
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

  const getChainInfo = (chainId: ChainId) => {
    if (!chainList.value.length) return

    return chainList.value.find(el => Number(el.chainId) === Number(chainId))
  }

  return {
    init,

    getChainInfo,
  }
})
