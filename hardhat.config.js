require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

require("dotenv").config();
var API_KEY = process.env.API_KEY;
var PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
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
      //chainId : 31337, // Hardhat default
      //chainId: 1337, //MetaMask default 
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
    currency: 'USD',
    gasPrice: 21,
  },
};
