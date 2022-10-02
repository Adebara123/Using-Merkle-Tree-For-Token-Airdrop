// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Erc20Token is ERC20("TIMI", "TIM") {

    address owner;

    constructor () {
        owner = msg.sender;
        _mint(address(this), 10000000e18);
    } 

    modifier onlyOwner () {
        require (owner == msg.sender, "not owner");
        _;
    }
    
    function transferOut (address addr, uint  _amount)external onlyOwner  {

        uint bal = balanceOf(address(this));
        require (bal >= _amount , "You cant send more than balance");
        _transfer(address(this), addr , _amount );
    }

}