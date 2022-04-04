# Vesting Vault Deployer

This repository deploys Vesting Vaults for `kUSD` or `kDAO`, which are governed by the [Kolibri DAO](https://governance.kolibri.finance).

If you need help using this repository, feel free to ask for help in the [Kolibri Discord](discord.gg/pCKVNTw6Pf).

## Usage

**Prerequisites**

You must have the following installed:
1. [Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
2. [`make`](https://www.gnu.org/software/make/)
3. [SmartPy's CLI](https://smartpy.io/docs/cli/)

**1. Install Dependencies**

```
npm i
```

**2. Modify Configuration**

Modify `src/config.ts` to have your desired parameters. See comments inline in the file to guide you.

**3. Export a Private Key to Deploy With**

This key must be funded in order to pay for the contract deploy.

```
export DEPLOY_SK=edsk...
```

**4. Deploy the Vesting Vault**

Run:
```
make deploy
```

This will give you some output that ends with:

```
Deployed vault at KT1AWW8zcWHKhRgrxkjkrkYdrLViZqcBCCuh in oocB55JiQXbRTS4ySmCph1ZK6zdfgaGuNGaC2iFETtLJL2MT5k4
```

**4. Generate a Lambda for Governance**

Note the vault address from above (the value that starts with `KT1...`. Run one of the two following commands to generate a lambda which will fund the vault:

Fund with kUSD:
```
make destination=KT1...  generate-kusd
```

Fund with kDAO:
```
make destination=KT1...  generate-kdao
```