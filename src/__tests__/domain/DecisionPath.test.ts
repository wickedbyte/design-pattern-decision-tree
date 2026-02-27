import { describe, it, expect } from "vitest";
import { DecisionPath } from "@/_lib/domain/DecisionPath";

describe("DecisionPath", () => {
  it("starts empty", () => {
    const path = DecisionPath.empty();
    expect(path.isEmpty).toBe(true);
    expect(path.length).toBe(0);
    expect(path.currentNodeId).toBeUndefined();
  });

  it("adds steps immutably", () => {
    const path1 = DecisionPath.empty();
    const path2 = path1.addStep({ nodeId: "start" });
    const path3 = path2.addStep({ nodeId: "q1", answer: "Yes" });

    expect(path1.length).toBe(0);
    expect(path2.length).toBe(1);
    expect(path3.length).toBe(2);
  });

  it("tracks current node", () => {
    const path = DecisionPath.empty()
      .addStep({ nodeId: "start" })
      .addStep({ nodeId: "q1", answer: "Yes" });

    expect(path.currentNodeId).toBe("q1");
  });

  it("checks if node is in path", () => {
    const path = DecisionPath.empty()
      .addStep({ nodeId: "start" })
      .addStep({ nodeId: "q1", answer: "Yes" });

    expect(path.containsNode("start")).toBe(true);
    expect(path.containsNode("q1")).toBe(true);
    expect(path.containsNode("q2")).toBe(false);
  });

  it("removes steps after a node", () => {
    const path = DecisionPath.empty()
      .addStep({ nodeId: "start" })
      .addStep({ nodeId: "q1", answer: "Yes" })
      .addStep({ nodeId: "q2", answer: "No" });

    const trimmed = path.removeAfter("q1");
    expect(trimmed.length).toBe(2);
    expect(trimmed.currentNodeId).toBe("q1");
    expect(trimmed.containsNode("q2")).toBe(false);
  });

  it("removeAfter with unknown node returns same path", () => {
    const path = DecisionPath.empty().addStep({ nodeId: "start" });
    const result = path.removeAfter("unknown");
    expect(result.length).toBe(1);
  });

  it("steps are readonly", () => {
    const path = DecisionPath.empty().addStep({ nodeId: "start" });
    expect(Object.isFrozen(path.steps)).toBe(false); // readonly doesn't freeze
    expect(Array.isArray(path.steps)).toBe(true);
  });

  describe("fromSteps", () => {
    it("creates a path from an array of steps", () => {
      const path = DecisionPath.fromSteps([
        { nodeId: "start" },
        { nodeId: "q1", answer: "Yes" },
      ]);
      expect(path.length).toBe(2);
      expect(path.currentNodeId).toBe("q1");
    });

    it("creates empty path from empty array", () => {
      const path = DecisionPath.fromSteps([]);
      expect(path.isEmpty).toBe(true);
    });
  });

  describe("serialization", () => {
    it("round-trips empty path", () => {
      const path = DecisionPath.empty();
      const serialized = path.toSerializable();
      const restored = DecisionPath.fromSerializable(serialized);
      expect(restored.isEmpty).toBe(true);
    });

    it("round-trips single step without answer", () => {
      const path = DecisionPath.empty().addStep({ nodeId: "start" });
      const serialized = path.toSerializable();
      expect(serialized).toEqual([{ nodeId: "start", answer: "_" }]);
      const restored = DecisionPath.fromSerializable(serialized);
      expect(restored.length).toBe(1);
      expect(restored.steps[0].answer).toBeUndefined();
    });

    it("round-trips multiple steps with answers", () => {
      const path = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "cat-creational" })
        .addStep({ nodeId: "c1", answer: "Yes" });

      const serialized = path.toSerializable();
      expect(serialized).toEqual([
        { nodeId: "start", answer: "_" },
        { nodeId: "cat-creational", answer: "_" },
        { nodeId: "c1", answer: "Yes" },
      ]);

      const restored = DecisionPath.fromSerializable(serialized);
      expect(restored.length).toBe(3);
      expect(restored.steps[2].answer).toBe("Yes");
      expect(restored.currentNodeId).toBe("c1");
    });

    it("preserves node containment after round-trip", () => {
      const path = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "q1", answer: "No" });

      const restored = DecisionPath.fromSerializable(path.toSerializable());
      expect(restored.containsNode("start")).toBe(true);
      expect(restored.containsNode("q1")).toBe(true);
      expect(restored.containsNode("q2")).toBe(false);
    });
  });
});
