// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./ERC20Charity.sol";

/**
*@title ERC720 charity Token
*@dev Extension of ERC720 Token that can be partially donated to a charity project
*
*This extensions keeps track of donations to charity addresses. The  whitelisted adress are from a another contract (Reserve)
 */

contract CharityToken is ERC20Charity{
    address private _owner;
    constructor() ERC20("TestToken", "TST") {
        _owner = msg.sender;
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, 
        "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Emitted when `toAdd` charity address is added to `whitelistedRate`.
     */
    event AddedToWhitelist (address toAdd, uint256 rate);

    /**
     * @dev Emitted when `toRemove` charity address is deleted from `whitelistedRate`.
     */
    event RemovedFromWhitelist (address toRemove);

    function owner() public view virtual returns (address) {
        return _owner;
    }

    /** @dev Creates `amount` tokens and assigns them to `to`, increasing
     * the total supply.
     *
     * Requirements:
     *
     * - `to` shouldn't be the zero address.
     *
     * @param to The address to assign the amount to.
     * @param amount The amount of token to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function selfmint() public {
        _mint(msg.sender, 100 * 10 ** decimals());
    }
    
    
    //Test support for ERC-Charity
    bytes4 private constant _INTERFACE_ID_ERC_CHARITY = type(IERC20charity).interfaceId; // 0x557512b6
    //bytes4 private constant _INTERFACE_ID_ERCcharity =type(IERC165).interfaceId; // ERC165S
    function checkInterface(address testContract) external view returns (bool) {
    (bool success) = IERC165(testContract).supportsInterface(_INTERFACE_ID_ERC_CHARITY);
    return success;
    }

    /*function InterfaceId() external returns (bytes4) {
    bytes4 _INTERFACE_ID = type(IERC20charity).interfaceId;
    return _INTERFACE_ID ;
    }*/

    /**
     *@notice Add address to whitelist and set rate to the default rate.
     * @dev Requirements:
     *
     * - `toAdd` shouldn't be the zero address.
     *
     * @param toAdd The address to whitelist.
     */
    function addToWhitelist(address toAdd, uint256 rate) external virtual onlyOwner {
        if (indexOfAddresses[toAdd] == 0) {
            whitelistedRate[toAdd] = rate;
            whitelistedAddresses.push(toAdd);
            indexOfAddresses[toAdd] = whitelistedAddresses.length;
        }

        emit AddedToWhitelist(toAdd,rate);
    }

    /**
     *@notice Remove the address from the whitelist and set rate to the default rate.
     * @dev Requirements:
     *
     * - `toRemove` shouldn't be the zero address.
     *
     * @param toRemove The address to remove from whitelist.
     */
    function deleteFromWhitelist(address toRemove) external virtual onlyOwner {
        uint256 index1 = indexOfAddresses[toRemove];
        require(index1 > 0, "Invalid index"); //Indexing starts at 1, 0 is not allowed
        // move the last item into the index being vacated
        address lastValue = whitelistedAddresses[
            whitelistedAddresses.length - 1
        ];
        whitelistedAddresses[index1 - 1] = lastValue; // adjust for 1-based indexing
        indexOfAddresses[lastValue] = index1;
        whitelistedAddresses.pop();
        indexOfAddresses[toRemove] = 0;

        delete whitelistedRate[toRemove]; //whitelistedRate[toRemove] =0;
        emit RemovedFromWhitelist(toRemove);
    }
    // /**
    //  *@notice Set personlised rate for charity address in {whitelistedRate}.
    //  * @dev Requirements:
    //  *
    //  * - `whitelistedAddr` shouldn't be the zero address.
    //  * - `rate` shouldn't be less than to the default rate.
    //  *
    //  * @param whitelistedAddr The address to set as default.
    //  * @param rate The personalised rate for donation.
    //  */
    // function setRate(
    //     address whitelistedAddr,
    //     uint256 rate
    // ) external override virtual onlyOwner {
    //     require(
    //         rate <= _feeDenominator(),
    //         "ERC20Charity: rate must be between 0 and _feeDenominator"
    //     );
    //     require(
    //         whitelistedRate[whitelistedAddr] != 0,
    //         "ERC20Charity: invalid whitelisted address"
    //     );
    //     require(
    //         rate <= whitelistedRate[whitelistedAddr],
    //         "ERC20Charity: rate fee must be less than the default rate"
    //     );

    //     whitelistedRate[whitelistedAddr] = rate;
    //     emit ModifiedCharityRate(whitelistedAddr, rate);
    // }
}
