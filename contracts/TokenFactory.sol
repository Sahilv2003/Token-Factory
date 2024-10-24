// contracts/TokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Token.sol";

contract TokenFactory {
    event TokenCreated(address indexed creator, address tokenAddress, string name, string symbol, string tokenURI);

    mapping(address => address[]) public creatorTokens;
    mapping(address => bool) public tokenExists;

    function createToken(string memory name, string memory symbol, string memory tokenURI) external returns (address) {
        ERC20Token newToken = new ERC20Token(
            name,
            symbol,
            tokenURI,
            msg.sender,
            18 // standard decimals
        );

        address tokenAddress = address(newToken);
        creatorTokens[msg.sender].push(tokenAddress);
        tokenExists[tokenAddress] = true;

        emit TokenCreated(msg.sender, tokenAddress, name, symbol, tokenURI);
        return tokenAddress;
    }

    function getCreatorTokens(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }

    function isTokenFromFactory(address token) external view returns (bool) {
        return tokenExists[token];
    }
}
