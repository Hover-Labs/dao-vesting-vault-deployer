import { CONSTANTS, KolibriConfig, NetworkConfig } from '@hover-labs/tezos-utils'
import { CONTRACTS } from '@hover-labs/kolibri-js'
import BigNumber from "bignumber.js";

export const NETWORK_CONFIG: NetworkConfig = {
  // Human readable of the network
  name: 'Mainnet',

  // A tezos node that accepts RPCs
  tezosNodeUrl: 'https://mainnet.smartpy.io',

  // Required confirmations
  betterCallDevUrl: 'https://api.better-call.dev/v1',
  requiredConfirmations: 2,
  maxConfirmationPollingRetries: 10,
  operationDelaySecs: 10,
}

export const KOLIBRI_CONFIG: KolibriConfig = {
  // Contracts to use. You probably want MAINNET
  contracts: CONTRACTS.MAIN,

  // These parameters have no effect, can be ignored
  escrowAmount: 3000000000000000000000,
  governanceVoteLength: 15,
  governanceTimelockLength: 11,
}

export const MIGRATION_CONFIG = {
  // Recipient of vesting
  recipient: "tz1YmV5mHeu45QpQAsZ7WfwvrmEtEGnQy3GJ",

  // What token is vesting
  // Use CONTRACTS.<NETWORK>.TOKEN for kUSD
  // Use CONTRACTS.<NETWORK>.DAO_TOKEN for kDAO
  token: CONTRACTS.MAIN.TOKEN, // kUSD

  // Amount of tokens to vest
  vestingAmount: new BigNumber(3000).times(new BigNumber(CONSTANTS.MANTISSA)),

  // Amount of blocks to vest over
  // NOTE: When this script was written, block times are 30s. The Tezos Network may upgrade to have shorter block times
  //       which means that vesting may occur faster than this value suggests.
  vestingBlocks: new BigNumber(3 * 30 * (2 * 60 * 24)), // 1 month @ 30s block time

  // Block at which vesting starts
  vestingStartBlock: new BigNumber(2276328)
}
