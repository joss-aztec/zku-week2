import { useMerkleTreeState } from "./hooks";
import style from "./MerkleTree.module.css";

export function MerkleTree() {
  const { rows } = useMerkleTreeState();
  return (
    <div className={style.root}>
      {rows?.map((row, i) => (
        <div key={i} className={style.row}>
          {row.map((node, j) => (
            <div key={j} className={style.cell}>
              {node.hexStr}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
