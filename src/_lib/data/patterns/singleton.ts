import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const singleton: PatternDefinition = {
  slug: createPatternSlug("singleton"),
  name: "Singleton",
  category: createCategoryId("creational"),
  icon: "diamond",
  summary:
    "Ensure a class has only one instance and provide a global point of access to it.",
  intent:
    "Restrict the instantiation of a class to a single object and provide a well-known access point for that instance, ensuring coordinated access to a shared resource.",
  problem:
    "Multiple parts of your application need access to the same shared resource — such as a configuration store, connection pool, or logging service — but creating multiple instances would cause conflicts, duplicated state, or wasted resources. There is no built-in language mechanism to guarantee a single instance while still allowing lazy initialization.",
  solution:
    "Make the default constructor private and provide a static creation method that acts as the constructor. On the first call it creates the instance and caches it; on subsequent calls it returns the cached instance. Thread safety must be considered in concurrent environments.",
  participants: [
    "Singleton — the class that manages its own unique instance and provides a static accessor",
    "Client — any code that obtains the instance through the static accessor rather than direct construction",
  ],
  consequences: {
    advantages: [
      "Guarantees that only one instance of the class exists throughout the application lifetime",
      "Provides a global access point to that instance without relying on global variables",
      "The instance is created only when first requested, enabling lazy initialization",
    ],
    disadvantages: [
      "Violates the Single Responsibility Principle by coupling instance management with business logic",
      "Can mask bad design by hiding dependencies instead of making them explicit via constructor injection",
      "Makes unit testing difficult because the global state persists between tests",
      "Requires special handling in multi-threaded environments to avoid race conditions during initialization",
    ],
  },
  realWorldAnalogy:
    "A country has exactly one government. Regardless of the personal identities of the individuals who form governments, the title 'The Government of X' is a global point of access that identifies the group in charge. You don't create a new government each time someone needs to interact with it — you access the existing one.",
  useCases: [
    "Database connection pool shared across an application",
    "Application-wide configuration or settings registry",
    "Centralized logging service",
    "Hardware interface access such as a printer spooler",
    "Caching layer that must be consistent across modules",
  ],
  relatedPatterns: [
    createPatternSlug("factory-method"),
    createPatternSlug("abstract-factory"),
    createPatternSlug("builder"),
  ],
  decisionTreeQuestion: "Need exactly one shared instance?",
  codeExamples: [
    {
      language: "typescript",
      filename: "singleton.ts",
      description:
        "Thread-safe singleton using a private constructor and a static getInstance method with lazy initialization. TypeScript's module system naturally runs once, so the class-based approach is mainly useful when you need controlled, deferred creation.",
      code: `class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;

  private readonly connectionId: string;
  private readonly connectedAt: Date;

  // Private constructor prevents direct instantiation
  private constructor(private readonly host: string, private readonly port: number) {
    this.connectionId = crypto.randomUUID();
    this.connectedAt = new Date();
  }

  static getInstance(host = "localhost", port = 5432): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(host, port);
    }
    return DatabaseConnection.instance;
  }

  query(sql: string): string {
    return \`[\${this.connectionId}] Executing on \${this.host}:\${this.port}: \${sql}\`;
  }

  getInfo(): { id: string; host: string; connectedAt: Date } {
    return { id: this.connectionId, host: this.host, connectedAt: this.connectedAt };
  }
}

// Usage
const db1 = DatabaseConnection.getInstance("db.example.com", 5432);
const db2 = DatabaseConnection.getInstance(); // returns the same instance

console.log(db1 === db2);          // true
console.log(db1.query("SELECT 1")); // [same-uuid] Executing on db.example.com:5432: SELECT 1`,
    },
    {
      language: "python",
      filename: "singleton.py",
      description:
        "Thread-safe singleton using a metaclass that overrides __call__. A threading lock ensures only one instance is created even under concurrent access.",
      code: `import threading
from typing import Any


class SingletonMeta(type):
    """Metaclass that implements the Singleton pattern with thread safety."""

    _instances: dict[type, Any] = {}
    _lock: threading.Lock = threading.Lock()

    def __call__(cls, *args: Any, **kwargs: Any) -> Any:
        # Double-checked locking for thread safety
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]


class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, host: str = "localhost", port: int = 5432) -> None:
        self.host = host
        self.port = port
        self.connection_id = id(self)

    def query(self, sql: str) -> str:
        return f"[{self.connection_id}] Executing on {self.host}:{self.port}: {sql}"


# Usage
db1 = DatabaseConnection("db.example.com", 5432)
db2 = DatabaseConnection()  # returns the same instance

assert db1 is db2
print(db1.query("SELECT 1"))`,
    },
    {
      language: "php",
      filename: "Singleton.php",
      description:
        "Classic Singleton with a private constructor, a static getInstance method, and prevention of cloning and unserialization to maintain the single-instance guarantee.",
      code: `<?php

declare(strict_types=1);

final class DatabaseConnection
{
    private static ?self $instance = null;
    private string $connectionId;

    // Prevent direct construction, cloning, and unserialization
    private function __construct(
        private readonly string $host,
        private readonly int    $port,
    ) {
        $this->connectionId = bin2hex(random_bytes(8));
    }

    private function __clone(): void {}

    public function __wakeup(): void
    {
        throw new \\RuntimeException('Cannot unserialize a singleton.');
    }

    public static function getInstance(
        string $host = 'localhost',
        int $port = 5432,
    ): self {
        if (self::$instance === null) {
            self::$instance = new self($host, $port);
        }
        return self::$instance;
    }

    public function query(string $sql): string
    {
        return "[{$this->connectionId}] Executing on {$this->host}:{$this->port}: {$sql}";
    }
}

// Usage
$db1 = DatabaseConnection::getInstance('db.example.com', 5432);
$db2 = DatabaseConnection::getInstance(); // same instance

var_dump($db1 === $db2); // true
echo $db1->query('SELECT 1');`,
    },
    {
      language: "rust",
      filename: "singleton.rs",
      description:
        "Singleton using std::sync::OnceLock for safe, lazy, one-time initialization. OnceLock guarantees thread-safe initialization without requiring an explicit mutex for reads after init.",
      code: `use std::sync::OnceLock;

struct DatabaseConnection {
    host: String,
    port: u16,
    connection_id: u64,
}

impl DatabaseConnection {
    fn new(host: &str, port: u16) -> Self {
        Self {
            host: host.to_string(),
            port,
            connection_id: rand_id(),
        }
    }

    /// Access the global singleton instance, initializing it on first call.
    fn instance() -> &'static Self {
        static INSTANCE: OnceLock<DatabaseConnection> = OnceLock::new();
        INSTANCE.get_or_init(|| DatabaseConnection::new("db.example.com", 5432))
    }

    fn query(&self, sql: &str) -> String {
        format!(
            "[{}] Executing on {}:{}: {}",
            self.connection_id, self.host, self.port, sql
        )
    }
}

fn rand_id() -> u64 {
    // Simplified — in production use a proper RNG
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_nanos() as u64
}

fn main() {
    let db1 = DatabaseConnection::instance();
    let db2 = DatabaseConnection::instance();

    // Both references point to the same allocation
    assert!(std::ptr::eq(db1, db2));
    println!("{}", db1.query("SELECT 1"));
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust's ownership model and borrow checker naturally prevent shared mutable state. Global singletons bypass these guarantees and often require unsafe code or coarse locking. Prefer passing dependencies explicitly through function parameters or struct fields.",
      alternatives:
        "Use dependency injection by passing a shared &Config or Arc<T> to the components that need it. For truly global state, consider OnceLock for read-only data or Arc<Mutex<T>> when mutation is required — but question whether a singleton is the right design in the first place.",
    },
  ],
};
