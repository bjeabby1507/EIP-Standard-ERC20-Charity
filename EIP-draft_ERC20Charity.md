---
eip: 6353
title: Charity token
description: Extension of EIP-20 token that can be partially donated to a charity project
author: Aubay <blockchain-team@aubay.com>, BOCA Jeabby (@bjeabby1507), EL MERSHATI Laith (@lth-elm), KEMP Elia (@eliakemp)
discussions-to: https://ethereum-magicians.org/t/erc20-charity-token/12617
status: Draft
type: Standards Track
category: ERC
created: 2022-05-13
requires: 20
---

## Abstract

An extension to [EIP-20](./eip-20.md) that can automatically send an additional percentage of each transfer to a third party, and that provides an interface for retrieving this information. This can allow token owners to make donations to a charity with every transfer. This can also be used to allow automated savings programs.

## Motivation

There are charity organizations with addresses on-chain, and there are token holders who want to make automated donations. Having a standardized way of collecting and managing these donations helps users and user interface developers. Users can make an impact with their token and can contribute to achieving sustainable blockchain development. Projects can easily retrieve charity donations addresses and rate for a given [EIP-20](./eip-20.md) token, token holders can compare minimum rate donation offers allowed by token contract owners. This standard provides functionality that allows token holders to donate easily.

## Specification

The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

Owner of the contract **MAY**, after review, register charity address in `whitelistedRate` and set globally a default rate of donation. To register the address, the rate **MUST** not be null.

Token holders **MAY** choose and specify a default charity address from `_Recipient`, this address **SHOULD** be different from the null address for the donation to be activated.

The donation is a percentage-based rate model, but the calculation can be done differently. Applications and individuals can implement this standard by retrieving information with `charityInfo()` , which specifies an assigned rate for a given address.

This standard provides functionality that allows token holders to donate easily. The donation when activated is done directly in the overridden `transfer`, `transferFrom`, and `approve` functions.

When `transfer`, `transferFrom` are called the sender's balance is reduced by the initial amount and a donation amount is deduced. The initial transfered amount is transferred to the recipient's balance and an additional donation amount is transfered to a third party (charity). The two transfer are done at the same time and emit two `Transfer` events.
Also, if the account has an insufficient balance to cover the transfer and the donation the whole transfer would revert.

```solidity
// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;
//import "./IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

///
/// @dev Required interface of an ERC20 Charity compliant contract.
///
interface IERC20charity is IERC165 {
    /// ERC165 bytes to add to interface array - set in parent contract
    /// implementing this standard
    ///
    ///type(IERC20charity).interfaceId.interfaceId == 0x557512b6
    /// bytes4 private constant _INTERFACE_ID_ERCcharity = 0x557512b6;
    /// _registerInterface(_INTERFACE_ID_ERCcharity);

    /**
     * @dev Emitted when `_defaultAddress` charity address is modified and set to `whitelistedAddr`.
     */
    event DonnationAddressChanged (address whitelistedAddr);

    /**
     * @dev Emitted when `_defaultAddress` charity address is modified and set to `whitelistedAddr` 
    * and _donation is set to `rate`.
     */
    event DonnationAddressAndRateChanged (address whitelistedAddr,uint256 rate);

    /**
     * @dev Emitted when `whitelistedRate` for `whitelistedAddr` is modified and set to `rate`.
     */
    event ModifiedCharityRate(address whitelistedAddr,uint256 rate);
    
    /**
     * @dev Emitted when `_donation` for `whitelistedAddr` is modified and set to `rate`.
     */
    event  ModifiedCharityCustumRate(address whitelistedAddr,uint256 rate);

    /**
    *@notice Called with the charity address to determine if the contract whitelisted the address
    *and if it is the rate assigned.
    *@param addr - the Charity address queried for donnation information.
    *@return whitelisted - true if the contract whitelisted the address to receive donnation
    *@return defaultRate - the rate defined by the contract owner by default , the minimum rate allowed different from 0
    *@return msgRecipient - msg.sender's donation recipient
    @return RecipientRate - Recipient's default rate set by owner
    *@return msgRate - msg.sender’s donation rate
    */
    function charityInfo(
        address addr
    ) external view returns (
        bool whitelisted,
        uint256 defaultRate,
        address msgRecipient,
        uint256 RecipientRate,
        uint256 msgRate
    );

    /**
    *@notice Get all registered charity addresses.
     */
    function getAllWhitelistedAddresses() external view returns (address[] memory) ;

    /**
    *@notice Display for a user the rate of the default charity address that will receive donation.
    * @param addr The default rate of the addr.
    */
    function getRateOf(address addr) external view returns (uint256);

    /**
    *@notice Set rate for charity address in {whitelistedRate}.
    * @dev Requirements:
     *
     * - `whitelistedAddr` shouldn't be the zero address.
     * - `rate` shouldn't be less than to the default rate.
     *
     * @param whitelistedAddr The address to set as default.
     * @param rate The personalised rate for donation.
     */
    function setRate(address whitelistedAddr , uint256 rate) external;

    /**
    *@notice Set personlised rate for charity address in {_donation}.
    * @dev Requirements:
     *
     * - `rate` shouldn't be less than to the default rate.
     *
     * @param rate The personalised rate for donation.
     */
    function setCustumRate( uint256 rate) external;

    /**
    *@notice Set for a user a default charity address that will receive donation. 
    * The default rate specified in {whitelistedRate} will be applied.
    * @dev Requirements:
     *
     * - `whitelistedAddr` shouldn't be the zero address.
     *
     * @param whitelistedAddr The address to set as default.
     */
    function setRecipient(address whitelistedAddr) external;

    /**
    *@notice Set for a user a default charity address that will receive donation. 
    * The rate is specified by the user.
    * @dev Requirements:
     *
     * - `whitelistedAddr` shouldn't be the zero address.
     * - `rate` shouldn't be less than to the default rate. 
     * or to the rate specified by the owner of this contract in {whitelistedRate}.
     *
     * @param whitelistedAddr The address to set as default.
     * @param rate The personalised rate for donation.
     */
    function setRecipientAddressAndRate(address whitelistedAddr , uint256 rate) external;

    /**
    *@notice Display for a user the default charity address that will receive donation. 
    * The default rate specified in {whitelistedRate} will be applied.
    * @param addr The address to get donnation rate.
     */
    function getRecipientAddressOf(address addr) external view returns (
        address RecipientAddress
    );

    /**
    *@notice Delete The Default Address and so deactivate donnations .
     */
    function deleteRecipient() external;
}

```

