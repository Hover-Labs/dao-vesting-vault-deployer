import { compileLambda, CONSTANTS, } from '@hover-labs/tezos-utils'
import { KOLIBRI_CONFIG, MIGRATION_CONFIG } from './config'

const main = async (destination: string) => {
  // Contracts
  const communityFundContract = KOLIBRI_CONFIG.contracts.DAO_COMMUNITY_FUND!

  // Break Glasses
  const communityFundBreakGlassContract = KOLIBRI_CONFIG.contracts.BREAK_GLASS_CONTRACTS.DAO_COMMUNITY_FUND

  console.log("Generating a lambda to move kDAO")
  console.log()

  console.log(`Parameters`)
  console.log(`=====================`)
  console.log(`Amount: ${MIGRATION_CONFIG.vestingAmount.dividedBy(CONSTANTS.MANTISSA).toFixed(0)} kDAO`)
  console.log(`Destination: ${destination}`)
  console.log(`Community Fund: ${communityFundContract}`)
  console.log(`Community Fund Break Glass: ${communityFundBreakGlassContract}`)
  console.log()

  const program = `
import smartpy as sp

def movekDAO(unit):
    sp.set_type(unit, sp.TUnit)

    contractHandle = sp.contract(
        sp.TPair(sp.TNat, sp.TAddress),
        sp.address("${communityFundContract}"),
        "send"
    ).open_some()

    param = (sp.nat(${MIGRATION_CONFIG.vestingAmount.toFixed()}), sp.address("${destination}"))

    sp.result(
        [
            sp.transfer_operation(
                param,
                sp.mutez(0),
                contractHandle
            )
        ]
    )

def governanceLambda(unit):
    sp.set_type(unit, sp.TUnit)

    communityFundBreakGlassLambda = sp.contract(
        sp.TLambda(sp.TUnit, sp.TList(sp.TOperation)),
        sp.address("${communityFundBreakGlassContract}"),
        "runLambda"
    ).open_some()    

    sp.result(
        [
            sp.transfer_operation(movekDAO, sp.mutez(0), communityFundBreakGlassLambda),
        ]
    )

sp.add_expression_compilation_target("operation", governanceLambda)
        `

  const compiled = compileLambda(program)

  console.log("Governance Lambda:")
  console.log(compiled)
  console.log(`\n\n`)
}

if (process.argv.length !== 3) {
  console.log("Usage: transfer-kdao-lambda.ts <recipient>")
  process.exit(1)
}

main(process.argv[2])
