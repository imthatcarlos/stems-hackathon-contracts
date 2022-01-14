const {
  expectEvent,
  balance,
  expectRevert,
  constants,
  ether,
  BN,
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const deployFramework = require('@superfluid-finance/ethereum-contracts/scripts/deploy-framework');
const deployTestToken = require('@superfluid-finance/ethereum-contracts/scripts/deploy-test-token');
const deploySuperToken = require('@superfluid-finance/ethereum-contracts/scripts/deploy-super-token');
const SuperfluidSDK = require('@superfluid-finance/js-sdk');

const config = require('../scripts/utils/config.json').localhost.StemsERC721;

const StemsFactory = artifacts.require('StemsFactory');
const StemsERC721 = artifacts.require('StemsERC721');

describe.only('StemsFactory', () => {
  let deployer, user, sf;

  before(async() => {
    ([deployer, user] = await web3.eth.getAccounts());
    await deployFramework((error) => { console.log(error) }, { web3, from: deployer });
    await deployTestToken((error) => { console.log(error) }, [':', 'fDAI'], { web3, from: deployer });
    await deploySuperToken((error) => { console.log(error) }, [':', 'fDAI'], { web3, from: deployer });

    sf = new SuperfluidSDK.Framework({ web3, version: 'test', tokens: ['fDAI'] });
    await sf.initialize();
  })

  describe('createCollection()', () => {
    let tx;

    beforeEach(async () => {
      this.factory = await StemsFactory.new(sf.host.address, sf.agreements.cfa.address, await sf.tokens.fDAI.address);

      tx = await this.factory.createCollection(
        config.name,
        config.symbol,
        config.__baseURI,
        3, // max supply is 3
        new BN(config.mintCost), // 0.1 eth
      );
    });

    it('emits an event', async () => {
      expectEvent(tx, 'CollectionCreated', { deployer, name: config.name });
    });

    it('allows anyone to call #mint() on the newly created token', async () => {
      const token = await StemsERC721.at(tx.logs[0].args.token);

      await token.mint({ from: user, value: new BN(config.mintCost) });
      const balance = await token.balanceOf(user);
      expect(balance.toNumber()).to.equal(1);
    });
  });
});
