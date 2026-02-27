import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const decorator: PatternDefinition = {
  slug: createPatternSlug("decorator"),
  name: "Decorator",
  category: createCategoryId("structural"),
  emoji: "🎀",
  summary:
    "Attach additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending functionality.",
  intent:
    "Wrap an object inside another object that adds new behavior before or after delegating to the original, allowing responsibilities to be composed at runtime rather than baked into a rigid class hierarchy.",
  problem:
    "You need to add optional behaviors -- such as logging, encryption, compression, or caching -- to individual objects at runtime. Using inheritance to create every possible combination would lead to a class explosion (e.g., LoggingEncryptedCompressedStream), and modifying the original class violates the Open/Closed Principle.",
  solution:
    "Define a common interface for both the core component and its decorators. Each decorator implements the interface and holds a reference to a wrapped component. It delegates the core work to the wrapped object and adds its own behavior before or after the delegation. Decorators can be stacked arbitrarily, composing behaviors at runtime.",
  participants: [
    "Component -- the common interface for both concrete objects and decorators",
    "ConcreteComponent -- the original object that can be decorated",
    "Decorator -- base class or interface that wraps a Component and conforms to its interface",
    "ConcreteDecorator -- adds specific behavior before or after delegating to the wrapped Component",
  ],
  consequences: {
    advantages: [
      "More flexible than static inheritance -- behaviors can be added and removed at runtime",
      "Avoids feature-laden classes high up in the hierarchy (class explosion problem)",
      "Follows the Single Responsibility Principle -- each decorator handles one concern",
      "Decorators can be composed in any order to create custom combinations",
    ],
    disadvantages: [
      "Many small objects can make the system harder to understand and debug",
      "Removing a specific decorator from the middle of a chain is difficult",
      "Decorator ordering can matter, and incorrect ordering leads to subtle bugs",
      "The component identity changes -- obj !== decoratedObj, which can break equality checks",
    ],
  },
  realWorldAnalogy:
    "Wearing layers of clothing is the Decorator pattern. You start with a base layer (t-shirt), then add a sweater for warmth, then a rain jacket for waterproofing. Each layer adds a responsibility without altering the layers beneath, and you can mix and match depending on conditions.",
  useCases: [
    "Adding logging, timing, or retry logic to service calls without modifying the service",
    "Composing I/O stream behaviors: buffering, compression, encryption",
    "Dynamically adding validation rules to form fields in a UI framework",
    "Wrapping a data repository with caching or audit-trail functionality",
    "Adding authentication or rate-limiting middleware to HTTP handlers",
  ],
  relatedPatterns: [
    createPatternSlug("adapter"),
    createPatternSlug("proxy"),
    createPatternSlug("composite"),
    createPatternSlug("strategy"),
  ],
  decisionTreeQuestion:
    "Need to add responsibilities to objects dynamically?",
  codeExamples: [
    {
      language: "typescript",
      filename: "decorator.ts",
      description:
        "Decorators that add logging and encryption to a DataSource interface, demonstrating how behaviors compose by wrapping one decorator inside another.",
      code: `// Component interface
interface DataSource {
  write(data: string): void;
  read(): string;
}

// ConcreteComponent
class FileDataSource implements DataSource {
  private content = "";

  write(data: string): void {
    this.content = data;
    console.log("Wrote raw data to file");
  }

  read(): string {
    return this.content;
  }
}

// Base decorator
abstract class DataSourceDecorator implements DataSource {
  constructor(protected readonly wrapped: DataSource) {}
  write(data: string): void { this.wrapped.write(data); }
  read(): string { return this.wrapped.read(); }
}

// ConcreteDecorator -- adds encryption
class EncryptionDecorator extends DataSourceDecorator {
  write(data: string): void {
    const encrypted = btoa(data); // simple base64 for demo
    console.log("Encrypting data");
    super.write(encrypted);
  }

  read(): string {
    const raw = super.read();
    console.log("Decrypting data");
    return atob(raw);
  }
}

// ConcreteDecorator -- adds logging
class LoggingDecorator extends DataSourceDecorator {
  write(data: string): void {
    console.log(\`[LOG] Writing \${data.length} chars\`);
    super.write(data);
  }

  read(): string {
    console.log("[LOG] Reading data");
    return super.read();
  }
}

// Stack decorators at runtime
let source: DataSource = new FileDataSource();
source = new EncryptionDecorator(source);
source = new LoggingDecorator(source);

source.write("secret payload");
console.log("Result:", source.read());`,
    },
    {
      language: "python",
      filename: "decorator.py",
      description:
        "Uses both a class-based decorator chain and Python's native @decorator syntax to add logging and encryption to a data source.",
      code: `"""Decorator pattern -- composable data-source behaviors."""

from __future__ import annotations

import base64
from abc import ABC, abstractmethod


# Component interface
class DataSource(ABC):
    @abstractmethod
    def write(self, data: str) -> None: ...

    @abstractmethod
    def read(self) -> str: ...


# ConcreteComponent
class FileDataSource(DataSource):
    def __init__(self) -> None:
        self._content = ""

    def write(self, data: str) -> None:
        self._content = data
        print("Wrote raw data to file")

    def read(self) -> str:
        return self._content


# Base decorator
class DataSourceDecorator(DataSource):
    def __init__(self, wrapped: DataSource) -> None:
        self._wrapped = wrapped

    def write(self, data: str) -> None:
        self._wrapped.write(data)

    def read(self) -> str:
        return self._wrapped.read()


# ConcreteDecorators
class EncryptionDecorator(DataSourceDecorator):
    def write(self, data: str) -> None:
        encrypted = base64.b64encode(data.encode()).decode()
        print("Encrypting data")
        super().write(encrypted)

    def read(self) -> str:
        raw = super().read()
        print("Decrypting data")
        return base64.b64decode(raw.encode()).decode()


class LoggingDecorator(DataSourceDecorator):
    def write(self, data: str) -> None:
        print(f"[LOG] Writing {len(data)} chars")
        super().write(data)

    def read(self) -> str:
        print("[LOG] Reading data")
        return super().read()


# Stack decorators
source: DataSource = FileDataSource()
source = EncryptionDecorator(source)
source = LoggingDecorator(source)

source.write("secret payload")
print("Result:", source.read())`,
    },
    {
      language: "php",
      filename: "Decorator.php",
      description:
        "PHP decorator classes that layer encryption and logging onto a DataSource interface, each implementing the same contract and delegating to the wrapped object.",
      code: `<?php

// Component interface
interface DataSource
{
    public function write(string $data): void;
    public function read(): string;
}

// ConcreteComponent
class FileDataSource implements DataSource
{
    private string $content = '';

    public function write(string $data): void
    {
        $this->content = $data;
        echo "Wrote raw data to file\\n";
    }

    public function read(): string
    {
        return $this->content;
    }
}

// Base decorator
abstract class DataSourceDecorator implements DataSource
{
    public function __construct(protected readonly DataSource $wrapped) {}

    public function write(string $data): void
    {
        $this->wrapped->write($data);
    }

    public function read(): string
    {
        return $this->wrapped->read();
    }
}

// ConcreteDecorator -- encryption
class EncryptionDecorator extends DataSourceDecorator
{
    public function write(string $data): void
    {
        echo "Encrypting data\\n";
        parent::write(base64_encode($data));
    }

    public function read(): string
    {
        echo "Decrypting data\\n";
        return base64_decode(parent::read());
    }
}

// ConcreteDecorator -- logging
class LoggingDecorator extends DataSourceDecorator
{
    public function write(string $data): void
    {
        echo "[LOG] Writing " . strlen($data) . " chars\\n";
        parent::write($data);
    }

    public function read(): string
    {
        echo "[LOG] Reading data\\n";
        return parent::read();
    }
}

// Stack decorators
$source = new FileDataSource();
$source = new EncryptionDecorator($source);
$source = new LoggingDecorator($source);

$source->write('secret payload');
echo "Result: " . $source->read() . "\\n";`,
    },
    {
      language: "rust",
      filename: "decorator.rs",
      description:
        "Rust trait-based decorators that wrap a DataSource trait object, composing encryption and logging behaviors through trait composition rather than inheritance.",
      code: `use std::cell::RefCell;
use base64::{engine::general_purpose::STANDARD, Engine};

// Component trait
trait DataSource {
    fn write(&self, data: &str);
    fn read(&self) -> String;
}

// ConcreteComponent
struct FileDataSource {
    content: RefCell<String>,
}

impl FileDataSource {
    fn new() -> Self {
        Self { content: RefCell::new(String::new()) }
    }
}

impl DataSource for FileDataSource {
    fn write(&self, data: &str) {
        *self.content.borrow_mut() = data.to_string();
        println!("Wrote raw data to file");
    }
    fn read(&self) -> String {
        self.content.borrow().clone()
    }
}

// Decorator -- encryption
struct EncryptionDecorator<T: DataSource> {
    wrapped: T,
}

impl<T: DataSource> DataSource for EncryptionDecorator<T> {
    fn write(&self, data: &str) {
        println!("Encrypting data");
        let encrypted = STANDARD.encode(data);
        self.wrapped.write(&encrypted);
    }
    fn read(&self) -> String {
        let raw = self.wrapped.read();
        println!("Decrypting data");
        let bytes = STANDARD.decode(&raw).unwrap_or_default();
        String::from_utf8(bytes).unwrap_or_default()
    }
}

// Decorator -- logging
struct LoggingDecorator<T: DataSource> {
    wrapped: T,
}

impl<T: DataSource> DataSource for LoggingDecorator<T> {
    fn write(&self, data: &str) {
        println!("[LOG] Writing {} chars", data.len());
        self.wrapped.write(data);
    }
    fn read(&self) -> String {
        println!("[LOG] Reading data");
        self.wrapped.read()
    }
}

fn main() {
    let source = LoggingDecorator {
        wrapped: EncryptionDecorator {
            wrapped: FileDataSource::new(),
        },
    };
    source.write("secret payload");
    println!("Result: {}", source.read());
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust lacks classical inheritance, so the decorator chain cannot use a shared abstract base class. Instead, use generic structs parameterized by the component trait. Deeply nested generics can make type signatures unwieldy; consider trait objects (Box<dyn DataSource>) for runtime flexibility at the cost of dynamic dispatch.",
      alternatives:
        "For simpler cases, closures or combinator functions may be more idiomatic than full struct-based decorators.",
    },
  ],
};
