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
    rinkeby: {
      url:`https://rinkeby.infura.io/v3/${API_KEY}`,
      accounts :[`${PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    currency: 'EUR',
    gasPrice: 21,
  },
};
