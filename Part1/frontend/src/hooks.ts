import { useContractReads, useContractRead } from "wagmi";
import addresses from "./contracts.json";
import abi from "./merkle_tree_abi.json";

const HASH_COUNT = 15;

const HASH_READS = Array.from({ length: HASH_COUNT }, (_, idx) => ({
  addressOrName: addresses.merkleTree,
  contractInterface: abi,
  functionName: "hashes",
  args: [idx],
}));

const INDEX_READ = {
  addressOrName: addresses.merkleTree,
  contractInterface: abi,
  functionName: "index",
};

function reshape<T>(hashes?: T[]) {
  if (!hashes) return;
  return [
    [hashes[14]],
    [hashes[12], hashes[13]],
    [hashes[8], hashes[9], hashes[10], hashes[11]],
    [
      hashes[0],
      hashes[1],
      hashes[2],
      hashes[3],
      hashes[4],
      hashes[5],
      hashes[6],
      hashes[7],
    ],
  ];
}

export function useMerkleTreeState() {
  const { data: hashesResults } = useContractReads({ contracts: HASH_READS });
  const { data: indexResult } = useContractRead(INDEX_READ);
  const nodes = hashesResults?.map((bigNum) => {
    const bigInt = BigInt(bigNum.toString());
    const hexStr = `0x${bigInt.toString(16)}`.padEnd(66, "0");
    return { bigInt, hexStr };
  });
  const rows = reshape(nodes);
  const index = indexResult ? Number(indexResult?.toString()) : undefined;
  return { rows, index };
}

export type MerkleTreeState = ReturnType<typeof useMerkleTreeState>;
