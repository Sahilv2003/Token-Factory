
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        ganache: {
            url: "http://127.0.0.1:8545",
            accounts: {
                mnemonic: "test test test test test test test test test test test junk"
            }
        },
        holesky: {
            url: "https://1rpc.io/holesky",
            accounts: [process.env.PRIVATE_KEY],
            chainId: 17000
        },
    },
    paths: {
        artifacts: "./frontend/src/artifacts",
    }
};
