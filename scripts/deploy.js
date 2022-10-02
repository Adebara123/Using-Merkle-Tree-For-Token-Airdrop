
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const csv = require("csv-parser");
const fs = require("fs");
var utils = require("ethers").utils;
const Web3 = require("web3");
const proof_ = require("./drop_ticket_roots.json");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {


  

  const Token = await ethers.getContractFactory("Erc20Token");
  const token = await Token.deploy()

  await token.deployed()

  console.log(`token address ${token.address}`)


  const MerkleAirdrop = await ethers.getContractFactory("merkle_tree");
  const merkleAirdrop = await MerkleAirdrop.deploy(token.address);
  await merkleAirdrop.deployed();
  console.log("This is your address", merkleAirdrop.address)

  const signerAddrss = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  await helpers.impersonateAccount(signerAddrss);
  const impersonatedSigner = await ethers.getSigner(signerAddrss);
  console.log(impersonatedSigner)

  const transfer = await token.transfer(merkleAirdrop.address, utils.parseEther("100"))
  console.log("Transfering to the contract address",transfer)

  const sendEth = await helpers.setBalance(signerAddrss, ethers.utils.parseEther("2000000"));
  console.log("sending Eth",sendEth)

  const  claim = await merkleAirdrop.connect(impersonatedSigner).claimAirDrop(proof_, utils.parseEther("10"))
  console.log(claim);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});