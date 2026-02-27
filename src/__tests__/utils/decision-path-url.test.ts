import { describe, it, expect } from "vitest";
import { DecisionPath } from "@/_lib/domain/DecisionPath";
import { serializePath, deserializePath } from "@/_lib/utils/decision-path-url";

describe("decision-path-url", () => {
  describe("serializePath", () => {
    it("returns empty string for empty path", () => {
      expect(serializePath(DecisionPath.empty())).toBe("");
    });

    it("serializes a single step", () => {
      const path = DecisionPath.empty().addStep({ nodeId: "start" });
      expect(serializePath(path)).toBe("#path=start:_");
    });

    it("serializes multiple steps with answers", () => {
      const path = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "cat-creational" })
        .addStep({ nodeId: "c1", answer: "Yes" });
      expect(serializePath(path)).toBe("#path=start:_,cat-creational:_,c1:Yes");
    });

    it("serializes No answers", () => {
      const path = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "c1", answer: "No" });
      expect(serializePath(path)).toBe("#path=start:_,c1:No");
    });
  });

  describe("deserializePath", () => {
    it("returns empty path for empty string", () => {
      expect(deserializePath("").isEmpty).toBe(true);
    });

    it("returns empty path for hash without path param", () => {
      expect(deserializePath("#other=value").isEmpty).toBe(true);
    });

    it("returns empty path for empty path param", () => {
      expect(deserializePath("#path=").isEmpty).toBe(true);
    });

    it("returns empty path for malformed input (no colon)", () => {
      expect(deserializePath("#path=start").isEmpty).toBe(true);
    });

    it("returns empty path for invalid node IDs", () => {
      expect(deserializePath("#path=nonexistent:_").isEmpty).toBe(true);
    });

    it("returns empty path for invalid answer values", () => {
      expect(deserializePath("#path=start:Maybe").isEmpty).toBe(true);
    });

    it("deserializes a single step", () => {
      const path = deserializePath("#path=start:_");
      expect(path.length).toBe(1);
      expect(path.steps[0].nodeId).toBe("start");
      expect(path.steps[0].answer).toBeUndefined();
    });

    it("deserializes multiple steps", () => {
      const path = deserializePath("#path=start:_,cat-creational:_,c1:Yes");
      expect(path.length).toBe(3);
      expect(path.steps[0].nodeId).toBe("start");
      expect(path.steps[1].nodeId).toBe("cat-creational");
      expect(path.steps[2].nodeId).toBe("c1");
      expect(path.steps[2].answer).toBe("Yes");
    });

    it("returns empty for partially invalid paths", () => {
      // First step valid, second step has invalid node
      expect(deserializePath("#path=start:_,invalid-node:Yes").isEmpty).toBe(
        true
      );
    });
  });

  describe("round-trip", () => {
    it("round-trips through serialize/deserialize", () => {
      const original = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "cat-creational" })
        .addStep({ nodeId: "c1", answer: "Yes" })
        .addStep({ nodeId: "p-singleton" });

      const hash = serializePath(original);
      const restored = deserializePath(hash);

      expect(restored.length).toBe(original.length);
      expect(restored.currentNodeId).toBe(original.currentNodeId);
      for (const step of original.steps) {
        expect(restored.containsNode(step.nodeId)).toBe(true);
      }
    });

    it("round-trips full behavioral path", () => {
      const original = DecisionPath.empty()
        .addStep({ nodeId: "start" })
        .addStep({ nodeId: "cat-behavioral" })
        .addStep({ nodeId: "b1", answer: "No" })
        .addStep({ nodeId: "b2", answer: "Yes" })
        .addStep({ nodeId: "p-strategy" });

      const hash = serializePath(original);
      const restored = deserializePath(hash);

      expect(restored.length).toBe(5);
      expect(restored.steps[2].answer).toBe("No");
      expect(restored.steps[3].answer).toBe("Yes");
    });
  });
});
