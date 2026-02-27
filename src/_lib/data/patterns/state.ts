import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const state: PatternDefinition = {
  slug: createPatternSlug("state"),
  name: "State",
  category: createCategoryId("behavioral"),
  emoji: "🔄",
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
        "A document workflow where the Document delegates actions to its current state object. Each state controls what operations are valid and which state comes next.",
      code: `// State interface
interface DocumentState {
  readonly name: string;
  edit(doc: DocumentCtx): void;
  submit(doc: DocumentCtx): void;
  approve(doc: DocumentCtx): void;
  reject(doc: DocumentCtx): void;
}

// Context
class DocumentCtx {
  private state: DocumentState;

  constructor() {
    this.state = new DraftState();
  }

  setState(state: DocumentState): void {
    console.log(\`  Transition: \${this.state.name} -> \${state.name}\`);
    this.state = state;
  }

  getStateName(): string { return this.state.name; }
  edit(): void { this.state.edit(this); }
  submit(): void { this.state.submit(this); }
  approve(): void { this.state.approve(this); }
  reject(): void { this.state.reject(this); }
}

// Concrete states
class DraftState implements DocumentState {
  readonly name = "Draft";
  edit(doc: DocumentCtx): void { console.log("Editing draft..."); }
  submit(doc: DocumentCtx): void { doc.setState(new ReviewState()); }
  approve(): void { console.log("Cannot approve a draft."); }
  reject(): void { console.log("Cannot reject a draft."); }
}

class ReviewState implements DocumentState {
  readonly name = "Review";
  edit(): void { console.log("Cannot edit during review."); }
  submit(): void { console.log("Already submitted."); }
  approve(doc: DocumentCtx): void { doc.setState(new ApprovedState()); }
  reject(doc: DocumentCtx): void { doc.setState(new DraftState()); }
}

class ApprovedState implements DocumentState {
  readonly name = "Approved";
  edit(): void { console.log("Cannot edit approved document."); }
  submit(): void { console.log("Already approved."); }
  approve(): void { console.log("Already approved."); }
  reject(): void { console.log("Cannot reject approved document."); }
}

// Usage
const doc = new DocumentCtx();
doc.edit();     // Editing draft...
doc.submit();   // Transition: Draft -> Review
doc.approve();  // Transition: Review -> Approved
doc.edit();     // Cannot edit approved document.`,
    },
    {
      language: "python",
      filename: "state.py",
      description:
        "An order lifecycle using abstract base classes. Each state subclass governs which transitions are legal and advances the order to the next state.",
      code: `from abc import ABC, abstractmethod


class OrderState(ABC):
    """Abstract state for an order."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    def pay(self, order: "Order") -> None:
        print(f"Cannot pay in {self.name} state")

    def ship(self, order: "Order") -> None:
        print(f"Cannot ship in {self.name} state")

    def deliver(self, order: "Order") -> None:
        print(f"Cannot deliver in {self.name} state")

    def cancel(self, order: "Order") -> None:
        print(f"Cannot cancel in {self.name} state")


class PendingState(OrderState):
    name = "Pending"

    def pay(self, order: "Order") -> None:
        print("Payment received.")
        order.state = PaidState()

    def cancel(self, order: "Order") -> None:
        print("Order cancelled.")
        order.state = CancelledState()


class PaidState(OrderState):
    name = "Paid"

    def ship(self, order: "Order") -> None:
        print("Order shipped.")
        order.state = ShippedState()


class ShippedState(OrderState):
    name = "Shipped"

    def deliver(self, order: "Order") -> None:
        print("Order delivered.")
        order.state = DeliveredState()


class DeliveredState(OrderState):
    name = "Delivered"


class CancelledState(OrderState):
    name = "Cancelled"


class Order:
    """Context that delegates to the current state."""

    def __init__(self) -> None:
        self.state: OrderState = PendingState()

    def pay(self) -> None:
        self.state.pay(self)

    def ship(self) -> None:
        self.state.ship(self)

    def deliver(self) -> None:
        self.state.deliver(self)

    def cancel(self) -> None:
        self.state.cancel(self)


# Usage
order = Order()
order.pay()      # Payment received.
order.ship()     # Order shipped.
order.deliver()  # Order delivered.
order.cancel()   # Cannot cancel in Delivered state`,
    },
    {
      language: "php",
      filename: "State.php",
      description:
        "A vending machine state pattern. Each concrete state handles coin insertion, item selection, and dispensing differently depending on the machine's current phase.",
      code: `<?php

// State interface
interface VendingState
{
    public function insertCoin(VendingMachine \$machine): void;
    public function selectItem(VendingMachine \$machine): void;
    public function dispense(VendingMachine \$machine): void;
    public function getName(): string;
}

// Context
class VendingMachine
{
    private VendingState \$state;

    public function __construct()
    {
        \$this->state = new IdleState();
    }

    public function setState(VendingState \$state): void
    {
        echo "  [{$this->state->getName()} -> {\$state->getName()}]\\n";
        \$this->state = \$state;
    }

    public function insertCoin(): void { \$this->state->insertCoin(\$this); }
    public function selectItem(): void { \$this->state->selectItem(\$this); }
    public function dispense(): void { \$this->state->dispense(\$this); }
}

class IdleState implements VendingState
{
    public function getName(): string { return 'Idle'; }

    public function insertCoin(VendingMachine \$m): void
    {
        echo "Coin accepted.\\n";
        \$m->setState(new HasCoinState());
    }

    public function selectItem(VendingMachine \$m): void
    {
        echo "Insert a coin first.\\n";
    }

    public function dispense(VendingMachine \$m): void
    {
        echo "Insert a coin and select an item.\\n";
    }
}

class HasCoinState implements VendingState
{
    public function getName(): string { return 'HasCoin'; }

    public function insertCoin(VendingMachine \$m): void
    {
        echo "Coin already inserted.\\n";
    }

    public function selectItem(VendingMachine \$m): void
    {
        echo "Item selected.\\n";
        \$m->setState(new DispensingState());
    }

    public function dispense(VendingMachine \$m): void
    {
        echo "Select an item first.\\n";
    }
}

class DispensingState implements VendingState
{
    public function getName(): string { return 'Dispensing'; }

    public function insertCoin(VendingMachine \$m): void
    {
        echo "Please wait, dispensing...\\n";
    }

    public function selectItem(VendingMachine \$m): void
    {
        echo "Already dispensing.\\n";
    }

    public function dispense(VendingMachine \$m): void
    {
        echo "Item dispensed. Thank you!\\n";
        \$m->setState(new IdleState());
    }
}

// Usage
\$machine = new VendingMachine();
\$machine->insertCoin(); // Coin accepted.
\$machine->selectItem(); // Item selected.
\$machine->dispense();   // Item dispensed. Thank you!`,
    },
    {
      language: "rust",
      filename: "state.rs",
      description:
        "An enum-based state machine, which is the idiomatic Rust approach. The enum encodes all states, and a match expression handles transitions. This leverages Rust's exhaustive pattern matching to prevent missing state handlers.",
      code: `/// Idiomatic Rust favors enums over trait objects for state machines,
/// because the compiler enforces exhaustive matching on all states.
#[derive(Debug, Clone, PartialEq)]
enum TrafficLight {
    Green,
    Yellow,
    Red,
}

impl TrafficLight {
    fn next(self) -> Self {
        match self {
            TrafficLight::Green => TrafficLight::Yellow,
            TrafficLight::Yellow => TrafficLight::Red,
            TrafficLight::Red => TrafficLight::Green,
        }
    }

    fn action(&self) -> &str {
        match self {
            TrafficLight::Green => "GO — vehicles may proceed",
            TrafficLight::Yellow => "CAUTION — prepare to stop",
            TrafficLight::Red => "STOP — vehicles must wait",
        }
    }

    fn duration_secs(&self) -> u64 {
        match self {
            TrafficLight::Green => 30,
            TrafficLight::Yellow => 5,
            TrafficLight::Red => 25,
        }
    }
}

/// Context that wraps the state enum.
struct Intersection {
    light: TrafficLight,
}

impl Intersection {
    fn new() -> Self {
        Self { light: TrafficLight::Red }
    }

    fn advance(&mut self) {
        let prev = self.light.clone();
        self.light = self.light.clone().next();
        println!(
            "{:?} -> {:?} ({}s) | {}",
            prev,
            self.light,
            self.light.duration_secs(),
            self.light.action()
        );
    }
}

fn main() {
    let mut intersection = Intersection::new();

    for _ in 0..6 {
        intersection.advance();
    }
    // Red -> Green (30s) | GO — vehicles may proceed
    // Green -> Yellow (5s) | CAUTION — prepare to stop
    // Yellow -> Red (25s) | STOP — vehicles must wait
    // ...
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
