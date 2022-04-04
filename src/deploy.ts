import { KOLIBRI_CONFIG, MIGRATION_CONFIG, NETWORK_CONFIG } from "./config"
import { objectToMichelson, ContractOriginationResult, loadContract, printConfig, getTezos, deployContract, CONSTANTS } from "@hover-labs/tezos-utils"

const main = async () => {
  try {
    // Debug Info
    console.log("Deploying a Kolibri Vesting Vault")
    printConfig(NETWORK_CONFIG)
    console.log('')

    // Init Deployer
    console.log("Initializing Deployer Account")
    const tezos = await getTezos(NETWORK_CONFIG)
    const deployAddress = await tezos.signer.publicKeyHash()
    console.log("Deployer initialized!")
    console.log('')

    // Load Contract Sources
    console.log("Loading Contracts...")
    const contractSources = {
      vestingVaultContractSource: loadContract(`${__dirname}/../murmuration/smart_contracts/vesting-vault.tz`),
    }
    console.log("Done!")
    console.log('')

    // Print Config
    console.log(`Vesting Vault Params`)
    console.log(`=====================`)
    console.log(`Recipient: ${MIGRATION_CONFIG.recipient}`)
    console.log(`Token Address: ${MIGRATION_CONFIG.token}`)
    console.log(`Token Amount: ${MIGRATION_CONFIG.vestingAmount.dividedBy(CONSTANTS.MANTISSA).toFixed()} (Assumes 18 Decimal Places)`)
    console.log(`Vesting Length: ${MIGRATION_CONFIG.vestingBlocks} Blocks (~${MIGRATION_CONFIG.vestingBlocks.dividedBy(24 * 60 * 2)} days with 30s block times)`)
    console.log(`Vesting Start Block: ${MIGRATION_CONFIG.vestingStartBlock}`)
    console.log()

    console.log(`Computed Properties`)
    console.log(`=====================`)
    console.log(`DAO Address: ${KOLIBRI_CONFIG.contracts.DAO}`)

    const metadata = objectToMichelson({
      "": "tezos-storage:data",
      data: JSON.stringify({
        name: 'Kolibri DAO Vesting Vault',
        description: `Vesting vault deployed by ${deployAddress}`,
        author: "Hover Labs",
        homepage: "https://governance.kolibri.finance",
        interfaces: []
      })
    })
    console.log(`Metadata: ${JSON.stringify(metadata)}`)

    const amountPerBlock = MIGRATION_CONFIG.vestingAmount.dividedBy(MIGRATION_CONFIG.vestingBlocks)
    console.log(`Vesting Amount Per Block: ${amountPerBlock.toFixed(0)}`)
    console.log()

    // Deploy Pipeline

    // Step 1: Deploy a vesting vault
    console.log('Deploying Vesting Vault')
    const amountWithdrawn = 0
    const storage = `
      (Pair 
        (Pair 
          (Pair 
            ${amountPerBlock.toFixed(0)}
            ${amountWithdrawn}
          ) 
          (Pair 
            "${KOLIBRI_CONFIG.contracts.DAO}"
            "${KOLIBRI_CONFIG.contracts.DAO}"
          )
        ) 
        (Pair 
          (Pair 
            ${metadata}
            "${MIGRATION_CONFIG.recipient}"
          ) 
        (Pair 
          ${MIGRATION_CONFIG.vestingStartBlock}
          "${MIGRATION_CONFIG.token}"
        )
      )
    )
    `
    const vaultOriginationResult: ContractOriginationResult = await deployContract(NETWORK_CONFIG, tezos, contractSources.vestingVaultContractSource, storage)
    console.log(`\n\n`)
    console.log(`Deployed vault at ${vaultOriginationResult.contractAddress} in ${vaultOriginationResult.operationHash}`)
    console.log("")

    console.log("Done!")
    console.log()
  } catch (e: any) {
    console.log(e)
  }
}

main()