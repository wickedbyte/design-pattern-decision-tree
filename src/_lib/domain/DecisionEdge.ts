export interface DecisionEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label?: "Yes" | "No";
}
