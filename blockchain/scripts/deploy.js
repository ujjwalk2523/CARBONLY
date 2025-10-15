// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const CarbonToken = await hre.ethers.getContractFactory("CarbonToken");
  const carbonToken = await CarbonToken.deploy();

  await carbonToken.deployed();

  console.log("CarbonToken deployed to:", carbonToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
