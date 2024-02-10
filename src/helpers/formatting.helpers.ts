import { BN, BnLike } from '@distributedlab/tools'

export function formatAssetFromWei(
  amount: BnLike,
  assetDecimals = 18,
  formattedDecimals = 2,
) {
  const formattedAmount = BN.fromBigInt(amount, assetDecimals).format({
    decimals: formattedDecimals,
  })

  return formattedAmount
}

export function cropAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-5)}`
}
