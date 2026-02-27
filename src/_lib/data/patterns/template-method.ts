import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const templateMethod: PatternDefinition = {
  slug: createPatternSlug("template-method"),
  name: "Template Method",
  category: createCategoryId("behavioral"),
  icon: "ruler-combined",
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
        "A data mining framework where the template method defines the fixed pipeline (open, extract, parse, analyze, report) and CsvMiner/JsonMiner implement the format-specific steps.",
      code: `// Abstract class with the template method
abstract class DataMiner {
  // Template method — defines the algorithm skeleton
  mine(path: string): void {
    const raw = this.openSource(path);
    const data = this.extractData(raw);
    const parsed = this.parseData(data);
    const analysis = this.analyzeData(parsed);
    this.generateReport(analysis);
  }

  // Steps to be implemented by subclasses
  protected abstract openSource(path: string): string;
  protected abstract extractData(raw: string): string[];
  protected abstract parseData(data: string[]): Record<string, number>[];

  // Shared step with default implementation
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
  protected openSource(path: string): string {
    console.log(\`Opening CSV file: \${path}\`);
    return "name,value\\nalice,10\\nbob,20"; // simulated file content
  }

  protected extractData(raw: string): string[] {
    return raw.split("\\n").slice(1); // skip header row
  }

  protected parseData(data: string[]): Record<string, number>[] {
    return data.map((row) => {
      const [, val] = row.split(",");
      return { value: Number(val) };
    });
  }
}

// Concrete: JSON miner
class JsonMiner extends DataMiner {
  protected openSource(path: string): string {
    console.log(\`Opening JSON file: \${path}\`);
    return '[{"name":"alice","value":10},{"name":"bob","value":20}]';
  }

  protected extractData(raw: string): string[] {
    return JSON.parse(raw).map(
      (item: Record<string, unknown>) => JSON.stringify(item),
    );
  }

  protected parseData(data: string[]): Record<string, number>[] {
    return data.map((d) => JSON.parse(d) as Record<string, number>);
  }
}

// Usage
new CsvMiner().mine("data.csv");
// Opening CSV file: data.csv
// [Report] Total records: 2, Sum of values: 30

new JsonMiner().mine("data.json");
// Opening JSON file: data.json
// [Report] Total records: 2, Sum of values: 30`,
    },
    {
      language: "python",
      filename: "template_method.py",
      description:
        "A data mining framework using abstract base classes. The template method defines the fixed pipeline (open, extract, parse, analyze, report) and CsvMiner/JsonMiner implement the format-specific steps.",
      code: `from abc import ABC, abstractmethod
import json


class DataMiner(ABC):
    """Abstract class defining the mining algorithm skeleton."""

    def mine(self, path: str) -> None:
        """Template method -- fixed mining pipeline."""
        raw = self.open_source(path)
        data = self.extract_data(raw)
        parsed = self.parse_data(data)
        analysis = self.analyze_data(parsed)
        self.generate_report(analysis)

    @abstractmethod
    def open_source(self, path: str) -> str:
        """Open the data source and return raw content."""

    @abstractmethod
    def extract_data(self, raw: str) -> list[str]:
        """Extract individual records from raw content."""

    @abstractmethod
    def parse_data(self, data: list[str]) -> list[dict[str, int]]:
        """Parse records into structured data."""

    # Shared step with default implementation
    def analyze_data(self, data: list[dict[str, int]]) -> str:
        total = sum(row.get("value", 0) for row in data)
        return "Total records: {}, Sum of values: {}".format(len(data), total)

    # Hook -- subclasses can optionally override
    def generate_report(self, analysis: str) -> None:
        print("[Report] {}".format(analysis))


class CsvMiner(DataMiner):
    def open_source(self, path: str) -> str:
        print("Opening CSV file: {}".format(path))
        return "name,value\\nalice,10\\nbob,20"  # simulated

    def extract_data(self, raw: str) -> list[str]:
        return raw.split("\\n")[1:]  # skip header row

    def parse_data(self, data: list[str]) -> list[dict[str, int]]:
        result: list[dict[str, int]] = []
        for row in data:
            _, val = row.split(",")
            result.append({"value": int(val)})
        return result


class JsonMiner(DataMiner):
    def open_source(self, path: str) -> str:
        print("Opening JSON file: {}".format(path))
        return '[{"name": "alice", "value": 10}, {"name": "bob", "value": 20}]'

    def extract_data(self, raw: str) -> list[str]:
        return [json.dumps(item) for item in json.loads(raw)]

    def parse_data(self, data: list[str]) -> list[dict[str, int]]:
        return [json.loads(d) for d in data]


# Usage
CsvMiner().mine("data.csv")
# Opening CSV file: data.csv
# [Report] Total records: 2, Sum of values: 30

print()

JsonMiner().mine("data.json")
# Opening JSON file: data.json
# [Report] Total records: 2, Sum of values: 30`,
    },
    {
      language: "php",
      filename: "TemplateMethod.php",
      description:
        "A data mining framework where the abstract class defines the fixed pipeline (open, extract, parse, analyze, report) and CsvMiner/JsonMiner implement the format-specific steps.",
      code: `<?php

// Abstract class with the template method
abstract class DataMiner
{
    /** Template method — defines the mining pipeline. */
    final public function mine(string $path): void
    {
        $raw = $this->openSource($path);
        $data = $this->extractData($raw);
        $parsed = $this->parseData($data);
        $analysis = $this->analyzeData($parsed);
        $this->generateReport($analysis);
    }

    abstract protected function openSource(string $path): string;

    /** @return list<string> */
    abstract protected function extractData(string $raw): array;

    /**
     * @param list<string> $data
     * @return list<array{value: int}>
     */
    abstract protected function parseData(array $data): array;

    /** Shared step with default implementation.
     * @param list<array{value: int}> $data
     */
    protected function analyzeData(array $data): string
    {
        $total = array_sum(array_column($data, 'value'));
        return sprintf('Total records: %d, Sum of values: %d', count($data), $total);
    }

    /** Hook — subclasses can optionally override. */
    protected function generateReport(string $analysis): void
    {
        echo "[Report] {$analysis}" . PHP_EOL;
    }
}

// Concrete: CSV miner
class CsvMiner extends DataMiner
{
    protected function openSource(string $path): string
    {
        echo "Opening CSV file: {$path}" . PHP_EOL;
        return "name,value\\nalice,10\\nbob,20"; // simulated
    }

    protected function extractData(string $raw): array
    {
        $lines = explode("\\n", $raw);
        array_shift($lines); // skip header row
        return $lines;
    }

    protected function parseData(array $data): array
    {
        return array_map(function (string $row): array {
            [, $val] = explode(',', $row);
            return ['value' => (int) $val];
        }, $data);
    }
}

// Concrete: JSON miner
class JsonMiner extends DataMiner
{
    protected function openSource(string $path): string
    {
        echo "Opening JSON file: {$path}" . PHP_EOL;
        return '[{"name":"alice","value":10},{"name":"bob","value":20}]';
    }

    protected function extractData(string $raw): array
    {
        return array_map('json_encode', json_decode($raw, true));
    }

    protected function parseData(array $data): array
    {
        return array_map(fn(string $d): array => json_decode($d, true), $data);
    }
}

// Usage
(new CsvMiner())->mine('data.csv');
// Opening CSV file: data.csv
// [Report] Total records: 2, Sum of values: 30

echo PHP_EOL;

(new JsonMiner())->mine('data.json');
// Opening JSON file: data.json
// [Report] Total records: 2, Sum of values: 30`,
    },
    {
      language: "rust",
      filename: "template_method.rs",
      description:
        "A data mining framework using a trait with a default mine() method as the template method. CsvMiner and JsonMiner implement the format-specific steps as required trait methods.",
      code: `use std::collections::HashMap;

/// Trait with a default \`mine\` method acting as the template method.
/// Required methods are the customizable steps.
trait DataMiner {
    /// Template method — fixed mining pipeline.
    fn mine(&self, path: &str) {
        let raw = self.open_source(path);
        let data = self.extract_data(&raw);
        let parsed = self.parse_data(&data);
        let analysis = self.analyze_data(&parsed);
        self.generate_report(&analysis);
    }

    // Required steps — implementors must define these
    fn open_source(&self, path: &str) -> String;
    fn extract_data(&self, raw: &str) -> Vec<String>;
    fn parse_data(&self, data: &[String]) -> Vec<HashMap<String, i64>>;

    // Shared step with default implementation
    fn analyze_data(&self, data: &[HashMap<String, i64>]) -> String {
        let total: i64 = data
            .iter()
            .filter_map(|row| row.get("value"))
            .sum();
        format!("Total records: {}, Sum of values: {}", data.len(), total)
    }

    // Hook — implementors can optionally override
    fn generate_report(&self, analysis: &str) {
        println!("[Report] {}", analysis);
    }
}

/// Concrete: CSV miner
struct CsvMiner;

impl DataMiner for CsvMiner {
    fn open_source(&self, path: &str) -> String {
        println!("Opening CSV file: {}", path);
        "name,value\\nalice,10\\nbob,20".to_string() // simulated
    }

    fn extract_data(&self, raw: &str) -> Vec<String> {
        raw.lines().skip(1).map(String::from).collect() // skip header
    }

    fn parse_data(&self, data: &[String]) -> Vec<HashMap<String, i64>> {
        data.iter()
            .map(|row| {
                let parts: Vec<&str> = row.split(',').collect();
                let mut map = HashMap::new();
                map.insert("value".to_string(), parts[1].parse().unwrap());
                map
            })
            .collect()
    }
}

/// Concrete: JSON miner
struct JsonMiner;

impl DataMiner for JsonMiner {
    fn open_source(&self, path: &str) -> String {
        println!("Opening JSON file: {}", path);
        r#"[{"name":"alice","value":10},{"name":"bob","value":20}]"#.to_string()
    }

    fn extract_data(&self, raw: &str) -> Vec<String> {
        // Simple manual parsing for demonstration
        raw.trim_matches(|c| c == '[' || c == ']')
            .split("},{")
            .map(|s| {
                let trimmed = s.trim_matches(|c| c == '{' || c == '}');
                format!("{{{}}}", trimmed)
            })
            .collect()
    }

    fn parse_data(&self, data: &[String]) -> Vec<HashMap<String, i64>> {
        data.iter()
            .map(|entry| {
                let mut map = HashMap::new();
                for pair in entry.trim_matches(|c| c == '{' || c == '}').split(',') {
                    let kv: Vec<&str> = pair.split(':').collect();
                    let key = kv[0].trim().trim_matches('"');
                    let val = kv[1].trim().trim_matches('"');
                    if let Ok(n) = val.parse::<i64>() {
                        map.insert(key.to_string(), n);
                    }
                }
                map
            })
            .collect()
    }
}

fn main() {
    CsvMiner.mine("data.csv");
    // Opening CSV file: data.csv
    // [Report] Total records: 2, Sum of values: 30

    println!();

    JsonMiner.mine("data.json");
    // Opening JSON file: data.json
    // [Report] Total records: 2, Sum of values: 30
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
