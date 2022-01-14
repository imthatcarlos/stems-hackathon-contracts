// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./superfluid/SuperReceiver.sol";
import "./IStemsFactory.sol";

/// @title StemsERC721
contract StemsERC721 is ERC721, SuperReceiver {
  using Counters for Counters.Counter;
  using Strings for uint256;

  Counters.Counter private _tokenIds;

  uint256 public immutable availableSupply;
  uint256 public immutable mintCost;
  string public baseURI;

  IStemsFactory public stemsFactory;

  /// @dev contract contructor
  /// @param name NFT name
  /// @param symbol NFT symbol
  /// @param _baseURI NFT base uri for all token metadata
  /// @param _availableSupply NFT available supply of tokens
  /// @param _mintCost the cost per mint in wei
  /// @param sf_host superfluid host contract
  /// @param sf_cfa superfluid constant flow agreement
  /// @param sf_acceptedToken superfluid accepted super token
  constructor(
    string memory name,
    string memory symbol,
    string memory _baseURI,
    uint256 _availableSupply,
    uint256 _mintCost,
    address sf_host,
    address sf_cfa,
    address sf_acceptedToken,
    address streamRecipient
  ) ERC721(name, symbol) SuperReceiver(sf_host, sf_cfa, sf_acceptedToken, streamRecipient) {

    availableSupply = _availableSupply;
    mintCost = _mintCost;
    baseURI = _baseURI;

    stemsFactory = IStemsFactory(msg.sender); // @TODO: confirm this is the address of StemsFactory; maybe check interface as sanity?
  }

  /// @dev mints 1 token for the caller as long as the tx value is equal to mintCost
  /// - max 1 token per account
  /// - reverts after availableSupply is reached
  /// - tokenIds start at index 1
  function mint() external payable {
    require(balanceOf[msg.sender] == 0, "StemsERC721:: Only 1 token per account");
    require(msg.value == mintCost, "StemsERC721:: tx value must be equal to mintCost");
    require(_tokenIds.current() < availableSupply, "StemsERC721:: Past availableSupply");

    _tokenIds.increment();
    _mint(msg.sender, _tokenIds.current());
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(ownerOf[tokenId] != address(0), "StemsERC721:: tokenId non-existent");

    return string(abi.encodePacked(baseURI, tokenId.toHexString()));
  }

  function _onFlowUpdated(uint256 tokenId, address sender, int96 flowRate) internal virtual override {
    stemsFactory.sf_flowUpdatedCallback(address(this), tokenId, sender, flowRate);
  }

  receive() external payable {
    revert("StemsERC721:: we do not want your money");
  }

  function supportsInterface(bytes4 interfaceId)
    public
    pure
    override(ERC721)
    returns(bool)
  {
    return
      interfaceId == 0x01ffc9a7 || // ERC165 Interface ID for ERC165
      interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
      interfaceId == 0x5b5e139f; // ERC165 Interface ID for ERC721Metadata
  }
}
