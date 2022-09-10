import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";
import { keccak256 } from "ethers/lib/utils";
import { BindsOnPickup__factory } from "../typechain";

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function parseEther(amount: Number) {
    return ethers.utils.parseUnits(amount.toString(), 18);
}
 

describe("BoP", function () {
    let owner:SignerWithAddress,
          susan:SignerWithAddress,
          bob:SignerWithAddress,
          carl:SignerWithAddress;
        
    let bop:Contract; 

    this.beforeEach(async() => {
        await ethers.provider.send("hardhat_reset", []);
        [owner, susan, bob, carl] = await ethers.getSigners(); 


        const Bop = await ethers.getContractFactory("BindOnPickup", owner);
        bop = await Bop.deploy();  
    })
    

    ////// HAPPY PATH  /////////////////////////
    it("Should mint and burn, self", async() => {  
        await bop.connect(susan).safeMint(susan.address, 'ipfs');
        await bop.connect(susan).burn(0); 
    });

    it("Should mint and burn, other", async() => {  
        await bop.connect(susan).safeMint(carl.address, 'ipfs'); 
        await bop.connect(carl).burn(0); 
    });

    ////// UNHAPPY PATH  ///////////////////////
    it("Should FAIL to burn an non owned token", async() => { 
        await bop.connect(susan).safeMint(carl.address, 'ipfs'); 
        await expect(bop.connect(susan).burn(0)).revertedWith("Only owner of the token can burn it");   
    });
    it("Should FAIL to transfer an owned token", async() => { 
        await bop.connect(susan).safeMint(susan.address, 'ipfs'); 
        await expect(bop.connect(susan).transferFrom(susan.address, carl.address, 0)).revertedWith("Not allowed to transfer token");
    });
});

describe("Tainter", function () {
    let owner:SignerWithAddress,
          susan:SignerWithAddress,
          bob:SignerWithAddress,
          carl:SignerWithAddress;
        
    let bop:Contract; 

    this.beforeEach(async() => {
        await ethers.provider.send("hardhat_reset", []);
        [owner, susan, bob, carl] = await ethers.getSigners();

        const Bop = await ethers.getContractFactory("NFTainter", owner);
        bop = await Bop.deploy();  
    })
    

    ////// HAPPY PATH  /////////////////////////
    it("Should mint and burn, self", async() => {  
        await bop.connect(susan).safeMint(susan.address, 'ipfs');
        await bop.connect(susan).burn(0); 
    });

    it("Should mint and burn, other", async() => {  
        await bop.connect(susan).safeMint(carl.address, 'ipfs'); 
        await bop.connect(susan).burn(0); 
    });

    ////// UNHAPPY PATH  ///////////////////////
    it("Should FAIL to burn an non minted token", async() => { 
        await bop.connect(susan).safeMint(carl.address, 'ipfs'); 
        await expect(bop.connect(carl).burn(0)).revertedWith("Only the minter of the token can burn it");   
    });
    it("Should FAIL to transfer an owned token", async() => { 
        await bop.connect(susan).safeMint(susan.address, 'ipfs'); 
        await expect(bop.connect(susan).transferFrom(susan.address, carl.address, 0)).revertedWith("Not allowed to transfer token");
    });
});
