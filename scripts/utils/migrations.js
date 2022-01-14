const fs = require("fs");
const path = require("path");

const DEFAULT_NETWORK = "localhost";

// to support old way --network localhost
const argValue = (arg, defaultValue) =>
  process.argv.includes(arg)
    ? process.argv[process.argv.indexOf(arg) + 1]
    : typeof defaultValue === "function"
    ? defaultValue()
    : defaultValue;

const network = process.env.HARDHAT_NETWORK || DEFAULT_NETWORK;
const CONTRACTS_PATH = `./${network}-contracts.json`;

const contractsFile = () => path.join(__dirname, CONTRACTS_PATH);
const contractsDeployed = JSON.parse(fs.readFileSync(contractsFile(), "utf8"));

const updateContractsDeployed = (contract, address) => {
  contractsDeployed[contract] = address;
  fs.writeFileSync(contractsFile(), JSON.stringify(contractsDeployed, null, 2));
};

const updateConfig = (_config) => {
  fs.writeFileSync(path.join(__dirname, './config.json'), JSON.stringify(_config, null, 2));
};

module.exports = {
  CONTRACTS_PATH,
  contractsFile,
  contractsDeployed,
  updateContractsDeployed,
  config: require('./config.json'),
  updateConfig,
};
