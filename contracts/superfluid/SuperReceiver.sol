// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import {
  ISuperfluid,
  ISuperToken,
  ISuperApp,
  ISuperAgreement,
  SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
  IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
  SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

// https://github.com/superfluid-finance/protocol-monorepo/blob/dev/examples/tradeable-cashflow/contracts/RedirectAll.sol
contract SuperReceiver is SuperAppBase {
  event ReceiverChanged(address receiver);

  ISuperfluid private _host; // host
  IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
  ISuperToken private _acceptedToken; // accepted token
  address private _receiver;

  modifier onlyHost() {
    require(msg.sender == address(_host), "SuperReceiver: support only one host");
    _;
  }

  modifier onlyExpected(ISuperToken superToken, address agreementClass) {
    require(_isSameToken(superToken), "SuperReceiver: not accepted token");
    require(_isCFAv1(agreementClass), "SuperReceiver: only CFAv1 supported");
    _;
  }

  constructor(address host, address cfa, address acceptedToken, address receiver) {
    require(host != address(0), "host is zero address");
    require(cfa != address(0), "cfa is zero address");
    require(acceptedToken != address(0), "acceptedToken is zero address");
    require(receiver != address(0), "receiver is zero address");
    require(!ISuperfluid(host).isApp(ISuperApp(receiver)), "receiver is an app");

    _host = ISuperfluid(host);
    _cfa = IConstantFlowAgreementV1(cfa);
    _acceptedToken = ISuperToken(acceptedToken);
    _receiver = receiver;

    uint256 configWord =
      SuperAppDefinitions.APP_LEVEL_FINAL |
      SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
      SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
      SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

    _host.registerApp(configWord);
  }

  function currentReceiver() external view returns (uint256 startTime, address receiver, int96 flowRate) {
    if (_receiver != address(0)) {
      (startTime, flowRate,,) = _cfa.getFlow(_acceptedToken, address(this), _receiver);
      receiver = _receiver;
    }
  }

  function _onFlowUpdated(uint256 tokenId, address sender, int96 flowRate) internal virtual {}

  /**************************************************************************
   * SuperApp callbacks
   *************************************************************************/

  function afterAgreementCreated(
    ISuperToken _superToken,
    address _agreementClass,
    bytes32, // _agreementId,
    bytes calldata /*_agreementData*/ ,
    bytes calldata, // _cbdata,
    bytes calldata _ctx
  ) external override onlyExpected(_superToken, _agreementClass) onlyHost returns (bytes memory newCtx) {
    return _updateOutflow(_ctx);
  }

  function afterAgreementUpdated(
    ISuperToken _superToken,
    address _agreementClass,
    bytes32, //_agreementId,
    bytes calldata, //agreementData
    bytes calldata, //_cbdata,
    bytes calldata _ctx
  ) external override onlyExpected(_superToken, _agreementClass) onlyHost returns (bytes memory newCtx) {
    return _updateOutflow(_ctx);
  }

  function afterAgreementTerminated(
    ISuperToken _superToken,
    address _agreementClass,
    bytes32, //_agreementId,
    bytes calldata /*_agreementData*/ ,
    bytes calldata, //_cbdata,
    bytes calldata _ctx
  ) external override onlyHost returns(bytes memory newCtx) {
    // According to the app basic law, we should never revert in a termination callback
    if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass)) return _ctx;

    return _updateOutflow(_ctx);
  }

  /**************************************************************************
   * Redirect Logic
   *************************************************************************/

  /// @dev If a new stream is opened, or an existing one is opened
  function _updateOutflow(bytes calldata ctx) private returns (bytes memory newCtx) {
    newCtx = ctx;
    // @dev This will give me the new flowRate, as it is called in after callbacks
    int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));
    (,int96 outFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), _receiver); // CHECK: unclear what happens if flow doesn't exist.
    int96 inFlowRate = netFlowRate + outFlowRate;

    // CUSTOM STUFF :D
    // decode the context to get the stream creator and the tokenId from `userData`
    ISuperfluid.Context memory decompiledContext = _host.decodeCtx(ctx);
    uint256 tokenId = abi.decode(decompiledContext.userData, (uint256));
    _onFlowUpdated(tokenId, decompiledContext.msgSender, inFlowRate);

    // @dev If inFlowRate === 0, then delete existing flow.
    if (inFlowRate == int96(0)) {
      // @dev if inFlowRate is zero, delete outflow.
      (newCtx, ) = _host.callAgreementWithContext(
        _cfa,
        abi.encodeWithSelector(
          _cfa.deleteFlow.selector,
          _acceptedToken,
          address(this),
          _receiver,
          new bytes(0) // placeholder
        ),
        "0x",
        newCtx
      );
    } else if (outFlowRate != int96(0)) {
      (newCtx, ) = _host.callAgreementWithContext(
        _cfa,
        abi.encodeWithSelector(
          _cfa.updateFlow.selector,
          _acceptedToken,
          _receiver,
          inFlowRate,
          new bytes(0) // placeholder
        ),
        "0x",
        newCtx
      );
    } else {
      // @dev If there is no existing outflow, then create new flow to equal inflow
      (newCtx, ) = _host.callAgreementWithContext(
        _cfa,
        abi.encodeWithSelector(
          _cfa.createFlow.selector,
          _acceptedToken,
          _receiver,
          inFlowRate,
          new bytes(0) // placeholder
        ),
        "0x",
        newCtx
      );
    }
  }

  // @dev Change the Receiver of the total flow
  function _changeReceiver(address newReceiver) internal {
    require(newReceiver != address(0), "New receiver is zero address");
    require(!_host.isApp(ISuperApp(newReceiver)), "New receiver can not be a superApp");

    if (newReceiver == _receiver) return;

    // @dev delete flow to old receiver
    (, int96 outFlowRate, , ) = _cfa.getFlow(_acceptedToken, address(this), _receiver); //CHECK: unclear what happens if flow doesn't exist.
    if (outFlowRate > 0) {
      _host.callAgreement(
        _cfa,
        abi.encodeWithSelector(
          _cfa.deleteFlow.selector,
          _acceptedToken,
          address(this),
          _receiver,
          new bytes(0)
        ),
        "0x"
      );
      // @dev create flow to new receiver
      _host.callAgreement(
        _cfa,
        abi.encodeWithSelector(
          _cfa.createFlow.selector,
          _acceptedToken,
          newReceiver,
          _cfa.getNetFlow(_acceptedToken, address(this)),
          new bytes(0)
        ),
        "0x"
      );
    }
    // @dev set global receiver to new receiver
    _receiver = newReceiver;

    emit ReceiverChanged(_receiver);
  }

  function _isSameToken(ISuperToken superToken) private view returns (bool) {
    return address(superToken) == address(_acceptedToken);
  }

  function _isCFAv1(address agreementClass) private view returns (bool) {
    return ISuperAgreement(agreementClass).agreementType() ==
      keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
  }
}
