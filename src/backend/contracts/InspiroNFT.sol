//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InspiroNFT is ERC721, Ownable{
    using Strings for uint256;
    
    string public baseURI;
    string public baseExtension = ".jpg";
    uint public tokenCount;
    uint public immutable maxSupply;
    uint public mintPrice;

    constructor(
        string memory _name, 
        string memory _symbol,
        string memory _initBaseURI, 
        uint _maxSupply, 
        uint _mintPrice
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        baseURI = _initBaseURI;
    }

    function mint(uint _mintAmount) external payable {
        require(_mintAmount > 0);
        require(tokenCount + _mintAmount <= maxSupply);
        if (msg.sender != owner()) {
            require(msg.value >= mintPrice * _mintAmount);
        }
        for (uint256 i = 0; i < _mintAmount; i++) {
            _safeMint(msg.sender, tokenCount + i);
        }
        tokenCount += _mintAmount;
    }

    function withdrawEth() external onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() view internal virtual override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint _tokenId) view public virtual override returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), baseExtension))
            : "";
    }
}
