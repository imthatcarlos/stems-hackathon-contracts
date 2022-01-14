const { updateContractsDeployed, config } = require('./../scripts/utils/migrations');

const getArgs = ({ name }, deployer) => {
  console.log(`getArgs:: from: ${name}`);
  const _config = config[name]?.StemsFactory;

  console.log(JSON.stringify(_config, null, 2));

  return Object.keys(_config).map((k) => _config[k]);
};

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // skip deploy on `npx hardhat node`
  if (network.name === 'hardhat') return;

  const { address } = await deploy('StemsFactory', {
    from: deployer,
    args: getArgs(network, deployer),
    log: true,
  });

  updateContractsDeployed('StemsFactory', address, network.name);
};

module.exports.tags = ['StemsFactory'];
