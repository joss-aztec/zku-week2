pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

function toIdx(row, col) {
    var idx = 0;
    var rowWidth = 1;
    for (var i = 0; i < col; i++) {
        idx += rowWidth;
        rowWidth *= 2;
    }
    return idx + row;
}

function sizeHashes(rows) {
    var rowWidth = 2 ** rows;
    var size = 0;
    while (rowWidth > 1) {
        size += rowWidth;
        rowWidth /= 2;
    }
    return size;
}

template CheckRoot(n) { // compute the root of a MerkleTree of n Levels 
    signal input leaves[2**n];
    signal output root;

    //[assignment] insert your code here to calculate the Merkle root from 2^n leaves
    var hashCount = sizeHashes(n - 1);
    component hashes[hashCount];

    var rowWidth = 2 ** (n - 1);
    var rowEnd = rowWidth;
    for (var i = 0; i < rowEnd; i++) {
        hashes[i] = Poseidon(2);
        hashes[i].inputs[0] = leaves[i * 2];
        hashes[i].inputs[1] = leaves[1 + i * 2];
    }

    var prevRowStart = 0;
    var rowStart = rowEnd;
    while (rowStart < hashCount) {
        rowWidth /= 2;
        rowEnd = rowStart + rowWidth;
        for (var idx = rowStart; idx < rowEnd; idx++) {
            hashes[idx] = Poseidon(2);
            hashes[idx].inputs[0] = hashes[prevRowStart + idx / 2].out;
            hashes[idx].inputs[1] = hashes[prevRowStart + 1 + idx / 2].out;
        }
        prevRowStart = rowStart;
        rowStart = rowEnd;
    }

    root <== hashes[hashCount - 1].out;
}

template MerkleTreeInclusionProof(n) {
    signal input leaf;
    signal input path_elements[n];
    signal input path_index[n]; // path index are 0's and 1's indicating whether the current element is on the left or right
    signal output root; // note that this is an OUTPUT signal

    //[assignment] insert your code here to compute the root from a leaf and elements along the path
    component hashes[n];
    signal prevHash_ifPrevIsRight[n];
    signal pathElem_ifPrevIsLeft[n];
    signal prevHash_ifPrevIsLeft[n];
    signal pathElem_ifPrevIsRight[n];

    var prevHash = leaf;
    for (var i = 0; i < n; i++) {
        hashes[i] = Poseidon(2);
        prevHash_ifPrevIsRight[i] <== prevHash * path_index[i];
        pathElem_ifPrevIsLeft[i] <== path_elements[i] * (1 - path_index[i]);
        prevHash_ifPrevIsLeft[i] <== prevHash * (1 - path_index[i]);
        pathElem_ifPrevIsRight[i] <== path_elements[i] * path_index[i];
        hashes[i].inputs[0] <== prevHash_ifPrevIsLeft[i] + pathElem_ifPrevIsRight[i];
        hashes[i].inputs[1] <== prevHash_ifPrevIsRight[i] + pathElem_ifPrevIsLeft[i];
        prevHash = hashes[i].out;
    }

    root <== hashes[n - 1].out;
}