### Functions

#### **getAllWhitelistedAddresses**

Get all registered charity addresses.

#### **getrateOf**

Display for a user the rate of the default charity address that will receive donation.

| Parameter | Description |
| ---------|-------------|
|  addr | The addr to check. |

#### **setRate**

Set rate for charity address in {whitelistedRate}.

| Parameter | Description |
| ---------|-------------|
| whitelistedAddr | The address to set as default. |
| rate  | The personalised rate for donation. |

#### **setCustumRate**

Set personlised rate for charity address in {_donation}.

| Parameter | Description |
| ---------|-------------|
| rate  | The personalised rate for donation. |

#### **setRecipient**

Set for a user a default charity address that will receive donation. The default rate specified in {whitelistedRate} will be applied.

| Parameter | Description |
| ---------|-------------|
| whitelistedAddr | The address to set as default.

#### **setRecipientAddressAndRate**

Set for a user a default charity address that will receive donations. The rate is specified by the user.

| Parameter | Description |
| ---------|-------------|
| whitelistedAddr | The address to set as default. |
| rate  | The personalized rate for donation.

#### **getRecipientAddressOf**

Display for a user the default charity address that will receive donations. The default rate specified in {whitelistedRate} will be applied.

| Parameter | Description |
| ---------|-------------|
| addr | The address to get donnation rate.|

#### **deleteRecipient**

Delete The Default Address and so deactivate donations.

#### **charityInfo**

Called with the charity address to determine if the contract whitelisted the address and if it is, the rate assigned.

| Parameter | Description |
| ---------|-------------|
| addr | The Charity address queried for donnation information.

## Rationale

 This EIP chooses to whitelist charity addresses by using an array and keeping track of the "active" status with a mapping `whitelistedRate` to allow multiple choice of recipient and for transparence. The donation address can also be a single address chosen by the owner of the contract and modified by period.

 If the sender balance is insuficent i.e total amount of token (initial transfer + donation) is insuficent the transfer would revert. Donation are done in the `transfer` function to simplify the usage and to not add an additional function, but the implementation could be donne differently, and for exemple allow a transfer to go through without the donation amount when donation is activated. The token implementer can also choose to store the donation in the contract or in another one and add a withdrawal or claimable function, so the charity can claim the allocated amount of token themselves, the additional transfer will be triggered by the charity and not the token holder.

 Also, donations amount are calculated here as a percentage of the amount of token transfered to allow different case scenario, but the token implementer can decide to opt for another approach instead like rounding up the transaction value.

## Backwards Compatibility

This implementation is an extension of the functionality of [EIP-20](./eip-20.md), it introduces new functionality retaining the core interfaces and functionality of the [EIP-20](./eip-20.md) standard. There is a small backwards compatibility issue, indeed if an account has insufficient balance, it's possible for the transfer to fail.

## Test Cases

Tests can be found in [`charity.js`](../assets/eip-6353/test/charity.js).

## Reference Implementation

The reference implementation of the standard can be found under [`contracts/`](../assets/eip-6353/contracts/ERC20Charity.sol) folder.

## Security Considerations

There are no additional security considerations compared to EIP-20.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).
