const fs = require("fs");
const hre = require("hardhat");
const { poseidonContract } = require("circomlibjs");
const { ethers } = hre;

async function deploy() {
  const PoseidonT3 = await ethers.getContractFactory(
    poseidonContract.generateABI(2),
    poseidonContract.createCode(2)
  );
  const poseidonT3 = await PoseidonT3.deploy();
  await poseidonT3.deployed();

  const MerkleTree = await ethers.getContractFactory("MerkleTree", {
    libraries: { PoseidonT3: poseidonT3.address },
  });
  merkleTree = await MerkleTree.deploy();
  await merkleTree.deployed();

  const frontendConfig = { merkleTree: merkleTree.address };
  fs.writeFileSync(
    "./frontend/src/contracts.json",
    JSON.stringify(frontendConfig, null, 2)
  );
}

deploy();
