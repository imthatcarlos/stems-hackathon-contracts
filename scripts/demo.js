// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { GraphQLClient } = require('graphql-request');
const { Framework } = require('@superfluid-finance/sdk-core');
const SuperfluidSDK = require("@superfluid-finance/js-sdk");
const SuperTokenABI = require("@superfluid-finance/ethereum-contracts/build/contracts/ISuperToken.json").abi;

const networkName = hre.network.name
const { contractsFile, contractsDeployed, config } = require("./utils/migrations");
const tokenConfig = require('../scripts/utils/config.json').localhost.StemsERC721;
const { SUBGRAPH_URL } = process.env;
const { QUERY_COLLECTIONS } = require('./graphql/StemsFactory');

const MAX_SUPPLY = 5;

async function getStemsFactory() {
  const StemsFactory = await hre.ethers.getContractFactory('StemsFactory');
  const contract = await StemsFactory.attach(contractsDeployed['StemsFactory']);
  console.log("StemsFactory deployed to:", contract.address.toLowerCase());
  return contract;
};

async function getStemsERC721(address) {
  const StemsERC721 = await hre.ethers.getContractFactory('StemsERC721');
  return await StemsERC721.attach(address);
  // console.log("StemsERC721 deployed to:", contract.address);
};

const _createCollection = async (factory, deployer) => {
  console.log('_createCollection...');
  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await hre.ethers.provider.getFeeData();

  const tx = await factory.createCollection(
    tokenConfig.name,
    tokenConfig.symbol,
    tokenConfig.__baseURI,
    MAX_SUPPLY, // max supply is 5
    hre.ethers.BigNumber.from(tokenConfig.mintCost), // 0.1 eth
    { maxPriorityFeePerGas, maxFeePerGas }
  );
  console.log(`tx: ${tx.hash}`);
  await tx.wait(); // wait for block to be mined
};

const _getCollections = async ({ address }) => {
  const client = new GraphQLClient(SUBGRAPH_URL);
  const { stemsCollections } = await client.request(QUERY_COLLECTIONS, { factory: address.toLowerCase() });
  return stemsCollections;
}

const _getAvailableCollections = async ({ address }) => {
  const collections = await _getCollections({ address });

  return (await Promise.all(collections.map(async(collection) => {
    const token = await getStemsERC721('0xb72ba9a6fc9274a579577a28d604e7150f384dce');
    const [_avail, _total, _mintCost] = await Promise.all([
      token.availableSupply(),
      token.totalSupply(),
      token.mintCost()
    ]);
    collection.availableSupply = _avail.toNumber();
    collection.totalSupply = _total.toNumber();
    collection.mintCost = _mintCost;
    if (_avail - _total > 0) return collection;
  }))).filter((c) => c);
};

const _mintSingle = async (account, collectionData) => {
  console.log('_mintSingle...');
  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await hre.ethers.provider.getFeeData();
  const token = await getStemsERC721('0xb72ba9a6fc9274a579577a28d604e7150f384dce');//collection.contract.id);
  const tx = await token.mint({
    from: account,
    value: hre.ethers.utils.formatUnits(collectionData.mintCost, 'wei'),
    maxPriorityFeePerGas,
    maxFeePerGas
  });
  console.log(`tx: ${tx.hash}`);
  await tx.wait();
};

const seed = async (factory, address) => {
  await _createCollection(factory, address);

  const collections = await _getAvailableCollections(factory);

  if (collections.length) {
    console.log(JSON.stringify({ collections }, null, 2));
    await _mintSingle(address, collections[0]); // just mint for the first one
  } else {
    console.log('no collections :/');
    process.exit(0);
  }

  return collections;
};

// // not working
// const upgradeUSDC = async ({ provider }, { address, privateKey }) => {
//   console.log('upgradeUSDC...');
//   const sf = new SuperfluidSDK.Framework({
//     ethers: provider,
//     tokens: ["fUSDC"],
//   });
//   await sf.initialize();
//
//   // error: TypeError: factory.createERC20Wrapper is not a function
//   const superToken = await sf.createERC20Wrapper(sf.tokens.fUSDC, { from: address });
//   console.log(superToken);
// }

  const upgradeUSDC = async (factory, { address, privateKey }, amount = 100) => {
  console.log('upgradeUSDC... (must have called approve on fUSDC first)');
  const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await hre.ethers.provider.getFeeData();
  const fUSDCx = config[networkName].StemsFactory.acceptedToken;
  let wallet = new hre.ethers.Wallet(privateKey);
  wallet = wallet.connect(hre.ethers.provider);
  const contract = await new hre.ethers.Contract(fUSDCx, SuperTokenABI, wallet);

  console.log("using SuperTokenFactory deployed to:", contract.address.toLowerCase());
  const tx = await contract.upgrade(hre.ethers.utils.parseUnits(amount.toString(), 'ether'), { maxFeePerGas, maxPriorityFeePerGas, gasLimit: 100000 });
  console.log(`tx: ${tx.hash}`);
  await tx.wait();
}

// for demo purposes use fUSDCx (make sure to fund in the dashboard!)
const createStream = async ({ provider }, collections, { address, privateKey }) => {
  console.log(`createStream...`);
  const collectionToSponsor = collections[0].contract.id;
  const tokenToSponsor = parseInt(collections[0].contract.tokens[0].identifier);

  const sf = await Framework.create({ networkName, provider });
  const signer = sf.createSigner({ privateKey, provider });

  const flowRate = hre.ethers.utils.parseUnits('0.0001', 'ether'); // 1/10k of a penny per second

  try {
    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await hre.ethers.provider.getFeeData();
    const createFlowOperation = sf.cfaV1.createFlow({
      sender: address,
      receiver: collectionToSponsor,
      flowRate: flowRate,
      superToken: config[networkName].StemsFactory.acceptedToken,
      userData: hre.ethers.utils.defaultAbiCoder.encode([ 'uint' ], [ tokenToSponsor ]),
      overrides: { maxFeePerGas, maxPriorityFeePerGas, gasLimit: 2100000 }
    });

    const tx = await createFlowOperation.exec(signer);
    console.log(`tx: ${tx.hash}`);
    await tx.wait();
  } catch (error) {
    console.error(error);
  }
};

async function main() {
  const [{ address }, accountTwo] = await hre.ethers.getSigners();
  console.log(`account: ${address}`);

  const factory = await getStemsFactory();

  // !! only need to do this once for the demo
  // const collections = await seed(factory, address);
  const collections = await _getCollections(factory);
  console.log(JSON.stringify({ collections }, null, 2))

  // the magic; in this case, account two will upgrade some of their fUSDC and then create a stream to the first collection contract available
  // await upgradeUSDC(factory, { address: accountTwo.address, privateKey: process.env.PRIVATE_KEY_2 });
  // await createStream(factory, collections, { address: accountTwo.address, privateKey: process.env.PRIVATE_KEY_2 });
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
