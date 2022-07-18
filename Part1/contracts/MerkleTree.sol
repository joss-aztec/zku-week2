//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {PoseidonT3} from "./Poseidon.sol"; //an existing library to perform Poseidon hash on solidity
import "./verifier.sol"; //inherits with the MerkleTreeInclusionProof verifier contract

contract MerkleTree is Verifier {
    uint256[] public hashes; // the Merkle tree in flattened array form
    uint256 public index = 0; // the current index of the first unfilled leaf
    uint256 public root; // the current Merkle root

    constructor() {
        // [assignment] initialize a Merkle tree of 8 with blank leaves
        // 14
        // 12 13
        // 8 9 10 11
        // 0 1 2 3 4 5 6 7
        uint256 hashCount = 15; // Since we know the size it might as well be hard-coded
        hashes = new uint256[](hashCount);
        uint256 rowWidth = 8;
        uint256 rowEnd = rowWidth;
        uint256 repeatedHash = 0;
        for (uint256 i = 0; i < hashCount; i++) {
            if (i >= rowEnd) {
                rowWidth /= 2;
                rowEnd += rowWidth;
                repeatedHash = PoseidonT3.poseidon(
                    [repeatedHash, repeatedHash]
                );
            }
            hashes[i] = repeatedHash;
        }
        root = hashes[hashCount - 1];
    }

    function insertLeaf(uint256 hashedLeaf) public returns (uint256) {
        // [assignment] insert a hashed leaf into the Merkle tree
        uint256 nodeHash = hashedLeaf;
        uint256 rowWidth = 8;
        uint256 rowStart = 0;
        uint256 rowEnd = rowWidth;
        uint256 idx = index;
        while (idx < hashes.length) {
            hashes[idx] = nodeHash;
            if (idx + 1 == hashes.length) break;
            if (idx % 2 == 0) {
                nodeHash = PoseidonT3.poseidon([nodeHash, hashes[idx + 1]]);
            } else {
                nodeHash = PoseidonT3.poseidon([hashes[idx - 1], nodeHash]);
            }
            idx = rowEnd + (idx - rowStart) / 2;
            rowStart = rowEnd;
            rowWidth /= 2;
            rowEnd += rowWidth;
        }
        index += 1;
        root = hashes[hashes.length - 1];
        return root;
    }

    function verify(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) public view returns (bool) {
        // [assignment] verify an inclusion proof and check that the proof root matches current root
        if (input[0] != root) return false;
        return verifyProof(a, b, c, input);
    }
}
