// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract merkle_tree {

    address airdropContractAddress;

    bytes32 public merkleRoot = 0x07a8ac842da3db6b2acccb026f434356d7ccf125cfd236b1c7145ea1230c21d4;
    constructor (address _airdropContractAddress) {
        airdropContractAddress = _airdropContractAddress;
    }
    

    mapping (address => bool) public addresses;

    function markleProof (bytes32[] calldata _merkleproof, uint _amount) public {
        require(!addresses[msg.sender], "Address has gotten");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        require(MerkleProof.verify(_merkleproof, merkleRoot, leaf), "Invalid proof");

        addresses[msg.sender] = true;
    }


    function claimAirDrop (bytes32[] calldata _merkleproof,uint _amount) public {
       markleProof(_merkleproof, _amount);
       IERC20(airdropContractAddress).transfer(msg.sender, _amount);
    }
}