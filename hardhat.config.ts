import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.INFURA_URL);

export default {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
}