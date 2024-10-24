
// test/TokenFactory.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFactory", function () {
    let TokenFactory;
    let tokenFactory;
    let owner;
    let addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        TokenFactory = await ethers.getContractFactory("TokenFactory");
        tokenFactory = await TokenFactory.deploy();
    });

    describe("Token Creation", function () {
        it("Should create a new token", async function () {
            const tx = await tokenFactory.createToken(
                "Test Token",
                "TEST",
                "ipfs://testURI"
            );

            const receipt = await tx.wait();
            const event = receipt.events.find(e => e.event === 'TokenCreated');
            expect(event).to.not.be.undefined;

            const creatorTokens = await tokenFactory.getCreatorTokens(owner.address);
            expect(creatorTokens.length).to.equal(1);
        });

        it("Should track creator's tokens", async function () {
            await tokenFactory.createToken("Token1", "TK1", "ipfs://uri1");
            await tokenFactory.createToken("Token2", "TK2", "ipfs://uri2");

            const tokens = await tokenFactory.getCreatorTokens(owner.address);
            expect(tokens.length).to.equal(2);
        });
    });
});