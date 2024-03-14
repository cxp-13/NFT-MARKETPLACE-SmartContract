import { ethers, network } from "hardhat";
import { BaseContract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

describe("NFTMarketPlace Contract", function () {
  let deployer: Signer;
  let user: Signer;
  let nftMarketPlace: any;
  let basicNft: any;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    console.log("deployer:", await deployer.getAddress());
    console.log("user:", await user.getAddress());

    basicNft = await ethers.deployContract("BasicNft", [], deployer);
    nftMarketPlace = await ethers.deployContract(
      "NFTMarketPlace",
      [],
      deployer
    );

    console.log("BasicNft deployed to:", basicNft.target);
    console.log("NFTMarketPlace deployed to:", nftMarketPlace.target);
    // mint一个nft给用户并且授权给NFT市场
    await basicNft.connect(user).mintNft();
    await basicNft.connect(user).approve(nftMarketPlace.target, 0);
  });

  it("Should list an item", async function () {
    let nftPrice = ethers.parseEther("88");

    await nftMarketPlace.connect(user).listItem(basicNft.target, nftPrice, 0);
    let listing = await nftMarketPlace.getListing(basicNft.target, 0);
    console.log("listing:", listing);
    expect(listing).to.deep.equal([nftPrice, await user.getAddress()]);
  });

  it("Should buy an item and seller can withDraw", async function () {
    // let nftPrice = 888n;
    let nftPrice = ethers.parseEther("88");
    console.log("nftPrice:", nftPrice);
    let [, , buyer] = await ethers.getSigners();
    let buyerAddr = await buyer.getAddress();
    let userAddr = await user.getAddress();
    let buyerBalanceBefore = await network.provider.send("eth_getBalance", [
      buyerAddr,
    ]);
    let userBalanceBefore = await network.provider.send("eth_getBalance", [
      userAddr,
    ]);
    buyerBalanceBefore = ethers.formatEther(buyerBalanceBefore);
    userBalanceBefore = ethers.formatEther(userBalanceBefore);
    console.log("buyerBalanceBefore:", buyerBalanceBefore);
    console.log("userBalanceBefore:", userBalanceBefore);
    // 展示并售出
    await nftMarketPlace.connect(user).listItem(basicNft.target, nftPrice, 0);
    await nftMarketPlace.connect(buyer).buyItem(basicNft.target, 0, {
      value: nftPrice,
    });
    expect(await basicNft.ownerOf(0)).to.equal(await buyer.getAddress());
    expect(await nftMarketPlace.getProceeds(user.getAddress())).to.be.equals(
      nftPrice
    );
    // 取钱
    await nftMarketPlace.connect(user).withDrawProceeds();
    let buyerBalanceAfter = await network.provider.send("eth_getBalance", [
      buyerAddr,
    ]);
    let userBalanceAfter = await network.provider.send("eth_getBalance", [
      userAddr,
    ]);
    buyerBalanceAfter = ethers.formatEther(buyerBalanceAfter);
    userBalanceAfter = ethers.formatEther(userBalanceAfter);
    console.log("buyerBalanceAfter:", buyerBalanceAfter);
    console.log("userBalanceAfter:", userBalanceAfter);
    // 判断前后资产变化
    expect(buyerBalanceBefore - buyerBalanceAfter).to.be.greaterThan(88);
    expect(userBalanceAfter - userBalanceBefore).to.be.lessThan(88);
  });
  // 监测防重入攻击
  it("Check the reentrant", async function () {
    let nftPrice = ethers.parseEther("88");
    console.log("nftPrice:", nftPrice);
    let [, , buyer] = await ethers.getSigners();
    // 展示并售出
    await nftMarketPlace.connect(user).listItem(basicNft.target, nftPrice, 0);
    for (let index = 0; index < 3; index++) {
      nftMarketPlace.connect(buyer).buyItem(basicNft.target, 0, {
        value: nftPrice,
      });
    }
    let proceeds = await nftMarketPlace.getProceeds(user.getAddress());
    console.log("proceeds:", proceeds);
  });

  it("Should cancel a listing", async function () {
    let nftPrice = ethers.parseEther("88");
    await nftMarketPlace.connect(user).listItem(basicNft.target, nftPrice, 0);
    await nftMarketPlace.connect(user).cancelListing(basicNft.target, 0);
    let listing = await nftMarketPlace.getListing(basicNft.target, 0);
    expect(listing).to.deep.equal([
      0n,
      "0x0000000000000000000000000000000000000000",
    ]);
  });

  it("Should update a listing", async function () {
    let nftPrice = ethers.parseEther("88");
    let newNftPrice = ethers.parseEther("888");

    await nftMarketPlace.connect(user).listItem(basicNft.target, nftPrice, 0);
    await nftMarketPlace
      .connect(user)
      .updateListing(basicNft.target, 0, newNftPrice);

    let listing = await nftMarketPlace.getListing(basicNft.target, 0);
    expect(listing).to.deep.equal([newNftPrice, await user.getAddress()]);
  });
});
