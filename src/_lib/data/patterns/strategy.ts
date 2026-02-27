import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const strategy: PatternDefinition = {
  slug: createPatternSlug("strategy"),
  name: "Strategy",
  category: createCategoryId("behavioral"),
  emoji: "♟️",
  summary:
    "Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from the clients that use it.",
  intent:
    "Enable an object to select a behavior at runtime by encapsulating each algorithm behind a common interface and delegating execution to the currently assigned strategy object.",
  problem:
    "You have a class that needs to perform a task in several different ways, and you find yourself using large conditional blocks (if/else or switch) to pick the right variation. Adding a new variation requires modifying existing code, violating the Open-Closed Principle and making the class harder to test and maintain.",
  solution:
    "Extract each algorithm into its own class that implements a common Strategy interface. The original class (Context) holds a reference to a Strategy and delegates the work to it. Clients can swap strategies at runtime by injecting a different implementation, keeping the Context class thin and closed for modification.",
  participants: [
    "Strategy — declares an interface common to all supported algorithms",
    "ConcreteStrategy — implements the algorithm using the Strategy interface",
    "Context — maintains a reference to a Strategy object and delegates algorithmic work to it",
  ],
  consequences: {
    advantages: [
      "Eliminates conditional statements for selecting behavior",
      "Each algorithm is isolated in its own class, making it easy to test, extend, and swap",
      "Follows the Open-Closed Principle — new strategies can be added without changing the Context",
      "Strategies can be shared across different contexts if they are stateless",
    ],
    disadvantages: [
      "Clients must be aware of the different strategies and understand when to choose each one",
      "Increases the number of classes in the system, which can feel like over-engineering for simple cases",
      "Communication overhead between Context and Strategy if the interface is too broad or too narrow",
    ],
  },
  realWorldAnalogy:
    "Consider different routes to the airport. You can drive, take a bus, cycle, or call a cab. Each is a different strategy for solving the same problem — getting to the airport. The choice depends on budget, time, and comfort, but the destination remains the same. You can switch your transportation strategy right up until you leave the house.",
  useCases: [
    "Sorting algorithms — swap between quicksort, mergesort, or heapsort depending on data characteristics",
    "Payment processing — select between credit card, PayPal, bank transfer, or crypto at checkout",
    "Compression — choose between gzip, brotli, or zstd for different performance/size trade-offs",
    "Validation rules — apply different validation strategies depending on user role or form type",
    "Pricing engines — apply seasonal, VIP, or coupon-based discount strategies",
  ],
  relatedPatterns: [
    createPatternSlug("state"),
    createPatternSlug("template-method"),
    createPatternSlug("command"),
  ],
  decisionTreeQuestion: "Need to swap algorithms or strategies at runtime?",
  codeExamples: [
    {
      language: "typescript",
      filename: "strategy.ts",
      description:
        "A compression context that delegates to interchangeable strategy objects. New compression algorithms can be added without modifying the Compressor class.",
      code: `// Strategy interface
interface CompressionStrategy {
  compress(data: string): string;
  readonly name: string;
}

// Concrete strategies
class GzipStrategy implements CompressionStrategy {
  readonly name = "gzip";
  compress(data: string): string {
    return \`[gzip compressed: \${data.length} -> \${Math.ceil(data.length * 0.6)} bytes]\`;
  }
}

class BrotliStrategy implements CompressionStrategy {
  readonly name = "brotli";
  compress(data: string): string {
    return \`[brotli compressed: \${data.length} -> \${Math.ceil(data.length * 0.45)} bytes]\`;
  }
}

class NoCompression implements CompressionStrategy {
  readonly name = "none";
  compress(data: string): string {
    return data;
  }
}

// Context
class Compressor {
  constructor(private strategy: CompressionStrategy) {}

  setStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  execute(data: string): string {
    console.log(\`Using \${this.strategy.name} strategy\`);
    return this.strategy.compress(data);
  }
}

// Usage
const compressor = new Compressor(new GzipStrategy());
console.log(compressor.execute("Hello, World!"));

compressor.setStrategy(new BrotliStrategy());
console.log(compressor.execute("Hello, World!"));`,
    },
    {
      language: "python",
      filename: "strategy.py",
      description:
        "Strategies defined as callables using Python's Protocol. The context accepts any callable matching the expected signature, making plain functions valid strategies.",
      code: `from typing import Protocol


class PaymentStrategy(Protocol):
    """Any callable that processes a payment amount and returns a receipt."""

    def __call__(self, amount: float) -> str: ...


# Concrete strategies — simple functions satisfy the Protocol
def credit_card(amount: float) -> str:
    fee = amount * 0.029 + 0.30
    return f"Charged {amount + fee:.2f} to credit card (includes {fee:.2f} fee)"


def paypal(amount: float) -> str:
    fee = amount * 0.035
    return f"Sent {amount:.2f} via PayPal (fee: {fee:.2f})"


def bank_transfer(amount: float) -> str:
    return f"Bank transfer of {amount:.2f} initiated (no fee)"


# Context
class Checkout:
    def __init__(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy

    @property
    def strategy(self) -> PaymentStrategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: PaymentStrategy) -> None:
        self._strategy = strategy

    def pay(self, amount: float) -> str:
        return self._strategy(amount)


# Usage
checkout = Checkout(credit_card)
print(checkout.pay(99.99))
# Charged $103.19 to credit card (includes $3.20 fee)

checkout.strategy = bank_transfer
print(checkout.pay(99.99))
# Bank transfer of $99.99 initiated (no fee)`,
    },
    {
      language: "php",
      filename: "Strategy.php",
      description:
        "A shipping cost calculator that delegates to different shipping strategy implementations. The Context calls the strategy through a shared interface.",
      code: `<?php

// Strategy interface
interface ShippingStrategy
{
    public function calculate(float \$weight, float \$distance): float;
    public function getName(): string;
}

// Concrete strategies
class StandardShipping implements ShippingStrategy
{
    public function calculate(float \$weight, float \$distance): float
    {
        return \$weight * 0.5 + \$distance * 0.01;
    }

    public function getName(): string
    {
        return 'Standard';
    }
}

class ExpressShipping implements ShippingStrategy
{
    public function calculate(float \$weight, float \$distance): float
    {
        return (\$weight * 0.5 + \$distance * 0.01) * 2.5;
    }

    public function getName(): string
    {
        return 'Express';
    }
}

class FreeShipping implements ShippingStrategy
{
    public function calculate(float \$weight, float \$distance): float
    {
        return 0.0;
    }

    public function getName(): string
    {
        return 'Free';
    }
}

// Context
class ShippingCalculator
{
    public function __construct(private ShippingStrategy \$strategy) {}

    public function setStrategy(ShippingStrategy \$strategy): void
    {
        \$this->strategy = \$strategy;
    }

    public function getQuote(float \$weight, float \$distance): string
    {
        \$cost = \$this->strategy->calculate(\$weight, \$distance);
        return sprintf(
            "%s shipping: \$%.2f (%.1fkg, %.0fkm)",
            \$this->strategy->getName(), \$cost, \$weight, \$distance
        );
    }
}

// Usage
\$calc = new ShippingCalculator(new StandardShipping());
echo \$calc->getQuote(5.0, 200) . "\\n"; // Standard shipping: $4.50

\$calc->setStrategy(new ExpressShipping());
echo \$calc->getQuote(5.0, 200) . "\\n"; // Express shipping: $11.25`,
    },
    {
      language: "rust",
      filename: "strategy.rs",
      description:
        "Strategies implemented as trait objects and as closures. Rust supports both approaches — trait objects for complex strategies, closures for simple ones.",
      code: `/// Strategy trait for sorting algorithms.
trait SortStrategy {
    fn sort(&self, data: &mut Vec<i32>);
    fn name(&self) -> &str;
}

struct BubbleSort;
impl SortStrategy for BubbleSort {
    fn sort(&self, data: &mut Vec<i32>) {
        let len = data.len();
        for i in 0..len {
            for j in 0..len - 1 - i {
                if data[j] > data[j + 1] {
                    data.swap(j, j + 1);
                }
            }
        }
    }
    fn name(&self) -> &str { "BubbleSort" }
}

struct QuickSort;
impl SortStrategy for QuickSort {
    fn sort(&self, data: &mut Vec<i32>) {
        data.sort_unstable(); // Rust's built-in is introsort
    }
    fn name(&self) -> &str { "QuickSort" }
}

/// Context holds a boxed strategy trait object.
struct Sorter {
    strategy: Box<dyn SortStrategy>,
}

impl Sorter {
    fn new(strategy: Box<dyn SortStrategy>) -> Self {
        Self { strategy }
    }

    fn set_strategy(&mut self, strategy: Box<dyn SortStrategy>) {
        self.strategy = strategy;
    }

    fn execute(&self, data: &mut Vec<i32>) {
        println!("Sorting with {}", self.strategy.name());
        self.strategy.sort(data);
    }
}

fn main() {
    let mut data = vec![5, 2, 8, 1, 9, 3];

    let mut sorter = Sorter::new(Box::new(BubbleSort));
    sorter.execute(&mut data);
    println!("{:?}", data); // [1, 2, 3, 5, 8, 9]

    data = vec![5, 2, 8, 1, 9, 3];
    sorter.set_strategy(Box::new(QuickSort));
    sorter.execute(&mut data);
    println!("{:?}", data); // [1, 2, 3, 5, 8, 9]
}`,
    },
  ],
  antiPatternNotices: [],
};
