// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract RoboPunksNFT is ERC721,Ownable{
    uint256 public mintPrice; // 铸造一个NFT所需以太币费用
    uint256 public totalSupply; // 已经铸造的NFT数量
    uint256 public maxSupply; // NFT的最大供应量
    uint256 public maxPerWallet; //每个钱包地址能够持有NFT的最大数量
    bool public isPublicMintEnabled; //是否开启NFT铸造的功能
    string internal baseTokenUri; // NFT对应的图片基础地址
    address payable public withdrawWallet; //提款账户，用于接收合约的以太
    mapping(address => uint256) public walletMints; //记录账户地址已有的NFT数量

    constructor() payable ERC721('RoboPunks','RP'){
        mintPrice = 0.00001 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
        // set withdraw wallet address,设置提款账户，没有设置的话，提款账户就是默认值0x0
    }

    //合约创建者调用，是否开启NFT铸造功能
    function setIsPubliicMintEnabled(bool isPublicMintEnabled_) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    //合约创建者调用，设置图像基础地址
    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri  = baseTokenUri_;
    }

    //覆盖接口中的函数，这主要是opensea调用来显示图像的，类似于一个约定
    function tokenURI(uint256 tokenId_) public view override returns (string memory){
        require(_exists(tokenId_),'Token does not exist!');
        return string(abi.encodePacked(baseTokenUri,Strings.toString(tokenId_),".json"));
    }

    //合约创建者调用，提取合约地址里面的以太币
    function withdraw() external onlyOwner {
        (bool success,) = withdrawWallet.call{value:address(this).balance}(''); //向提款账户转账
        require(success,'withdraw failed');
    }

    //铸币函数，铸造NFT，paybale关键词是为了让这个函数被调用时可以接收以太，不加payable的话，在调用这个函数时就不能向其发送以太
    function mint(uint256 quantity_) public payable {
        require(isPublicMintEnabled,'minting not enabled');
        require(msg.value == quantity_ * mintPrice,'wrong mint value');
        require(totalSupply + quantity_ <= maxSupply,'sold out');
        require(walletMints[msg.sender] + quantity_ <= maxPerWallet, 'exceed max wallet');
        
        for(uint256 i=0;i<quantity_;i++){
            uint256 newTokenId = totalSupply+1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
        }
    }
}
