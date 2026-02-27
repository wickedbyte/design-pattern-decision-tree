export interface DecisionStep {
  readonly nodeId: string;
  readonly answer?: "Yes" | "No";
}

export interface SerializableStep {
  readonly nodeId: string;
  readonly answer: string;
}

export class DecisionPath {
  private constructor(readonly steps: readonly DecisionStep[]) {}

  static empty(): DecisionPath {
    return new DecisionPath([]);
  }

  static fromSteps(steps: readonly DecisionStep[]): DecisionPath {
    return new DecisionPath([...steps]);
  }

  addStep(step: DecisionStep): DecisionPath {
    return new DecisionPath([...this.steps, step]);
  }

  get currentNodeId(): string | undefined {
    return this.steps.at(-1)?.nodeId;
  }

  get length(): number {
    return this.steps.length;
  }

  get isEmpty(): boolean {
    return this.steps.length === 0;
  }

  containsNode(nodeId: string): boolean {
    return this.steps.some((s) => s.nodeId === nodeId);
  }

  removeAfter(nodeId: string): DecisionPath {
    const index = this.steps.findIndex((s) => s.nodeId === nodeId);
    if (index === -1) return this;
    return new DecisionPath(this.steps.slice(0, index + 1));
  }

  toSerializable(): readonly SerializableStep[] {
    return this.steps.map((s) => ({
      nodeId: s.nodeId,
      answer: s.answer ?? "_",
    }));
  }

  static fromSerializable(steps: readonly SerializableStep[]): DecisionPath {
    return new DecisionPath(
      steps.map((s) => ({
        nodeId: s.nodeId,
        answer: s.answer === "_" ? undefined : (s.answer as "Yes" | "No"),
      }))
    );
  }
}
