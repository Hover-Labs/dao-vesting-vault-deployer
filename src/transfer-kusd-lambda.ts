import { compileLambda, CONSTANTS, } from '@hover-labs/tezos-utils'
import { KOLIBRI_CONFIG, MIGRATION_CONFIG } from './config'

const main = async (destination: string) => {
  // Contracts
  const devFundContract = KOLIBRI_CONFIG.contracts.DEVELOPER_FUND!

  // Break Glasses
  const devFundBreakGlassContract = KOLIBRI_CONFIG.contracts.BREAK_GLASS_CONTRACTS.DEVELOPER_FUND

  console.log("Generating a lambda to move kUSD")
  console.log()

  console.log(`Parameters`)
  console.log(`=====================`)
  console.log(`Amount: ${MIGRATION_CONFIG.vestingAmount.dividedBy(CONSTANTS.MANTISSA).toFixed()} kUSD`)
  console.log(`Destination: ${destination}`)
  console.log(`Developer Fund: ${devFundContract}`)
  console.log(`CommDeveloperunity Fund Break Glass: ${devFundBreakGlassContract}`)
  console.log()


  const program = `
import smartpy as sp

def movekUSD(unit):
    sp.set_type(unit, sp.TUnit)

    contractHandle = sp.contract(
        sp.TPair(sp.TNat, sp.TAddress),
        sp.address("${devFundContract}"),
        "sendTokens"
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

    devFundBreakGlassLambda = sp.contract(
        sp.TLambda(sp.TUnit, sp.TList(sp.TOperation)),
        sp.address("${devFundBreakGlassContract}"),
        "runLambda"
    ).open_some()

    sp.result(
        [
            sp.transfer_operation(movekUSD, sp.mutez(0), devFundBreakGlassLambda),
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
