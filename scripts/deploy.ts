import { ethers } from "hardhat";

async function main() {
  // 本地Hardhat网络测试
  // const [deployer] = await ethers.getSigners();
  // console.log("Deploying contracts with the account:", deployer.address);

  const basicNft = await ethers.deployContract("BasicNft", []);
  const nftMarketPlace = await ethers.deployContract(
    "NFTMarketPlace",
    [],
  );

  // for (let index = 0; index < 3; index++) {
  //   await basicNft.connect(deployer).mintNft();
  // }
  // let tokenCounter = await basicNft.connect(deployer).getTokenCounter();
  // console.log("Token Counter:", tokenCounter.toString());
  
  console.log("BasicNft address:", basicNft.target);
  console.log("NFTMarketPlace address:", nftMarketPlace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
