import { useState } from 'react';
import {ethers, BigNumber} from 'ethers';
import {Box, Button, Flex, Input, Text} from "@chakra-ui/react";
import roboPunksNFT from './RoboPunksNFT.json';

const roboPunksNFTContractAddress = "0x5E8F981b463208BffBa90775dAA2aBd2725b17f4";

const MainMint = ({accounts, setAccounts}) => {
    //mintAccount，已获取的NFT数量
    const [mintAmount, setMintAmount] = useState(1); //useState的参数为状态初始值，set方法为修改状态的方法
    const isConnected = Boolean(accounts[0]) //通过是否有账户来判断是否连接到MetaMask

    async function handleMint(){
        //如果浏览器上安装了MetaMask
        if(window.ethereum) {
            //获取MetaMask连接的以太坊网络
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //创建合约对象
            const contract = new ethers.Contract(
                roboPunksNFTContractAddress, //合约地址
                roboPunksNFT.abi, //合约abi接口描述
                signer //签名器
            );
            try{
                const response = await contract.mint(BigNumber.from(mintAmount),{
                    value: ethers.utils.parseEther((0.00001 * mintAmount).toString()), //交易的费用，因为合约需要一定数量以太币才能铸币
                });
                console.log('response: ', response);
            } catch (err) {
                console.log('error: ', err);
            }
        }
    }

    //减少铸币数量
    const handleDecrement = () => {
        if(mintAmount <= 1) return; //最少为1
        setMintAmount(mintAmount - 1);
    };

    //增加铸币数量
    const handleIncrement = () => {
        if(mintAmount >= 3) return; //最多为3
        setMintAmount(mintAmount + 1);
    };

    return (
            <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
                <Box width="520px">
                    <Text fontSize="48px" textShadow="0 5px #000000">
                        RoboPunks
                    </Text>
                    <Text
                    fontSize="30px"
                    letterSpacing="-5.5%"
                    fontFamily="VT323"
                    textShadow="0 2px 2px #000000">
                        Mint Your RoboPunks NFT Now !
                    </Text>

                    {isConnected ? (
                        <div>
                            <Flex justify="center" align="center">
                                <Button
                                    backgroundColor="#D6517D"
                                    borderRadius="5px"
                                    boxShadow="0px 2px 2px 1px #0F0F0F"
                                    color="white"
                                    cursor="pointer"
                                    fontFamily="inherit"
                                    padding="15px"
                                    marginTop="10px"
                                    onClick={handleDecrement}
                                >
                                    -
                                </Button>
                                <Input
                                    readOnly
                                    fontFamily="inherit"
                                    width="100px"
                                    height="40px"
                                    textAlign="center"
                                    paddingLeft="19px"
                                    marginTop="10px"
                                    type="number"
                                    value={mintAmount}
                                />
                                <Button
                                    backgroundColor="#D6517D"
                                    borderRadius="5px"
                                    boxShadow="0px 2px 2px 1px #0F0F0F"
                                    color="white"
                                    cursor="pointer"
                                    fontFamily="inherit"
                                    padding="15px"
                                    marginTop="10px"
                                    onClick={handleIncrement}
                                >
                                    +
                                </Button>
                            </Flex>
                            <Button
                            backgroundColor="#D6517D"
                            borderRadius="5px"
                            boxShadow="0px 2px 2px 1px #0F0F0F"
                            color="white"
                            cursor="pointer"
                            fontFamily="inherit"
                            padding="15px"
                            marginTop="10px"
                            onClick={handleMint}
                            >
                                Mint Now
                            </Button>
                        </div>
                    ) : (
                        <Text
                            marginTop="70px"
                            fontSize="30px"
                            letterSpacing="-5.5%"
                            fontFamily="VT323"
                            textShadow="0 3px #000000"
                            color="#D6517D">
                            You must be connected with MetaMask to Mint.
                        </Text>
                )}
            </Box>
        </Flex>
    );
};

export default MainMint;