import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { config } from "dotenv";
import { ethers } from "hardhat";

config();
const main = async () => {
  const [deployer] = await ethers.getSigners();

  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  const stream = {
    chains: [EvmChain.ETHEREUM, EvmChain.GOERLI, EvmChain.SEPOLIA],
    description: "monitor Bobs wallet",
    tag: "bob",
    webhookUrl: "http://localhost:8080",
    includeNativeTxs: true,
  };

  const newStream = await Moralis.Streams.add(stream);
  const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }

  //@ts-ignore
  // const response = Moralis.Streams.getById({});
  //@ts-ignore
  // console.log(response.raw);

  const response = await Moralis.Streams.addAddress({
    id,
    address: [deployer.address],
  });

  console.log(response.toJSON());
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
