// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./StemsERC721.sol";

/// @title StemsFactory
/// - idea is that we want an erc721 contract per collection as the stems all have their own metadata
/// - for each collection, we call #createToken() with all parameters
/// - handle any create/update/delete of Superfluid streams between a revenue source and an erc721 contract
contract StemsFactory is Ownable {
  address private sf_host;
  address private sf_cfa; // the stored constant flow agreement class address
  address private sf_acceptedToken;

  mapping (address => address[]) private collections; // deployer => [collection1, collection2]
  mapping (address => bool) private tokensDeployed;

  event CollectionCreated(address indexed token, address deployer, string name);
  event StreamUpdated(address indexed token, uint256 tokenId, address sender, int96 flowRate);
  event StreamDeleted(address indexed token, uint256 tokenId, address sender);

  modifier onlyTokensDeployed() {
    require(tokensDeployed[msg.sender] == true, "StemsFactory:: only tokens deployed");
    _;
  }

  /// @dev contract contructor
  constructor(address host, address cfa, address acceptedToken) {
    sf_host = host;
    sf_cfa = cfa;
    sf_acceptedToken = acceptedToken;
  }

  /// @dev deploy a new StemsERC721 contract for a collection
  function createCollection(
    string memory name,
    string memory symbol,
    string memory _baseURI,
    uint256 _availableSupply,
    uint256 _mintCost
  ) external {
    StemsERC721 token = new StemsERC721(
      name,
      symbol,
      _baseURI,
      _availableSupply,
      _mintCost,
      sf_host,
      sf_cfa,
      sf_acceptedToken,
      msg.sender
    );

    collections[msg.sender].push(address(token));
    tokensDeployed[address(token)] = true;

    emit CollectionCreated(address(token), msg.sender, name);
  }

  /// @dev callback for when an instance of StemsERC721 receives a stream update
  /// @param tokenId the specific tokenId that received the stream update
  /// @param sender the account that triggered the change
  /// @param flowRate the new stream flow rate (see SuperReceiver.sol)
  function sf_flowUpdatedCallback(uint256 tokenId, address sender, int96 flowRate) public onlyTokensDeployed {
    if (flowRate == int96(0)) {
      emit StreamDeleted(msg.sender, tokenId, sender);
    } else {
      emit StreamUpdated(msg.sender, tokenId, sender, flowRate);
    }
  }

  receive() external payable {
    revert("StemsFactory:: we do not want your money");
  }
}
