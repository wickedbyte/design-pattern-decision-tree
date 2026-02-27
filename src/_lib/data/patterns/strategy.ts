import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const strategy: PatternDefinition = {
  slug: createPatternSlug("strategy"),
  name: "Strategy",
  category: createCategoryId("behavioral"),
  icon: "chess-pawn",
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
        "A Compressor context delegates to interchangeable CompressionStrategy objects. New algorithms can be added without modifying the Compressor class.",
      code: `// Strategy interface
interface CompressionStrategy {
  compress(data: string): string;
  readonly name: string;
}

// Concrete strategies
class GzipStrategy implements CompressionStrategy {
  readonly name = "gzip";
  compress(data: string): string {
    return \`[gzip: \${data.length} -> \${Math.ceil(data.length * 0.6)} bytes]\`;
  }
}

class BrotliStrategy implements CompressionStrategy {
  readonly name = "brotli";
  compress(data: string): string {
    return \`[brotli: \${data.length} -> \${Math.ceil(data.length * 0.45)} bytes]\`;
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

// Usage — compress "Hello, World!" with each strategy
const compressor = new Compressor(new GzipStrategy());
console.log(compressor.execute("Hello, World!"));
// Using gzip strategy
// [gzip: 13 -> 8 bytes]

compressor.setStrategy(new BrotliStrategy());
console.log(compressor.execute("Hello, World!"));
// Using brotli strategy
// [brotli: 13 -> 6 bytes]

compressor.setStrategy(new NoCompression());
console.log(compressor.execute("Hello, World!"));
// Using none strategy
// Hello, World!`,
    },
    {
      language: "python",
      filename: "strategy.py",
      description:
        "A Compressor context delegates to CompressionStrategy implementations. Python's ABC enforces the interface contract for each concrete strategy.",
      code: `from abc import ABC, abstractmethod
import math


class CompressionStrategy(ABC):
    """Interface for all compression algorithms."""

    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    def compress(self, data: str) -> str: ...


class GzipStrategy(CompressionStrategy):
    @property
    def name(self) -> str:
        return "gzip"

    def compress(self, data: str) -> str:
        size = math.ceil(len(data) * 0.6)
        return f"[gzip: {len(data)} -> {size} bytes]"


class BrotliStrategy(CompressionStrategy):
    @property
    def name(self) -> str:
        return "brotli"

    def compress(self, data: str) -> str:
        size = math.ceil(len(data) * 0.45)
        return f"[brotli: {len(data)} -> {size} bytes]"


class NoCompression(CompressionStrategy):
    @property
    def name(self) -> str:
        return "none"

    def compress(self, data: str) -> str:
        return data


class Compressor:
    """Context that delegates compression to a strategy."""

    def __init__(self, strategy: CompressionStrategy) -> None:
        self._strategy = strategy

    def set_strategy(self, strategy: CompressionStrategy) -> None:
        self._strategy = strategy

    def execute(self, data: str) -> str:
        print(f"Using {self._strategy.name} strategy")
        return self._strategy.compress(data)


# Usage — compress "Hello, World!" with each strategy
compressor = Compressor(GzipStrategy())
print(compressor.execute("Hello, World!"))
# Using gzip strategy
# [gzip: 13 -> 8 bytes]

compressor.set_strategy(BrotliStrategy())
print(compressor.execute("Hello, World!"))
# Using brotli strategy
# [brotli: 13 -> 6 bytes]

compressor.set_strategy(NoCompression())
print(compressor.execute("Hello, World!"))
# Using none strategy
# Hello, World!`,
    },
    {
      language: "php",
      filename: "Strategy.php",
      description:
        "A Compressor context delegates to CompressionStrategy implementations. New algorithms are added by implementing the interface — no changes to Compressor needed.",
      code: `<?php

// Strategy interface
interface CompressionStrategy
{
    public function compress(string \$data): string;
    public function getName(): string;
}

// Concrete strategies
class GzipStrategy implements CompressionStrategy
{
    public function compress(string \$data): string
    {
        \$size = (int) ceil(strlen(\$data) * 0.6);
        return "[gzip: " . strlen(\$data) . " -> {\$size} bytes]";
    }

    public function getName(): string
    {
        return 'gzip';
    }
}

class BrotliStrategy implements CompressionStrategy
{
    public function compress(string \$data): string
    {
        \$size = (int) ceil(strlen(\$data) * 0.45);
        return "[brotli: " . strlen(\$data) . " -> {\$size} bytes]";
    }

    public function getName(): string
    {
        return 'brotli';
    }
}

class NoCompression implements CompressionStrategy
{
    public function compress(string \$data): string
    {
        return \$data;
    }

    public function getName(): string
    {
        return 'none';
    }
}

// Context
class Compressor
{
    public function __construct(private CompressionStrategy \$strategy) {}

    public function setStrategy(CompressionStrategy \$strategy): void
    {
        \$this->strategy = \$strategy;
    }

    public function execute(string \$data): string
    {
        echo "Using " . \$this->strategy->getName() . " strategy\\n";
        return \$this->strategy->compress(\$data);
    }
}

// Usage — compress "Hello, World!" with each strategy
\$compressor = new Compressor(new GzipStrategy());
echo \$compressor->execute("Hello, World!") . "\\n";
// Using gzip strategy
// [gzip: 13 -> 8 bytes]

\$compressor->setStrategy(new BrotliStrategy());
echo \$compressor->execute("Hello, World!") . "\\n";
// Using brotli strategy
// [brotli: 13 -> 6 bytes]

\$compressor->setStrategy(new NoCompression());
echo \$compressor->execute("Hello, World!") . "\\n";
// Using none strategy
// Hello, World!`,
    },
    {
      language: "rust",
      filename: "strategy.rs",
      description:
        "A Compressor context delegates to boxed CompressionStrategy trait objects. New algorithms are added by implementing the trait — no changes to Compressor needed.",
      code: `/// Strategy trait for compression algorithms.
trait CompressionStrategy {
    fn compress(&self, data: &str) -> String;
    fn name(&self) -> &str;
}

struct GzipStrategy;
impl CompressionStrategy for GzipStrategy {
    fn compress(&self, data: &str) -> String {
        let size = (data.len() as f64 * 0.6).ceil() as usize;
        format!("[gzip: {} -> {} bytes]", data.len(), size)
    }
    fn name(&self) -> &str { "gzip" }
}

struct BrotliStrategy;
impl CompressionStrategy for BrotliStrategy {
    fn compress(&self, data: &str) -> String {
        let size = (data.len() as f64 * 0.45).ceil() as usize;
        format!("[brotli: {} -> {} bytes]", data.len(), size)
    }
    fn name(&self) -> &str { "brotli" }
}

struct NoCompression;
impl CompressionStrategy for NoCompression {
    fn compress(&self, data: &str) -> String {
        data.to_string()
    }
    fn name(&self) -> &str { "none" }
}

/// Context holds a boxed strategy trait object.
struct Compressor {
    strategy: Box<dyn CompressionStrategy>,
}

impl Compressor {
    fn new(strategy: Box<dyn CompressionStrategy>) -> Self {
        Self { strategy }
    }

    fn set_strategy(&mut self, strategy: Box<dyn CompressionStrategy>) {
        self.strategy = strategy;
    }

    fn execute(&self, data: &str) -> String {
        println!("Using {} strategy", self.strategy.name());
        self.strategy.compress(data)
    }
}

fn main() {
    // Compress "Hello, World!" with each strategy
    let mut compressor = Compressor::new(Box::new(GzipStrategy));
    println!("{}", compressor.execute("Hello, World!"));
    // Using gzip strategy
    // [gzip: 13 -> 8 bytes]

    compressor.set_strategy(Box::new(BrotliStrategy));
    println!("{}", compressor.execute("Hello, World!"));
    // Using brotli strategy
    // [brotli: 13 -> 6 bytes]

    compressor.set_strategy(Box::new(NoCompression));
    println!("{}", compressor.execute("Hello, World!"));
    // Using none strategy
    // Hello, World!
}`,
    },
  ],
  antiPatternNotices: [],
};
