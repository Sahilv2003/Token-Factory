// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();

    console.log("TokenFactory deployed to:", tokenFactory.target);

    // Save the contract addresses
    const addresses = {
        TokenFactory: tokenFactory.target
    };

    // Save addresses to the frontend
    fs.writeFileSync(
        path.join(__dirname, "../frontend/src/contracts/contractAddresses.json"),
        JSON.stringify(addresses, null, 2)
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// npx hardhat run ./scripts/deploy.js --network holesky
// 0x89de37F99A0eA5A6594Eda4eE567d97e1b8111D9