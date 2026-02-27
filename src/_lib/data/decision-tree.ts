import type { DecisionNode } from "@/_lib/domain/DecisionNode";
import type { DecisionEdge } from "@/_lib/domain/DecisionEdge";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const DECISION_NODES: readonly DecisionNode[] = [
  // Root
  {
    id: "start",
    kind: "start",
    label: "What is your main pain point?",
  },

  // Category nodes
  {
    id: "cat-creational",
    kind: "category",
    label: "Object Creation",
    description: "Creation logic is getting complex or scattered",
    categoryId: createCategoryId("creational"),
  },
  {
    id: "cat-structural",
    kind: "category",
    label: "Boundaries & Structure",
    description: "Fighting component boundaries or external dependencies",
    categoryId: createCategoryId("structural"),
  },
  {
    id: "cat-behavioral",
    kind: "category",
    label: "Behavior & Logic",
    description: "Behavior keeps changing, conditionals keep growing",
    categoryId: createCategoryId("behavioral"),
  },

  // Creational questions
  {
    id: "c1",
    kind: "question",
    label: "Need exactly one shared instance?",
  },
  {
    id: "c2",
    kind: "question",
    label: "Object has many optional parts or complex construction?",
  },
  {
    id: "c3",
    kind: "question",
    label: "Need to clone an existing object?",
  },
  {
    id: "c4",
    kind: "question",
    label: "Creating families of related objects that must be consistent?",
  },

  // Structural questions
  {
    id: "s1",
    kind: "question",
    label: "Integrating with an incompatible interface or legacy system?",
  },
  {
    id: "s2",
    kind: "question",
    label: "Need to simplify a complex subsystem behind one entry point?",
  },
  {
    id: "s3",
    kind: "question",
    label: "Need to add responsibilities to objects dynamically?",
  },
  {
    id: "s4",
    kind: "question",
    label: "Need to control access, lazy-load, or add a stand-in?",
  },
  {
    id: "s5",
    kind: "question",
    label: "Working with tree / part-whole hierarchies?",
  },

  // Behavioral questions
  {
    id: "b1",
    kind: "question",
    label: "Need to notify multiple objects when state changes?",
  },
  {
    id: "b2",
    kind: "question",
    label: "Need to swap algorithms or strategies at runtime?",
  },
  {
    id: "b3",
    kind: "question",
    label: "Object behavior depends on its current state?",
  },
  {
    id: "b4",
    kind: "question",
    label: "Need undo/redo, queuing, or logging of operations?",
  },
  {
    id: "b5",
    kind: "question",
    label: "Request must pass through a chain of handlers?",
  },
  {
    id: "b6",
    kind: "question",
    label: "Need a fixed algorithm skeleton with customizable steps?",
  },

  // Pattern leaf nodes — Creational
  {
    id: "p-singleton",
    kind: "pattern",
    label: "Singleton",
    patternSlug: createPatternSlug("singleton"),
  },
  {
    id: "p-builder",
    kind: "pattern",
    label: "Builder",
    patternSlug: createPatternSlug("builder"),
  },
  {
    id: "p-prototype",
    kind: "pattern",
    label: "Prototype",
    patternSlug: createPatternSlug("prototype"),
  },
  {
    id: "p-abstract-factory",
    kind: "pattern",
    label: "Abstract Factory",
    patternSlug: createPatternSlug("abstract-factory"),
  },
  {
    id: "p-factory-method",
    kind: "pattern",
    label: "Factory Method",
    patternSlug: createPatternSlug("factory-method"),
  },

  // Pattern leaf nodes — Structural
  {
    id: "p-adapter",
    kind: "pattern",
    label: "Adapter",
    patternSlug: createPatternSlug("adapter"),
  },
  {
    id: "p-facade",
    kind: "pattern",
    label: "Facade",
    patternSlug: createPatternSlug("facade"),
  },
  {
    id: "p-decorator",
    kind: "pattern",
    label: "Decorator",
    patternSlug: createPatternSlug("decorator"),
  },
  {
    id: "p-proxy",
    kind: "pattern",
    label: "Proxy",
    patternSlug: createPatternSlug("proxy"),
  },
  {
    id: "p-composite",
    kind: "pattern",
    label: "Composite",
    patternSlug: createPatternSlug("composite"),
  },
  {
    id: "p-bridge",
    kind: "pattern",
    label: "Bridge",
    patternSlug: createPatternSlug("bridge"),
  },

  // Pattern leaf nodes — Behavioral
  {
    id: "p-observer",
    kind: "pattern",
    label: "Observer",
    patternSlug: createPatternSlug("observer"),
  },
  {
    id: "p-strategy",
    kind: "pattern",
    label: "Strategy",
    patternSlug: createPatternSlug("strategy"),
  },
  {
    id: "p-state",
    kind: "pattern",
    label: "State",
    patternSlug: createPatternSlug("state"),
  },
  {
    id: "p-command",
    kind: "pattern",
    label: "Command",
    patternSlug: createPatternSlug("command"),
  },
  {
    id: "p-chain-of-responsibility",
    kind: "pattern",
    label: "Chain of Responsibility",
    patternSlug: createPatternSlug("chain-of-responsibility"),
  },
  {
    id: "p-template-method",
    kind: "pattern",
    label: "Template Method",
    patternSlug: createPatternSlug("template-method"),
  },

  // Fallback
  {
    id: "fallback",
    kind: "fallback",
    label: "Re-examine the problem",
    description: "Consider simpler refactoring first",
  },
];

