// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

interface IStemsFactory {
  function sf_flowUpdatedCallback(address token, uint256 tokenId, address sender, int96 flowRate) external;
}
