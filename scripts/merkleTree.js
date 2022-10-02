const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const csv = require("csv-parser");
const fs = require("fs");
var utils = require("ethers").utils;
const Web3 = require("web3");
const helpers = require("@nomicfoundation/hardhat-network-helpers");


  
  function main() {

    let root;
  
    // import distribution from this file
    const filename =  __dirname + "/gen_file/airdropList.csv";
  
    //file to write the merkel proofs to
    const output_file = "gen_file/drop_ticket_roots.json";
  
    //file that has the user claim list
    const userclaimFile = "gen_file/drop_ticket_claimlist.json";
  
    //contract of items being sent out
    const airdropContract = "0x027Ffd3c119567e85998f4E6B9c3d83D5702660c";
  
    // used to store one leaf for each line in the distribution file
    const token_dist = [];
  
    // used for tracking user_id of each leaf so we can write to proofs file accordingly
    const user_dist_list = [];

    let proof;
  
    // open distribution csv
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (row) => {
        const user_dist = [row["address"], row["amount"]]; // create record to track user_id of leaves
        const leaf_hash = utils.solidityKeccak256(
          ["address", "uint256"],
          [row["address"], row["amount"]]
        ); // encode base data like solidity abi.encode
        user_dist_list.push(user_dist); // add record to index tracker
        token_dist.push(leaf_hash); // add leaf hash to distribution
      })
      .on("end", () => {
        // create merkle tree from token distribution
        const merkle_tree = new MerkleTree(token_dist, keccak256, {
          sortPairs: true,
        });
        // get root of our tree
        root = merkle_tree.getHexRoot();
        console.log(root)
        // create proof file
   //     write_leaves(merkle_tree, token_dist, root);

        
      proof = merkle_tree.getHexProof(utils.solidityKeccak256(
        ["address", "uint256"],
        user_dist_list[0]
      ));

      const data = JSON.stringify(proof);
      console.log(data);

      fs.writeFile(`${__dirname}/drop_ticket_roots.json`, data, (err) =>{
        if(err){
          console.log("Error writing file" ,err)
        } else {
          console.log('JSON data is written to the file successfully')
        }
       })

      });

   
  
  
  }    


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()