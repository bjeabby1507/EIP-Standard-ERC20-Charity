// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC20Charity.sol";

/**
*@title ERC720 charity Token
*@dev Extension of ERC720 Token that can be partially donated to a charity project
*
*This extensions keeps track of donations to charity addresses. The  whitelisted adress are from a another contract (Reserve)
 */

contract CharityToken is ERC20Charity{
    constructor() ERC20("TestToken", "TST") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    /** @dev Creates `amount` tokens and assigns them to `to`, increasing
     * the total supply.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     *
     * @param to The address to assign the amount to.
     * @param amount The amount of token to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    
    //Test support for ERC-Charity
    bytes4 private constant _INTERFACE_ID_ERCcharity = type(IERC20charity).interfaceId; // 0x557512b6
    //bytes4 private constant _INTERFACE_ID_ERCcharity =type(IERC165).interfaceId; // ERC165S
    function checkInterface(address _contract) external returns (bool) {
    (bool success) = IERC165(_contract).supportsInterface(_INTERFACE_ID_ERCcharity);
    return success;
    }

    /*function InterfaceId() external returns (bytes4) {
    bytes4 _INTERFACE_ID = type(IERC20charity).interfaceId;
    return _INTERFACE_ID ;
    }*/

}
