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
    * @param addr The addr to check.
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