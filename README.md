1. [Presentation](#presentation)
2. [Installation Guide](#guide)
    1. [Dependencies](#dependencies)
    2. [Tests](#tests)
    3. [Deployment](#deployment)
        1. [Locally](#locally)
        2. [Testnet](#testnet)
    4. [Docker Reactapp Container](#docker)
        1. [Prerequisities](#dockerPrerequisities)
        2. [Container](#dockerContainer)
        3. [Environment Variables](#dockerEnvVariables)

# Presentation <a name="presentation"></a>

To understand what is the purpose of this repository please read **[EIP-draft_ERC20Charity.md](EIP-draft_ERC20Charity.md)**. The main files are [ERC20Charity.sol](./contracts/ERC20Charity.sol) and its interface [IERC20Charity.sol](./contracts/interfaces/IERC20Charity.sol), the other contracts are only here for tests and integration demonstration (`CharityToken.sol` contract implements the charity features).

The *app* folder is a react application that provides a minimal **demonstration** of how this ERC can be use and exchange without the need for an intermediate smart contract. It allow customization for the owner of a token allowing him to activate donation and choose rate, and for the owner of the contract to update whitelisted charity addresses.

# Installation Guide <a name="guide"></a>

## Dependencies <a name="dependencies"></a>

Install the dependencies and devDependencies.

```sh
npm install 
# or
npm i 
```

## Tests <a name="tests"></a>

To run tests enter :

```sh
npx hardhat test 
#or
npx hardhat test .\test\charity.js
```

## Deployment <a name="deployment"></a>

In [deployToken.js](deployToken.js), to deploy a contract other than "CharityToken" one can just specify and create another instance of ```getContractFactory``` and repeat the next steps.

### Locally <a name="locally"></a>

To deploy locally you can just write

```sh
# In a terminal
npx hardhat node

```

```sh
# In another terminal
npx hardhat run scripts/deployToken.js --network localhost

```

```sh
# Interact with

#console
npx hardhat console --network localhost
> charity= await ethers.getContractAt("CharityToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3") // replace with CharityToken Contract address
> await charity.charityInfo("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
```

```sh
#app
cd app
```

Create .env file with the contract address

```sh
REACT_APP_CONTRACT="0xXXX...XXX"
```

* The ```REACT_APP_CONTRACT``` enables you to interract with the token contract, it's its address

```sh
npm i
npm start
```

Switch to the ```Localhost 8545``` network in your metamask , this [guide](https://dappradar.com/blog/guide-on-how-to-switch-network-in-metamask) could help you.

### Testnet <a name="testnet"></a>

To deploy on a testnet like *goerli* you need to write the following command ```npx hardhat run scripts/deployToken.js --network goerli``` after setting up the network and other configurations in the [hardhat.config.js](hardhat.config.js) file.

For that you wil need to fill a [.env]() file with an api url key and a private key.

```sh
API_KEY="ec6.........89"
PRIVATE_KEY="0xXXX...XXX"
```

* The ```API_KEY``` enables you to connect to the blockchain through a node given by your provider, the best-known ones are [Infura](https://infura.io/) and [Alchemy](https://www.alchemy.com/) and you can get your api url key there.
* The ```PRIVATE_KEY``` is associated with you blockchain wallet, the most famous one is [Metamask](https://metamask.io/) and can be installed as a browser extension. From there after setting up your wallet you should be able to export your private key in *account details*.

Now [hardhat.config.js](hardhat.config.js) should have these lines where it imports the *.env* variables. The ```module.exports``` is best set as follow with your solidity version compiler.

```js
require('dotenv').config()
const API_KEY = process.env.API_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    goerli: {
      url:`https://goerli.infura.io/v3/${API_KEY}`,
      chainId: 5,
      accounts :[`${PRIVATE_KEY}`],
    },
    mumbai: {
      url:`https://polygon-mumbai.infura.io/v3/${API_KEY}`,
      chainId: 80001,
      accounts :[`${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
  },
};
```

*\* You can then interact with the app, to do that you must change the address in the .env file (REACT_APP_CONTRACT), Switch to the goerli testnet network in your metamask , this [guide](https://dappradar.com/blog/guide-on-how-to-switch-network-in-metamask) could help you.*

*\* Before deploying and using any network make sure you have ETH in you wallet to pay for the transactions fees. Here is a [faucet](https://faucets.chain.link/) where you can refill.*

## Interact : Docker Reactapp Container <a name="docker"></a>

### Prerequisities <a name="dockerPrerequisities"></a>

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Container <a name="dockerContainer"></a>

Let's start our react app

```sh
cd reactapp
docker-compose -f docker-compose.dev.yml up
#or
docker-compose -f docker-compose.dev.yml up # add -d flag to run in daemon mode

docker ps # check containers
```

*\*Once everything has started up, you should be able to access the webapp via [localhost:3000/](http://localhost:3000/) on your host machine.*

### Environment Variables <a name="dockerEnvVariables"></a>

* `REACT_APP_CONTRACT` - Is the token contract
