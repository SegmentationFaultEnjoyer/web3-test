import {
  ARBITRUM_CHAINS,
  ETHEREUM_CHAINS,
  OPTIMISM_CHAINS,
  POLYGON_CHAINS,
} from '@/enums'
import { ChainId } from '@distributedlab/w3p'

export type SupportedScanNetworks =
  | 'homestead'
  | 'goerli'
  | 'sepolia'
  | 'arbitrum'
  | 'arbitrum-goerli'
  | 'matic'
  | 'maticmum'
  | 'optimism'
  | 'optimism-goerli'

export function getChainByScanType(scanType: SupportedScanNetworks) {
  switch (scanType) {
    case 'goerli':
      return ETHEREUM_CHAINS.goerli
    case 'sepolia':
      return ETHEREUM_CHAINS.sepolia
    case 'arbitrum':
      return ARBITRUM_CHAINS.mainnet
    case 'arbitrum-goerli':
      return ARBITRUM_CHAINS.goerli
    case 'matic':
      return POLYGON_CHAINS.mainnet
    case 'maticmum':
      return POLYGON_CHAINS.mumbai
    case 'optimism':
      return OPTIMISM_CHAINS.mainnet
    case 'optimism-goerli':
      return OPTIMISM_CHAINS.goerli

    case 'homestead':
    default:
      return ETHEREUM_CHAINS.mainet
  }
}

export function getScanTypeByChain(chainId: ChainId): SupportedScanNetworks {
  switch (chainId.toString()) {
    case ETHEREUM_CHAINS.goerli:
      return 'goerli'
    case ETHEREUM_CHAINS.sepolia:
      return 'sepolia'
    case ARBITRUM_CHAINS.mainnet:
      return 'arbitrum'
    case ARBITRUM_CHAINS.goerli:
      return 'arbitrum-goerli'
    case POLYGON_CHAINS.mainnet:
      return 'matic'
    case POLYGON_CHAINS.mumbai:
      return 'maticmum'
    case OPTIMISM_CHAINS.mainnet:
      return 'optimism'
    case OPTIMISM_CHAINS.goerli:
      return 'optimism-goerli'
    case ETHEREUM_CHAINS.mainet:
    default:
      return 'homestead'
  }
}
