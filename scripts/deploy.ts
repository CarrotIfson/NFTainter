import { ethers, hardhatArguments } from "hardhat";
import  * as Config from "./config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  let deployer:SignerWithAddress;
  let target:String;

  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : 'dev';
  [deployer] = await ethers.getSigners();
  target = "0x2c119F0df901Cbc4447a167Cb938C810A9d19Fa3";//"0x7381406Cc03d649F084C87D21dB31D2646615FD2"; 
  console.log('deployer address: ', deployer.address);
  console.log('target address: ', target);

  const NFTainter = await ethers.getContractFactory("NFTainter");
  const nFTainter = await NFTainter.deploy("zeUberNFTainter","NFT");
  console.log('Deployed zeNFTainter on: ', nFTainter.address);
  
  nFTainter.safeMint(target, 'https://ipfs.io/ipfs/QmRRzzoiWAWQeRLUoRjFvJkknapWxK2BvN2qG1ipqKXeHW'); 
  
  Config.setConfig(network + '.NFTainter', nFTainter.address); 
  Config.setConfig(network + '.target', target);  
 

  const SoulBound = await ethers.getContractFactory("BindOnPickup");
  const soulBound = await SoulBound.deploy();
  console.log('Deployed BindOnPickup on: ', soulBound.address);
  
  soulBound.safeMint(target, 'https://ipfs.io/ipfs/QmRRzzoiWAWQeRLUoRjFvJkknapWxK2BvN2qG1ipqKXeHW'); 
  
  Config.setConfig(network + '.SoulBound', soulBound.address); 
  Config.setConfig(network + '.target', target);  

  await Config.updateConfig();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
