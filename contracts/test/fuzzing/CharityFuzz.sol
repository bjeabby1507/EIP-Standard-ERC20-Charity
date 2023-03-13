// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../CharityToken.sol";

/**
*@title ERC720 charity Token Fuzzing contract
*@dev Extension of ERC720 Token that can be partially donated to a charity project
*
*This contract will be used to fuzz the project, and help identify vulnerabilities and bugs.
 */

contract CharityFuzz is CharityToken {

    address add1 = address(0x10000);
    address add2 = address(0x20000);
    address add4 = address(0x40000);
    constructor() CharityToken() {
        // //set value to
        // // addToWhitelist();
        addToWhitelist(add1, 1000); // whitelistedRate[add1] ==1000;
        addToWhitelist(add2, 2000); // whitelistedRate[add2] ==2000;
        addToWhitelist(add4, 4000); // whitelistedRate[add4] ==4000;

        // this.setRecipient(add2);
    }

    function echidna_address() public view returns (bool) {
        return address(this) == address(0x12342);
    }
    
    function echidna_test_owner() public view returns (bool) {
        return owner() == address(0x30000);
    }

    function echidna_test_denominator() public pure returns (bool) {
        return _feeDenominator() == 10000;
    }
    function echidna_test_name() public view returns (bool) {
        string memory name = name();
        return keccak256(abi.encodePacked((name))) == keccak256(abi.encodePacked(("TestToken")));
    }

    function echidna_test_totalSupply() public view returns (bool) {
        uint256 supply = (10000 * 10 ** decimals());
        return totalSupply() >= supply;
    }

    function echidna_test_getRateOf() public view returns (bool) {
        return this.getRateOf(add1) == 1000  && this.getRateOf(add2) ==2000  && this.getRateOf(add4) ==4000 ;
    }

    function echidna_test_whitelistedRate() public view returns (bool) {
        return whitelistedRate[add1] != 0 && whitelistedRate[add2] != 0;
    }

    /////////////////// asertion test
    function assert_test_mint(address add, uint256 amount) public {
        require(msg.sender != owner());
        assert(msg.sender != address(0x30000));
        uint256 previous_balance = this.balanceOf(add);
        mint(add,amount);
        assert(this.balanceOf(add) == previous_balance+amount);
    }

    function assert_test_selfmint(address add) public {
        require(msg.sender == add);
        uint256 amount = 100 * 10 ** decimals();
        uint256 previous_balance = this.balanceOf(add);
        selfmint();
        assert(this.balanceOf(add) == previous_balance+amount);
    }

    //setrate, owner pb, rate in whitlist 
    function assert_test_setRate(address add, uint256 rate) public{
        // require(msg.sender != owner());
        // assert(msg.sender != address(0x30000));
        // require(whitelistedRate[add]== 0);
        // assert( whitelistedRate[add]== 0);
        this.setRate(add,rate);
        assert( whitelistedRate[add]== rate);
        // assert( this.getRateOf(add) == rate);


    }

}
