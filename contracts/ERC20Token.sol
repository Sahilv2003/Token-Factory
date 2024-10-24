// contracts/ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    string public tokenURI;
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        string memory _tokenURI,
        address initialOwner,
        uint8 decimalsValue
    ) ERC20(name, symbol) Ownable(initialOwner) {
        tokenURI = _tokenURI;
        _decimals = decimalsValue;
        _mint(initialOwner, 1000000 * 10 ** decimalsValue);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
