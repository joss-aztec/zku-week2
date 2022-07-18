import { useState } from "react";
import { useContractWrite } from "wagmi";
import { useMerkleTreeState } from "./hooks";
import addresses from "./contracts.json";
import abi from "./merkle_tree_abi.json";

const hashRegex = /0x[0-9a-f]{64}/;

const LEAVES = 8;

const INSERT_WRITE = {
  addressOrName: addresses.merkleTree,
  contractInterface: abi,
  functionName: "hashes",
};

export function InsertHash() {
  const tree = useMerkleTreeState();
  const { writeAsync, error } = useContractWrite(INSERT_WRITE);
  const [value, setValue] = useState<string>();
  const valid = value && value === value?.match(hashRegex)?.[0];
  const disabled = !valid || tree.index === undefined || tree.index >= LEAVES;
  console.log(tree);
  const handleInsert = () => {
    if (disabled) return;
    const numStr = BigInt(value).toString();
    writeAsync({ args: [numStr] });
  };
  return (
    <div>
      <input
        placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleInsert} disabled={disabled}>
        Insert
      </button>
      <div>{error?.message}</div>
    </div>
  );
}
