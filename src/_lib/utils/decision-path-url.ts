import {
  DecisionPath,
  type SerializableStep,
} from "@/_lib/domain/DecisionPath";
import { DECISION_NODES } from "@/_lib/data/decision-tree";

const VALID_NODE_IDS = new Set(DECISION_NODES.map((n) => n.id));
const PATH_KEY = "path";

/**
 * Serialize a DecisionPath to a URL hash string.
 * Format: #path=nodeId:answer,nodeId:answer (answer is _ when absent)
 */
export function serializePath(path: DecisionPath): string {
  if (path.isEmpty) return "";
  const steps = path.toSerializable();
  const encoded = steps.map((s) => `${s.nodeId}:${s.answer}`).join(",");
  return `#${PATH_KEY}=${encoded}`;
}

/**
 * Deserialize a URL hash string into a DecisionPath.
 * Returns empty path for invalid/malformed input.
 */
export function deserializePath(hash: string): DecisionPath {
  if (!hash || !hash.startsWith("#")) return DecisionPath.empty();

  const params = hash.slice(1);
  const pathParam = params.split("&").find((p) => p.startsWith(`${PATH_KEY}=`));

  if (!pathParam) return DecisionPath.empty();

  const value = pathParam.slice(PATH_KEY.length + 1);
  if (!value) return DecisionPath.empty();

  const parts = value.split(",");
  const steps: SerializableStep[] = [];

  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) return DecisionPath.empty();

    const nodeId = part.slice(0, colonIdx);
    const answer = part.slice(colonIdx + 1);

    if (!VALID_NODE_IDS.has(nodeId)) return DecisionPath.empty();
    if (answer !== "_" && answer !== "Yes" && answer !== "No") {
      return DecisionPath.empty();
    }

    steps.push({ nodeId, answer });
  }

  return DecisionPath.fromSerializable(steps);
}
