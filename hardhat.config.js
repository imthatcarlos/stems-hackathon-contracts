require('@nomiclabs/hardhat-truffle5');
require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const settings = {
  optimizer: {
    enabled: true,
    runs: 200
  }
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings
      }
    ],
  },
  paths: {
    artifacts: './build'
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local']
    },
  }
};