export const DECISION_EDGES: readonly DecisionEdge[] = [
  // Start -> Categories
  { id: "e-start-creational", source: "start", target: "cat-creational" },
  { id: "e-start-structural", source: "start", target: "cat-structural" },
  { id: "e-start-behavioral", source: "start", target: "cat-behavioral" },

  // Creational chain
  { id: "e-cat-c1", source: "cat-creational", target: "c1" },
  { id: "e-c1-yes", source: "c1", target: "p-singleton", label: "Yes" },
  { id: "e-c1-no", source: "c1", target: "c2", label: "No" },
  { id: "e-c2-yes", source: "c2", target: "p-builder", label: "Yes" },
  { id: "e-c2-no", source: "c2", target: "c3", label: "No" },
  { id: "e-c3-yes", source: "c3", target: "p-prototype", label: "Yes" },
  { id: "e-c3-no", source: "c3", target: "c4", label: "No" },
  { id: "e-c4-yes", source: "c4", target: "p-abstract-factory", label: "Yes" },
  { id: "e-c4-no", source: "c4", target: "p-factory-method", label: "No" },

  // Structural chain
  { id: "e-cat-s1", source: "cat-structural", target: "s1" },
  { id: "e-s1-yes", source: "s1", target: "p-adapter", label: "Yes" },
  { id: "e-s1-no", source: "s1", target: "s2", label: "No" },
  { id: "e-s2-yes", source: "s2", target: "p-facade", label: "Yes" },
  { id: "e-s2-no", source: "s2", target: "s3", label: "No" },
  { id: "e-s3-yes", source: "s3", target: "p-decorator", label: "Yes" },
  { id: "e-s3-no", source: "s3", target: "s4", label: "No" },
  { id: "e-s4-yes", source: "s4", target: "p-proxy", label: "Yes" },
  { id: "e-s4-no", source: "s4", target: "s5", label: "No" },
  { id: "e-s5-yes", source: "s5", target: "p-composite", label: "Yes" },
  { id: "e-s5-no", source: "s5", target: "p-bridge", label: "No" },

  // Behavioral chain
  { id: "e-cat-b1", source: "cat-behavioral", target: "b1" },
  { id: "e-b1-yes", source: "b1", target: "p-observer", label: "Yes" },
  { id: "e-b1-no", source: "b1", target: "b2", label: "No" },
  { id: "e-b2-yes", source: "b2", target: "p-strategy", label: "Yes" },
  { id: "e-b2-no", source: "b2", target: "b3", label: "No" },
  { id: "e-b3-yes", source: "b3", target: "p-state", label: "Yes" },
  { id: "e-b3-no", source: "b3", target: "b4", label: "No" },
  { id: "e-b4-yes", source: "b4", target: "p-command", label: "Yes" },
  { id: "e-b4-no", source: "b4", target: "b5", label: "No" },
  { id: "e-b5-yes", source: "b5", target: "p-chain-of-responsibility", label: "Yes" },
  { id: "e-b5-no", source: "b5", target: "b6", label: "No" },
  { id: "e-b6-yes", source: "b6", target: "p-template-method", label: "Yes" },
  { id: "e-b6-no", source: "b6", target: "fallback", label: "No" },
];
