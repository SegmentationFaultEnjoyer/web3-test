import { ChainId } from '@distributedlab/w3p'

import {
  ARBITRUM_CHAINS,
  ETHEREUM_CHAINS,
  OPTIMISM_CHAINS,
  POLYGON_CHAINS,
} from '@/enums'
import { SupportedScanNetworks } from '@/types'

export const chainToScanMap = new Map<ChainId, SupportedScanNetworks>([
  [ETHEREUM_CHAINS.goerli, 'goerli'],
  [ETHEREUM_CHAINS.sepolia, 'sepolia'],
  [ETHEREUM_CHAINS.mainet, 'homestead'],
  [ARBITRUM_CHAINS.mainnet, 'arbitrum'],
  [ARBITRUM_CHAINS.goerli, 'arbitrum-goerli'],
  [POLYGON_CHAINS.mainnet, 'matic'],
  [POLYGON_CHAINS.mumbai, 'maticmum'],
  [OPTIMISM_CHAINS.mainnet, 'optimism'],
  [OPTIMISM_CHAINS.goerli, 'optimism-goerli'],
])
