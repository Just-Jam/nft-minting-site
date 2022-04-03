//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InspiroNFT is ERC721, Ownable{
    string public baseURI;
    string public baseExtension = ".jpg";
    uint public tokenCount;
    uint public maxSupply;
    uint public mintPrice;

    event NFTMinted(address indexed to, string tokenURI, uint16 tokenCount);

    constructor(
        string memory _name, 
        string memory _symbol,
        string memory _initBaseURI, 
        uint _maxSupply, 
        uint _mintPrice
    ) ERC721(_name, _symbol){
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        baseURI = _initBaseURI;
        _mint(msg.sender, 1);
        tokenCount++;
    }

    function mint(uint _mintAmount) external payable {
        require(_mintAmount > 0);
        require(tokenCount + _mintAmount <= maxSupply);
        require(msg.value >= mintPrice * _mintAmount);

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, tokenCount + i);
        }
    }

    function withdrawEth() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId, baseExtension))
            : "";
    }
}
