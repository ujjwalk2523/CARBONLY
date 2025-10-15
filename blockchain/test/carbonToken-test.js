const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonToken", function () {
  let CarbonToken, carbonToken, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    CarbonToken = await ethers.getContractFactory("CarbonToken");
    carbonToken = await CarbonToken.deploy();
    await carbonToken.deployed();
  });

  it("Should assign initial supply to deployer", async function () {
    const ownerBalance = await carbonToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("Should allow owner to mint tokens", async function () {
    await carbonToken.mint(addr1.address, ethers.utils.parseUnits("100", 18));
    const addr1Balance = await carbonToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseUnits("100", 18));
  });

  it("Should prevent non-owner from minting", async function () {
    await expect(
      carbonToken.connect(addr1).mint(addr1.address, ethers.utils.parseUnits("100", 18))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should transfer tokens between accounts", async function () {
    await carbonToken.transfer(addr1.address, ethers.utils.parseUnits("50", 18));
    const addr1Balance = await carbonToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.utils.parseUnits("50", 18));
  });
});
