import { describe, it, expect } from "vitest";
import { DECISION_NODES, DECISION_EDGES } from "@/_lib/data/decision-tree";
import { getPatternBySlug } from "@/_lib/data/patterns";

describe("Decision Tree Data", () => {
  const nodeMap = new Map(DECISION_NODES.map((n) => [n.id, n]));

  it("has exactly one start node", () => {
    const startNodes = DECISION_NODES.filter((n) => n.kind === "start");
    expect(startNodes).toHaveLength(1);
  });

  it("has exactly 3 category nodes", () => {
    const categoryNodes = DECISION_NODES.filter((n) => n.kind === "category");
    expect(categoryNodes).toHaveLength(3);
  });

  it("has exactly one fallback node", () => {
    const fallbackNodes = DECISION_NODES.filter((n) => n.kind === "fallback");
    expect(fallbackNodes).toHaveLength(1);
  });

  it("has 17 pattern leaf nodes", () => {
    const patternNodes = DECISION_NODES.filter((n) => n.kind === "pattern");
    expect(patternNodes).toHaveLength(17);
  });

  it("every edge references existing source and target nodes", () => {
    for (const edge of DECISION_EDGES) {
      expect(
        nodeMap.has(edge.source),
        `Edge '${edge.id}' source '${edge.source}' not found`
      ).toBe(true);
      expect(
        nodeMap.has(edge.target),
        `Edge '${edge.id}' target '${edge.target}' not found`
      ).toBe(true);
    }
  });

  it("every pattern node maps to a defined pattern", () => {
    const patternNodes = DECISION_NODES.filter((n) => n.kind === "pattern");
    for (const node of patternNodes) {
      expect(node.patternSlug).toBeDefined();
      expect(
        getPatternBySlug(node.patternSlug!),
        `Pattern node '${node.id}' references unknown slug '${node.patternSlug}'`
      ).toBeDefined();
    }
  });

  it("tree is a valid DAG (no cycles)", () => {
    // Build adjacency list
    const adj = new Map<string, string[]>();
    for (const edge of DECISION_EDGES) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      adj.get(edge.source)!.push(edge.target);
    }

    // DFS cycle detection
    const visited = new Set<string>();
    const inStack = new Set<string>();

    function hasCycle(nodeId: string): boolean {
      if (inStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);
      inStack.add(nodeId);
      for (const neighbor of adj.get(nodeId) ?? []) {
        if (hasCycle(neighbor)) return true;
      }
      inStack.delete(nodeId);
      return false;
    }

    for (const node of DECISION_NODES) {
      expect(hasCycle(node.id)).toBe(false);
    }
  });

  it("every node (except start) is reachable from start", () => {
    const adj = new Map<string, string[]>();
    for (const edge of DECISION_EDGES) {
      if (!adj.has(edge.source)) adj.set(edge.source, []);
      adj.get(edge.source)!.push(edge.target);
    }

    const reachable = new Set<string>();
    const queue = ["start"];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (reachable.has(current)) continue;
      reachable.add(current);
      for (const neighbor of adj.get(current) ?? []) {
        queue.push(neighbor);
      }
    }

    for (const node of DECISION_NODES) {
      expect(
        reachable.has(node.id),
        `Node '${node.id}' is not reachable from start`
      ).toBe(true);
    }
  });

  it("every edge has unique id", () => {
    const ids = DECISION_EDGES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every node has unique id", () => {
    const ids = DECISION_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
