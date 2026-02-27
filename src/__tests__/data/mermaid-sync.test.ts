import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";

/**
 * Validates that the Mermaid reference diagram stays in sync with the
 * TypeScript decision tree data. Catches drift between the two representations.
 */

const MERMAID_PATH = join(
  __dirname,
  "../../../docs/design-pattern-decision-tree.mermaid"
);

// Map Mermaid node IDs to TypeScript node IDs
const MERMAID_TO_TS: Record<string, string> = {
  Start: "start",
  Creation: "cat-creational",
  Structure: "cat-structural",
  Behavior: "cat-behavioral",
  C1: "c1",
  C2: "c2",
  C3: "c3",
  C4: "c4",
  S1: "s1",
  S2: "s2",
  S3: "s3",
  S4: "s4",
  S5: "s5",
  B1: "b1",
  B2: "b2",
  B3: "b3",
  B4: "b4",
  B5: "b5",
  B6: "b6",
  Singleton: "p-singleton",
  Builder: "p-builder",
  Prototype: "p-prototype",
  AbstractFactory: "p-abstract-factory",
  Factory: "p-factory-method",
  Adapter: "p-adapter",
  Facade: "p-facade",
  Decorator: "p-decorator",
  Proxy: "p-proxy",
  Composite: "p-composite",
  Bridge: "p-bridge",
  Observer: "p-observer",
  Strategy: "p-strategy",
  State: "p-state",
  Command: "p-command",
  Chain: "p-chain-of-responsibility",
  Template: "p-template-method",
  Other: "fallback",
};

function parseMermaidContent(): {
  nodeIds: Set<string>;
  edges: Array<{ source: string; target: string; label?: string }>;
} {
  const content = readFileSync(MERMAID_PATH, "utf-8");

  const nodeIds = new Set<string>();
  const edges: Array<{ source: string; target: string; label?: string }> = [];

  // Find all node references: any known Mermaid ID followed by a definition
  // bracket ([ { ") or used as source/target in an edge
  const knownIds = new Set(Object.keys(MERMAID_TO_TS));

  // Match node definitions: Id["..."], Id{"..."}, Id("...")
  // These can appear standalone or inline in edges
  const nodeDefRegex = /\b(\w+)(?:\["[^"]*"\]|\{[^}]*\}|\("[^"]*"\))/g;
  let match;
  while ((match = nodeDefRegex.exec(content)) !== null) {
    const mermaidId = match[1];
    if (knownIds.has(mermaidId)) {
      const tsId = MERMAID_TO_TS[mermaidId];
      nodeIds.add(tsId);
    }
  }

  // Parse edges: Source -->|Label| Target or Source --> Target
  const edgeRegex = /\b(\w+)\s+-->(?:\|(\w+)\|)?\s+(\w+)/g;
  while ((match = edgeRegex.exec(content)) !== null) {
    const sourceId = MERMAID_TO_TS[match[1]];
    const label = match[2];
    const targetId = MERMAID_TO_TS[match[3]];
    if (sourceId && targetId) {
      edges.push({ source: sourceId, target: targetId, label });
    }
  }

  return { nodeIds, edges };
}

describe("Mermaid / TypeScript sync", () => {
  const mermaid = parseMermaidContent();
  const tsNodeIds = new Set(DECISION_NODES.map((n) => n.id));

  it("every Mermaid node has a corresponding DECISION_NODES entry", () => {
    const missingInTs = [...mermaid.nodeIds].filter((id) => !tsNodeIds.has(id));
    expect(missingInTs).toEqual([]);
  });

  it("every DECISION_NODES entry has a corresponding Mermaid node", () => {
    const missingInMermaid = [...tsNodeIds].filter(
      (id) => !mermaid.nodeIds.has(id)
    );
    expect(missingInMermaid).toEqual([]);
  });

  it("every Mermaid edge has a corresponding DECISION_EDGES entry", () => {
    const missingEdges = mermaid.edges.filter((me) => {
      return !DECISION_EDGES.some(
        (te) =>
          te.source === me.source &&
          te.target === me.target &&
          (me.label ? te.label === me.label : true)
      );
    });
    expect(missingEdges).toEqual([]);
  });

  it("every DECISION_EDGES entry has a corresponding Mermaid edge", () => {
    const missingEdges = DECISION_EDGES.filter((te) => {
      return !mermaid.edges.some(
        (me) =>
          me.source === te.source &&
          me.target === te.target &&
          (te.label ? me.label === te.label : true)
      );
    });
    expect(missingEdges).toEqual([]);
  });

  it("node counts match", () => {
    expect(mermaid.nodeIds.size).toBe(tsNodeIds.size);
  });

  it("edge counts match", () => {
    expect(mermaid.edges.length).toBe(DECISION_EDGES.length);
  });
});
