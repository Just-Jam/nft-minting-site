const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFT Functions", function(){
    let deployer, addr1

    beforeEach(async function(){
        const NFT = await ethers.getContractFactory("InspiroNFT");
        [deployer, addr1] = await ethers.getSigners();
        nft = await NFT.deploy("Inspiro NFT", "INSP", "exampleurl/", 10, toWei(1));
    })

    it("Should deploy successfully", async function(){
        expect(nft.address).to.not.be.undefined
    })
    it("Should mint tokens at 1eth", async function(){
        await nft.connect(addr1).mint(1, {value: toWei(1)})
        expect(await nft.ownerOf(1)).to.equal(deployer.address)
        expect(await nft.ownerOf(2)).to.equal(addr1.address)
        expect(await nft.balanceOf(addr1.address)).to.equal(1)
        expect(await nft.balanceOf(deployer.address)).to.equal(1)
        expect(await ethers.provider.getBalance(nft.address)).to.equal(toWei(1))
    })
})