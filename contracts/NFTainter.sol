// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFTainter is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    constructor(string memory _name, string memory _ticker)
     ERC721(_name, _ticker) {}
    mapping(uint256 => address) private minter;

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        minter[tokenId] = msg.sender;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri); 
    } 

    function minterOf(uint256 tokenId) private view returns(address _minter) {
        _minter = minter[tokenId];
        require(_minter != address(0), "Token does not exist");
    }

    function burn(uint256 tokenId) external {
        require(minterOf(tokenId) == msg.sender, "Only the minter of the token can burn it");
        _burn(tokenId);
    }

    function revoke(uint256 tokenId) external {
        require(minterOf(tokenId) == msg.sender, "Only the minter of the token can revoke it");
        _burn(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256) pure override internal {
        require(from == address(0) || to == address(0), "Not allowed to transfer token");
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId) override internal {

        if (from == address(0)) {
            emit Attest(to, tokenId);
        } else if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
