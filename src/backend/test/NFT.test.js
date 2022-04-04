const {expect} = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFT Functions", function(){
    let deployer, addr1, addr2

    beforeEach(async function(){
        const NFT = await ethers.getContractFactory("InspiroNFT");
        [deployer, addr1, addr2] = await ethers.getSigners();
        nft = await NFT.deploy("Inspiro NFT", "INSP", "exampleurl/", 10, toWei(1));
    })

    //Passed
    // it("Should mint tokens at 1eth, check values", async function(){
    //     await nft.connect(addr1).mint(1, {value: toWei(1)})
    //     expect(await nft.ownerOf(0)).to.equal(deployer.address)
    //     expect(await nft.ownerOf(1)).to.equal(addr1.address)
    //     expect(await nft.balanceOf(addr1.address)).to.equal(1)
    //     expect(await nft.balanceOf(deployer.address)).to.equal(1)
    //     expect(await ethers.provider.getBalance(nft.address)).to.equal(toWei(1))
        
    // })

    it('Should return correct token URI and token count', async function(){
        await nft.connect(addr1).mint(2, {value: toWei(2)})
        expect(await nft.getTokenCount()).to.equal(3)
        expect(await nft.ownerOf(0)).to.equal(deployer.address)
        expect(await nft.ownerOf(1)).to.equal(addr1.address)
        expect(await nft.ownerOf(2)).to.equal(addr1.address)

        const tokeURI0 = await nft.tokenURI(0)
        expect(tokeURI0).to.equal("exampleurl/0.jpg")

        await expect(nft.tokenURI(3)).to.be.revertedWith("Token does not exist")
    })
})