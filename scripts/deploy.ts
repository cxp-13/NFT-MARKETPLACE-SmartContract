import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BasicNft = await ethers.getContractFactory("BasicNft");
  const basicNft = await BasicNft.deploy();

  console.log("BasicNft address:", basicNft.target);

  const NFTMarketPlace = await ethers.getContractFactory("NFTMarketPlace");
  const nftMarketPlace = await NFTMarketPlace.deploy();

  console.log("NFTMarketPlace address:", nftMarketPlace.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
