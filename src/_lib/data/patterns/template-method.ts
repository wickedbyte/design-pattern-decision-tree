import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const templateMethod: PatternDefinition = {
  slug: createPatternSlug("template-method"),
  name: "Template Method",
  category: createCategoryId("behavioral"),
  emoji: "📐",
  summary:
    "Define the skeleton of an algorithm in a method, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.",
  intent:
    "Define the overall structure of an algorithm in a base class method while allowing subclasses to override specific steps. The invariant parts of the algorithm stay in the base class, and the variant parts are deferred to subclass implementations.",
  problem:
    "You have several classes that contain nearly identical algorithms with only minor differences in certain steps. Duplicating the entire algorithm in each class violates DRY and makes maintenance painful — a bug fix or structural change must be applied to every copy.",
  solution:
    "Move the shared algorithm structure into a single template method in an abstract base class. Break the algorithm into steps, making the steps that vary abstract (or overridable). Subclasses implement only the steps that differ, inheriting the fixed structure from the base class. Optional hook methods can provide additional extension points with default no-op behavior.",
  participants: [
    "AbstractClass — defines the template method containing the algorithm skeleton; declares abstract primitive operations that subclasses must implement; may define hook methods with default behavior",
    "ConcreteClass — implements the primitive operations to carry out subclass-specific steps of the algorithm",
  ],
  consequences: {
    advantages: [
      "Eliminates code duplication by pulling the common algorithm structure into a base class",
      "Subclasses can override only the specific steps they need to change",
      "Inversion of control (Hollywood Principle) — the base class calls subclass methods, not the other way around",
      "Hook methods provide optional extension points without requiring subclasses to override them",
    ],
    disadvantages: [
      "Relies on inheritance, which can make the design rigid compared to composition-based alternatives",
      "Subclasses are constrained by the algorithm structure defined in the base class",
      "Can be difficult to understand the flow when there are many steps and hooks",
      "Adding new steps to the template method may break existing subclasses",
    ],
  },
  realWorldAnalogy:
    "Building a house follows a template method. The overall plan is the same: lay the foundation, build walls, install plumbing, add the roof, and finish interiors. Different house styles (colonial, modern, cabin) follow the same sequence but customize specific steps — the type of foundation, wall materials, and roof design vary. An architect defines the template, and each builder fills in the details.",
  useCases: [
    "Data parsers — CSV, JSON, and XML parsers share the same parse-validate-transform pipeline but differ in parsing logic",
    "Report generators — common structure (header, body, footer) with format-specific rendering",
    "Game AI — a turn consists of fixed phases (assess, plan, act) with different logic per character type",
    "Build systems — compile, link, and package steps follow the same order but vary per language",
    "Test frameworks — setup, execute, verify, teardown lifecycle with user-defined test logic",
    "Web scrapers — fetch page, extract data, transform results with site-specific extraction",
  ],
  relatedPatterns: [
    createPatternSlug("strategy"),
    createPatternSlug("factory-method"),
    createPatternSlug("decorator"),
  ],
  decisionTreeQuestion:
    "Need a fixed algorithm skeleton with customizable steps?",
  codeExamples: [
    {
      language: "typescript",
      filename: "template-method.ts",
      description:
        "A data mining framework where the template method defines the fixed pipeline (open, extract, parse, analyze, report) and subclasses implement the format-specific steps.",
      code: `// Abstract class with the template method
abstract class DataMiner {
  // Template method — defines the algorithm skeleton
  mine(path: string): void {
    const raw = this.openFile(path);
    const data = this.extractData(raw);
    const parsed = this.parseData(data);
    const analysis = this.analyzeData(parsed);
    this.generateReport(analysis);
  }

  // Steps to be implemented by subclasses
  protected abstract openFile(path: string): string;
  protected abstract extractData(raw: string): string[];
  protected abstract parseData(data: string[]): Record<string, number>[];

  // Shared steps with default implementation
  protected analyzeData(data: Record<string, number>[]): string {
    const total = data.reduce((sum, row) => sum + (row["value"] ?? 0), 0);
    return \`Total records: \${data.length}, Sum of values: \${total}\`;
  }

  // Hook — subclasses can optionally override
  protected generateReport(analysis: string): void {
    console.log(\`[Report] \${analysis}\`);
  }
}

// Concrete: CSV miner
class CsvMiner extends DataMiner {
  protected openFile(path: string): string {
    console.log(\`Opening CSV: \${path}\`);
    return "name,value\\nalice,10\\nbob,20"; // simulated
  }

  protected extractData(raw: string): string[] {
    return raw.split("\\n").slice(1); // skip header
  }

  protected parseData(data: string[]): Record<string, number>[] {
    return data.map((row) => {
      const [name, val] = row.split(",");
      return { name: name.length, value: Number(val) };
    });
  }
}

// Concrete: JSON miner
class JsonMiner extends DataMiner {
  protected openFile(path: string): string {
    console.log(\`Opening JSON: \${path}\`);
    return '[{"name":"alice","value":10},{"name":"bob","value":20}]';
  }

  protected extractData(raw: string): string[] {
    return JSON.parse(raw).map((item: Record<string, unknown>) => JSON.stringify(item));
  }

  protected parseData(data: string[]): Record<string, number>[] {
    return data.map((d) => JSON.parse(d) as Record<string, number>);
  }
}

// Usage
new CsvMiner().mine("data.csv");
// Opening CSV: data.csv
// [Report] Total records: 2, Sum of values: 30

new JsonMiner().mine("data.json");
// Opening JSON: data.json
// [Report] Total records: 2, Sum of values: 30`,
    },
    {
      language: "python",
      filename: "template_method.py",
      description:
        "A game AI framework using abstract base classes. The template method defines the turn sequence, and each character type implements its own strategy for each phase.",
      code: `from abc import ABC, abstractmethod


class GameAI(ABC):
    """Abstract class defining the turn algorithm skeleton."""

    def take_turn(self) -> None:
        """Template method — fixed turn sequence."""
        resources = self.collect_resources()
        self.build_structures(resources)
        units = self.train_units()
        target = self.scout_enemy()
        self.attack(units, target)

    @abstractmethod
    def collect_resources(self) -> int:
        """Return amount of resources collected."""

    @abstractmethod
    def build_structures(self, resources: int) -> None: ...

    @abstractmethod
    def train_units(self) -> list[str]: ...

    # Hook — default implementation, can be overridden
    def scout_enemy(self) -> str:
        return "nearest base"

    @abstractmethod
    def attack(self, units: list[str], target: str) -> None: ...


class OrcsAI(GameAI):
    def collect_resources(self) -> int:
        print("Orcs: mining gold and chopping wood")
        return 150

    def build_structures(self, resources: int) -> None:
        print(f"Orcs: building barracks (cost: {resources // 2})")

    def train_units(self) -> list[str]:
        units = ["grunt", "grunt", "shaman"]
        print(f"Orcs: trained {units}")
        return units

    def attack(self, units: list[str], target: str) -> None:
        print(f"Orcs: {len(units)} units charging {target}!")


class HumansAI(GameAI):
    def collect_resources(self) -> int:
        print("Humans: farming and trading")
        return 200

    def build_structures(self, resources: int) -> None:
        print(f"Humans: building castle (cost: {resources // 2})")

    def train_units(self) -> list[str]:
        units = ["knight", "archer", "archer"]
        print(f"Humans: trained {units}")
        return units

    def scout_enemy(self) -> str:
        print("Humans: scouting with eagle eye")
        return "weakest flank"

    def attack(self, units: list[str], target: str) -> None:
        print(f"Humans: {len(units)} units advancing to {target}!")


# Usage
print("=== Orcs Turn ===")
OrcsAI().take_turn()
print("\\n=== Humans Turn ===")
HumansAI().take_turn()`,
    },
    {
      language: "php",
      filename: "TemplateMethod.php",
      description:
        "A report generator framework. The abstract class defines the report structure (header, body, footer), and concrete classes implement format-specific rendering.",
      code: `<?php

// Abstract class with the template method
abstract class ReportGenerator
{
    /**
     * Template method — defines the report structure.
     * @param array<string, mixed> $data
     */
    final public function generate(array $data, string $title): string
    {
        $output = $this->buildHeader($title);
        $output .= $this->buildBody($data);
        $output .= $this->buildFooter();
        $output .= $this->addTimestamp(); // hook
        return $output;
    }

    abstract protected function buildHeader(string $title): string;

    /** @param array<string, mixed> $data */
    abstract protected function buildBody(array $data): string;

    abstract protected function buildFooter(): string;

    // Hook — optional override
    protected function addTimestamp(): string
    {
        return '';
    }
}

// Concrete: HTML report
class HtmlReport extends ReportGenerator
{
    protected function buildHeader(string $title): string
    {
        return "<html><head><title>{$title}</title></head><body>\n<h1>{$title}</h1>\n";
    }

    protected function buildBody(array $data): string
    {
        $rows = '';
        foreach ($data as $key => $value) {
            $rows .= "<tr><td>{$key}</td><td>{$value}</td></tr>\n";
        }
        return "<table>\n{$rows}</table>\n";
    }

    protected function buildFooter(): string
    {
        return "</body></html>\n";
    }
}

// Concrete: Plain text report
class TextReport extends ReportGenerator
{
    protected function buildHeader(string $title): string
    {
        $line = str_repeat('=', strlen($title));
        return "{$line}\n{$title}\n{$line}\n";
    }

    protected function buildBody(array $data): string
    {
        $lines = '';
        foreach ($data as $key => $value) {
            $lines .= sprintf("%-15s %s\n", $key . ':', $value);
        }
        return $lines;
    }

    protected function buildFooter(): string
    {
        return str_repeat('-', 30) . "\n";
    }

    protected function addTimestamp(): string
    {
        return 'Generated: ' . date('Y-m-d H:i:s') . "\n";
    }
}

// Usage
$data = ['Revenue' => '$12,500', 'Expenses' => '$8,300', 'Profit' => '$4,200'];

$html = new HtmlReport();
echo $html->generate($data, 'Q4 Report') . "\n";

$text = new TextReport();
echo $text->generate($data, 'Q4 Report');`,
    },
    {
      language: "rust",
      filename: "template_method.rs",
      description:
        "A data processing pipeline using trait default methods as the template method. Required methods serve as the abstract steps that implementors must define.",
      code: `/// Trait with a default 'process' method acting as the template method.
/// Required methods are the customizable steps.
trait DataProcessor {
    /// Template method — fixed pipeline structure.
    fn process(&self, source: &str) -> String {
        let raw = self.read_data(source);
        let cleaned = self.clean_data(&raw);
        let transformed = self.transform_data(&cleaned);
        self.format_output(&transformed)
    }

    // Required steps — implementors must define these
    fn read_data(&self, source: &str) -> Vec<String>;
    fn clean_data(&self, data: &[String]) -> Vec<String>;
    fn transform_data(&self, data: &[String]) -> Vec<(String, usize)>;

    // Hook with default implementation
    fn format_output(&self, data: &[(String, usize)]) -> String {
        data.iter()
            .map(|(word, count)| format!("{}: {}", word, count))
            .collect::<Vec<_>>()
            .join(", ")
    }
}

/// Concrete: word frequency counter
struct WordCounter;

impl DataProcessor for WordCounter {
    fn read_data(&self, source: &str) -> Vec<String> {
        println!("Reading words from: {}", source);
        source.split_whitespace().map(String::from).collect()
    }

    fn clean_data(&self, data: &[String]) -> Vec<String> {
        data.iter()
            .map(|w| w.to_lowercase().replace(|c: char| !c.is_alphanumeric(), ""))
            .filter(|w| !w.is_empty())
            .collect()
    }

    fn transform_data(&self, data: &[String]) -> Vec<(String, usize)> {
        let mut counts = std::collections::HashMap::new();
        for word in data {
            *counts.entry(word.clone()).or_insert(0usize) += 1;
        }
        let mut sorted: Vec<_> = counts.into_iter().collect();
        sorted.sort_by(|a, b| b.1.cmp(&a.1)); // descending
        sorted
    }
}

/// Concrete: character frequency counter
struct CharCounter;

impl DataProcessor for CharCounter {
    fn read_data(&self, source: &str) -> Vec<String> {
        println!("Reading characters from: {}", source);
        source.chars().map(|c| c.to_string()).collect()
    }

    fn clean_data(&self, data: &[String]) -> Vec<String> {
        data.iter()
            .filter(|c| c.trim() != "")
            .cloned()
            .collect()
    }

    fn transform_data(&self, data: &[String]) -> Vec<(String, usize)> {
        let mut counts = std::collections::HashMap::new();
        for ch in data {
            *counts.entry(ch.clone()).or_insert(0usize) += 1;
        }
        let mut sorted: Vec<_> = counts.into_iter().collect();
        sorted.sort_by(|a, b| b.1.cmp(&a.1));
        sorted
    }
}

fn main() {
    let text = "hello world hello rust world";

    let words = WordCounter;
    println!("{}\n", words.process(text));
    // Reading words from: hello world hello rust world
    // hello: 2, world: 2, rust: 1

    let chars = CharCounter;
    println!("{}", chars.process(text));
    // Reading characters from: hello world hello rust world
    // l: 5, o: 3, ...
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust has no classical inheritance, so the traditional Template Method pattern (abstract class with subclass overrides) does not translate directly. Trait default methods serve as the idiomatic equivalent — the default method defines the algorithm skeleton, and required methods are the abstract steps that each implementor must fill in.",
      alternatives:
        "Use traits with default methods for the template and required methods for the customizable steps. For more flexible composition, consider combining closures or strategy-style function pointers with a struct that orchestrates the pipeline.",
    },
  ],
};
