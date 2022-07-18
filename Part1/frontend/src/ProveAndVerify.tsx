import { groth16 } from "snarkjs";
import { MerkleTreeState } from "./hooks";

const loc = window.location;
const siteRoot = `${loc.protocol}//${loc.hostname}:${loc.port}`;
const wasmUrl = `${siteRoot}/circuit.wasm`;
const zkeyUrl = `${siteRoot}/circuit_final.zkey`;

function getSiblingIdxInRow(idx: number) {
  return idx % 2 === 0 ? idx + 1 : idx - 1;
}

function getLeftRightFlag(idx: number) {
  return idx % 2 === 0 ? "0" : "1";
}

function getParentIdxInRow(idx: number) {
  return Math.floor(idx / 2);
}

function getProofInput(value: string, tree: MerkleTreeState) {
  if (tree.index === undefined || tree.rows === undefined) {
    throw new Error("Tree not loaded");
  }
  const sib0IdxInRow = getSiblingIdxInRow(tree.index);
  const sib0Hash = tree.rows[3][sib0IdxInRow].bigInt.toString();
  const parent1IdxInRow = getParentIdxInRow(sib0IdxInRow);
  const sib1IdxInRow = getSiblingIdxInRow(parent1IdxInRow);
  const sib1Hash = tree.rows[2][sib1IdxInRow].bigInt.toString();
  const parent2IdxInRow = getParentIdxInRow(sib1IdxInRow);
  const sib2IdxInRow = getSiblingIdxInRow(parent2IdxInRow);
  const sib2Hash = tree.rows[1][sib2IdxInRow].bigInt.toString();
  return {
    leaf: BigInt(value).toString(),
    path_elements: [sib0Hash, sib1Hash, sib2Hash],
    path_index: [
      getLeftRightFlag(sib0IdxInRow),
      getLeftRightFlag(sib1IdxInRow),
      getLeftRightFlag(sib2IdxInRow),
    ],
  };
}

export async function prove(value: string, tree: MerkleTreeState) {
  const { proof, publicSignals } = await groth16.fullProve(
    getProofInput(value, tree),
    wasmUrl,
    zkeyUrl
  );
}
