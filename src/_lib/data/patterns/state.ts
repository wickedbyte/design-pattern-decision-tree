import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const state: PatternDefinition = {
  slug: createPatternSlug("state"),
  name: "State",
  category: createCategoryId("behavioral"),
  icon: "arrows-rotate",
  summary:
    "Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.",
  intent:
    "Encapsulate state-specific behavior into separate state objects and delegate behavior to the current state, so the host object changes its behavior dynamically as its state transitions without resorting to large conditional blocks.",
  problem:
    "An object must change its behavior based on its internal state, and the number of states keeps growing. The code becomes riddled with conditionals that check the current state before every operation, making it fragile and difficult to add new states without touching existing logic.",
  solution:
    "Create a State interface that declares the methods whose behavior varies by state. Implement a ConcreteState class for each distinct state. The Context holds a reference to the current state object and delegates state-dependent work to it. State transitions are performed by swapping the current state object, either by the Context or by the state objects themselves.",
  participants: [
    "State — defines an interface for encapsulating the behavior associated with a particular state of the Context",
    "ConcreteState — each subclass implements behavior associated with a state of the Context",
    "Context — maintains a reference to the current ConcreteState and delegates state-specific behavior to it",
  ],
  consequences: {
    advantages: [
      "Localizes state-specific behavior and partitions behavior for different states into separate classes",
      "Makes state transitions explicit by replacing conditional logic with polymorphic dispatch",
      "New states can be added without modifying the Context or other state classes",
      "Eliminates monolithic conditionals that test the current state across multiple operations",
    ],
    disadvantages: [
      "Increases the number of classes, which can feel heavy for objects with few states",
      "State objects may need access to Context internals, which can tighten coupling",
      "If state transitions are scattered across concrete states, the overall flow can be hard to follow",
    ],
  },
  realWorldAnalogy:
    "Think of a traffic light. It cycles through three states — green, yellow, and red — and its behavior (whether cars stop, slow, or go) depends entirely on the current state. Each state knows how long it lasts and which state comes next. The traffic light itself does not contain a giant if-else block; instead, the current light phase dictates the behavior.",
  useCases: [
    "Order lifecycle management — draft, submitted, paid, shipped, delivered, cancelled",
    "Document workflow — draft, review, approved, published, archived",
    "Media player controls — stopped, playing, paused",
    "TCP connection states — listen, established, closed",
    "Vending machine operations — idle, accepting coins, dispensing, out of stock",
    "Game character states — idle, walking, running, jumping, attacking",
  ],
  relatedPatterns: [
    createPatternSlug("strategy"),
    createPatternSlug("singleton"),
    createPatternSlug("command"),
  ],
  decisionTreeQuestion: "Object behavior depends on its current state?",
  codeExamples: [
    {
      language: "typescript",
      filename: "state.ts",
      description:
        "A document workflow where the Document delegates edit, submit, approve, and reject actions to its current state object. Each state controls which transitions are allowed.",
      code: `// State interface
interface DocumentState {
  readonly name: string;
  edit(doc: Document, text: string): void;
  submit(doc: Document): void;
  approve(doc: Document): void;
  reject(doc: Document): void;
}

// Context
class Document {
  private state: DocumentState;
  content = "";

  constructor() {
    this.state = new DraftState();
  }

  setState(state: DocumentState): void {
    console.log(\`  [Transition] \${this.state.name} -> \${state.name}\`);
    this.state = state;
  }

  getStateName(): string { return this.state.name; }
  edit(text: string): void { this.state.edit(this, text); }
  submit(): void { this.state.submit(this); }
  approve(): void { this.state.approve(this); }
  reject(): void { this.state.reject(this); }
}

// Concrete states
class DraftState implements DocumentState {
  readonly name = "Draft";

  edit(doc: Document, text: string): void {
    doc.content = text;
    console.log("Draft edited.");
  }

  submit(doc: Document): void {
    console.log("Submitting for review.");
    doc.setState(new ReviewState());
  }

  approve(): void { console.log("Cannot approve a draft."); }
  reject(): void { console.log("Cannot reject a draft."); }
}

class ReviewState implements DocumentState {
  readonly name = "Review";
  edit(): void { console.log("Cannot edit during review."); }
  submit(): void { console.log("Already under review."); }

  approve(doc: Document): void {
    console.log("Document approved for publication.");
    doc.setState(new PublishedState());
  }

  reject(doc: Document): void {
    console.log("Rejected — returning to draft.");
    doc.setState(new DraftState());
  }
}

class PublishedState implements DocumentState {
  readonly name = "Published";
  edit(): void { console.log("Cannot edit a published document."); }
  submit(): void { console.log("Already published."); }
  approve(): void { console.log("Already published."); }
  reject(): void { console.log("Cannot reject a published document."); }
}

// Usage
const doc = new Document();
doc.edit("Hello");  // Draft edited.
doc.submit();       // Submitting for review.
                    //   [Transition] Draft -> Review
doc.edit("Nope");   // Cannot edit during review.
doc.reject();       // Rejected — returning to draft.
                    //   [Transition] Review -> Draft
doc.edit("v2");     // Draft edited.
doc.submit();       // Submitting for review.
                    //   [Transition] Draft -> Review
doc.approve();      // Document approved for publication.
                    //   [Transition] Review -> Published
doc.edit("Nope");   // Cannot edit a published document.`,
    },
    {
      language: "python",
      filename: "state.py",
      description:
        "A document workflow using abstract base classes. Each state subclass governs which transitions are legal and controls when the document advances to the next phase.",
      code: `from abc import ABC, abstractmethod


class DocumentState(ABC):
    """Abstract state for a document workflow."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    def edit(self, doc: "Document", text: str) -> None:
        print(f"Cannot edit in {self.name} state.")

    def submit(self, doc: "Document") -> None:
        print(f"Cannot submit in {self.name} state.")

    def approve(self, doc: "Document") -> None:
        print(f"Cannot approve in {self.name} state.")

    def reject(self, doc: "Document") -> None:
        print(f"Cannot reject in {self.name} state.")


class DraftState(DocumentState):
    name = "Draft"

    def edit(self, doc: "Document", text: str) -> None:
        doc.content = text
        print("Draft edited.")

    def submit(self, doc: "Document") -> None:
        print("Submitting for review.")
        doc.state = ReviewState()


class ReviewState(DocumentState):
    name = "Review"

    def approve(self, doc: "Document") -> None:
        print("Document approved for publication.")
        doc.state = PublishedState()

    def reject(self, doc: "Document") -> None:
        print("Rejected -- returning to draft.")
        doc.state = DraftState()


class PublishedState(DocumentState):
    name = "Published"


class Document:
    """Context that delegates to the current state."""

    def __init__(self) -> None:
        self.state: DocumentState = DraftState()
        self.content: str = ""

    def edit(self, text: str) -> None:
        self.state.edit(self, text)

    def submit(self) -> None:
        self.state.submit(self)

    def approve(self) -> None:
        self.state.approve(self)

    def reject(self) -> None:
        self.state.reject(self)


# Usage
doc = Document()
doc.edit("Hello")   # Draft edited.
doc.submit()        # Submitting for review.
doc.edit("Nope")    # Cannot edit in Review state.
doc.reject()        # Rejected -- returning to draft.
doc.edit("v2")      # Draft edited.
doc.submit()        # Submitting for review.
doc.approve()       # Document approved for publication.
doc.edit("Nope")    # Cannot edit in Published state.`,
    },
    {
      language: "php",
      filename: "State.php",
      description:
        "A document workflow where each concrete state class handles edit, submit, approve, and reject actions. The Document context delegates all operations to its current state object.",
      code: `<?php

// State interface
interface DocumentState
{
    public function edit(Document \$doc, string \$text): void;
    public function submit(Document \$doc): void;
    public function approve(Document \$doc): void;
    public function reject(Document \$doc): void;
    public function getName(): string;
}

// Context
class Document
{
    private DocumentState \$state;
    public string \$content = '';

    public function __construct()
    {
        \$this->state = new DraftState();
    }

    public function setState(DocumentState \$state): void
    {
        echo "  [{\$this->state->getName()} -> {\$state->getName()}]\\n";
        \$this->state = \$state;
    }

    public function getStateName(): string { return \$this->state->getName(); }
    public function edit(string \$text): void { \$this->state->edit(\$this, \$text); }
    public function submit(): void { \$this->state->submit(\$this); }
    public function approve(): void { \$this->state->approve(\$this); }
    public function reject(): void { \$this->state->reject(\$this); }
}

// Concrete states
class DraftState implements DocumentState
{
    public function getName(): string { return 'Draft'; }

    public function edit(Document \$doc, string \$text): void
    {
        \$doc->content = \$text;
        echo "Draft edited.\\n";
    }

    public function submit(Document \$doc): void
    {
        echo "Submitting for review.\\n";
        \$doc->setState(new ReviewState());
    }

    public function approve(Document \$doc): void
    {
        echo "Cannot approve a draft.\\n";
    }

    public function reject(Document \$doc): void
    {
        echo "Cannot reject a draft.\\n";
    }
}

class ReviewState implements DocumentState
{
    public function getName(): string { return 'Review'; }

    public function edit(Document \$doc, string \$text): void
    {
        echo "Cannot edit during review.\\n";
    }

    public function submit(Document \$doc): void
    {
        echo "Already under review.\\n";
    }

    public function approve(Document \$doc): void
    {
        echo "Document approved for publication.\\n";
        \$doc->setState(new PublishedState());
    }

    public function reject(Document \$doc): void
    {
        echo "Rejected -- returning to draft.\\n";
        \$doc->setState(new DraftState());
    }
}

class PublishedState implements DocumentState
{
    public function getName(): string { return 'Published'; }

    public function edit(Document \$doc, string \$text): void
    {
        echo "Cannot edit a published document.\\n";
    }

    public function submit(Document \$doc): void
    {
        echo "Already published.\\n";
    }

    public function approve(Document \$doc): void
    {
        echo "Already published.\\n";
    }

    public function reject(Document \$doc): void
    {
        echo "Cannot reject a published document.\\n";
    }
}

// Usage
\$doc = new Document();
\$doc->edit('Hello');  // Draft edited.
\$doc->submit();       // Submitting for review.
                       //   [Draft -> Review]
\$doc->edit('Nope');   // Cannot edit during review.
\$doc->reject();       // Rejected -- returning to draft.
                       //   [Review -> Draft]
\$doc->edit('v2');     // Draft edited.
\$doc->submit();       // Submitting for review.
                       //   [Draft -> Review]
\$doc->approve();      // Document approved for publication.
                       //   [Review -> Published]
\$doc->edit('Nope');   // Cannot edit a published document.`,
    },
    {
      language: "rust",
      filename: "state.rs",
      description:
        "A document workflow using an enum-based state machine, the idiomatic Rust approach. Each state variant controls which transitions are valid, and exhaustive pattern matching prevents missing state handlers.",
      code: `/// Idiomatic Rust favors enums over trait objects for state machines,
/// because the compiler enforces exhaustive matching on all states.
#[derive(Debug, Clone, PartialEq)]
enum DocState {
    Draft,
    Review,
    Published,
}

impl std::fmt::Display for DocState {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DocState::Draft => write!(f, "Draft"),
            DocState::Review => write!(f, "Review"),
            DocState::Published => write!(f, "Published"),
        }
    }
}

/// Context that wraps the state enum.
struct Document {
    state: DocState,
    content: String,
}

impl Document {
    fn new() -> Self {
        Self {
            state: DocState::Draft,
            content: String::new(),
        }
    }

    fn transition(&mut self, next: DocState) {
        println!("  [Transition] {} -> {}", self.state, next);
        self.state = next;
    }

    fn edit(&mut self, text: &str) {
        match self.state {
            DocState::Draft => {
                self.content = text.to_string();
                println!("Draft edited.");
            }
            DocState::Review => println!("Cannot edit during review."),
            DocState::Published => println!("Cannot edit a published document."),
        }
    }

    fn submit(&mut self) {
        match self.state {
            DocState::Draft => {
                println!("Submitting for review.");
                self.transition(DocState::Review);
            }
            DocState::Review => println!("Already under review."),
            DocState::Published => println!("Already published."),
        }
    }

    fn approve(&mut self) {
        match self.state {
            DocState::Draft => println!("Cannot approve a draft."),
            DocState::Review => {
                println!("Document approved for publication.");
                self.transition(DocState::Published);
            }
            DocState::Published => println!("Already published."),
        }
    }

    fn reject(&mut self) {
        match self.state {
            DocState::Draft => println!("Cannot reject a draft."),
            DocState::Review => {
                println!("Rejected -- returning to draft.");
                self.transition(DocState::Draft);
            }
            DocState::Published => println!("Cannot reject a published document."),
        }
    }
}

fn main() {
    let mut doc = Document::new();

    doc.edit("Hello");  // Draft edited.
    doc.submit();       // Submitting for review.
                        //   [Transition] Draft -> Review
    doc.edit("Nope");   // Cannot edit during review.
    doc.reject();       // Rejected -- returning to draft.
                        //   [Transition] Review -> Draft
    doc.edit("v2");     // Draft edited.
    doc.submit();       // Submitting for review.
                        //   [Transition] Draft -> Review
    doc.approve();      // Document approved for publication.
                        //   [Transition] Review -> Published
    doc.edit("Nope");   // Cannot edit a published document.
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust has no classical inheritance, so the traditional OOP State pattern using trait objects is possible but not idiomatic. Enum-based state machines are strongly preferred because the compiler enforces exhaustive matching, preventing missed state transitions at compile time.",
      alternatives:
        "Use enums with match expressions for simple state machines. For complex cases, consider the typestate pattern using generic type parameters to encode state at the type level, which gives compile-time state transition guarantees.",
    },
  ],
};
