// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts@4.7.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.0/utils/Counters.sol";

contract SoulBoundTest is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;    

    Counters.Counter private _tokenIdCounter;

    struct NFTMetadata {
        string uri;
    }

    mapping(uint256 => NFTMetadata) private _tokenMetadata;
    mapping(uint256 => bool) private _tokenExists;

    constructor() ERC721("SoulBoundTest", "SBT") {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenMetadata(tokenId, uri);
        _tokenExists[tokenId] = true;
    }

    function _setTokenMetadata(uint256 tokenId, string memory uri) internal {
        _tokenMetadata[tokenId] = NFTMetadata(uri);
    }

    function getTokenMetadata(uint256 tokenId) external view returns (string memory uri) {
        require(_tokenExists[tokenId], "Token does not exist");
        return (_tokenMetadata[tokenId].uri);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
        delete _tokenMetadata[tokenId];
        _tokenExists[tokenId] = false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(from == address(0), "Err: token transfer is BLOCKED");
        super._beforeTokenTransfer(from, to, tokenId);
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