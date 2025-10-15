// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonToken is ERC20, Ownable {
    constructor() ERC20("CarbonToken", "CCT") Ownable(msg.sender) {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    // Owner-only mint function
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
