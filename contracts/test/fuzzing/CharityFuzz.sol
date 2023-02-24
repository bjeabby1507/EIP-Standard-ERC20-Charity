// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../CharityToken.sol";

/**
*@title ERC720 charity Token Fuzzing contract
*@dev Extension of ERC720 Token that can be partially donated to a charity project
*
*This contract will be used to fuzz the project, and help identify vulnerabilities and bugs.
 */

contract CharityFuzz is CharityToken{
    constructor() {}

    function echidna_test_owner() public view returns (bool) {
        return owner() == address(0x30000);
    }

    function echidna_test_denominator() public pure returns (bool) {
        return _feeDenominator() == 10000;
    }

    function echidna_test_whitelistedRate() public view returns (bool) {
        address add1 = address(0x10000);
        address add2 = address(0x20000);
        address add3 = address(0x20000);
        address add4 = address(0x40000);
        return whitelistedRate[add1] ==2000 && whitelistedRate[add2] ==2000 && whitelistedRate[add3] == 0 && whitelistedRate[add4] ==4000;
    }
}
