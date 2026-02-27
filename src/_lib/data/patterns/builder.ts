import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const builder: PatternDefinition = {
  slug: createPatternSlug("builder"),
  name: "Builder",
  category: createCategoryId("creational"),
  icon: "hammer",
  summary:
    "Separate the construction of a complex object from its representation so the same construction process can create different representations.",
  intent:
    "Provide a step-by-step construction process for a complex object, allowing the same building procedure to produce different types and representations while keeping the construction code isolated from the object's internal structure.",
  problem:
    "You need to create an object that requires many configuration steps, optional parameters, or nested sub-objects. A constructor with dozens of parameters becomes unreadable (the 'telescoping constructor' problem), and not every combination of parameters is valid. You also want to reuse the same construction logic to produce different representations of the object.",
  solution:
    "Extract the object construction code into a separate Builder class. Organize the construction into a series of well-named steps (setWhere, addJoin, limit, etc.). Clients call only the steps they need. An optional Director class can encapsulate common construction sequences for reuse.",
  participants: [
    "Builder — declares the step-by-step interface for constructing parts of the product",
    "ConcreteBuilder — implements the builder interface and assembles the product, keeping track of the current state",
    "Director (optional) — defines the order in which building steps are called to construct common configurations",
    "Product — the complex object being built, whose internal representation may vary",
  ],
  consequences: {
    advantages: [
      "Constructs objects step by step, deferring or omitting optional steps as needed",
      "Reuses the same construction code to build different representations of the product",
      "Isolates complex construction logic from business logic (Single Responsibility Principle)",
      "Eliminates telescoping constructors and makes object creation code self-documenting",
    ],
    disadvantages: [
      "Increases overall code complexity by introducing multiple new builder classes",
      "Requires the client to be aware of the different builder types when no Director is used",
      "The product is not available until build() is called, so partial objects could be used by mistake if the API is not carefully designed",
    ],
  },
  realWorldAnalogy:
    "Building a house follows a fixed general process — lay the foundation, build walls, install the roof, add plumbing and electricity — but the details of each step differ wildly. A wooden cabin and a stone castle go through the same stages, yet the builder (construction crew) makes different choices at every step. You, as the director, specify what you want; the builder figures out how to construct it.",
  useCases: [
    "SQL or NoSQL query builders that assemble queries programmatically",
    "HTTP request builders with optional headers, body, query parameters, and timeouts",
    "Complex configuration objects with many optional fields (e.g., server config)",
    "Document or report generators that produce multiple output formats from the same data",
    "Test data factories that build domain objects with sensible defaults",
  ],
  relatedPatterns: [
    createPatternSlug("abstract-factory"),
    createPatternSlug("prototype"),
    createPatternSlug("singleton"),
  ],
  decisionTreeQuestion: "Object has many optional parts or complex construction?",
  codeExamples: [
    {
      language: "typescript",
      filename: "builder.ts",
      description:
        "Fluent HTTP request builder with method chaining. Each setter returns 'this' for a chainable API, and build() produces an immutable request object.",
      code: `interface HttpRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: ReadonlyMap<string, string>;
  readonly body?: string;
  readonly timeout: number;
}

class HttpRequestBuilder {
  private method = "GET";
  private url = "/";
  private headers = new Map<string, string>();
  private body?: string;
  private timeout = 30_000;

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.headers.set(key, value);
    return this;
  }

  setBody(body: string): this {
    this.body = body;
    return this;
  }

  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  build(): HttpRequest {
    return {
      method: this.method,
      url: this.url,
      headers: new Map(this.headers),
      body: this.body,
      timeout: this.timeout,
    };
  }
}

// Usage
const request = new HttpRequestBuilder()
  .setMethod("POST")
  .setUrl("https://api.example.com/users")
  .addHeader("Content-Type", "application/json")
  .addHeader("Authorization", "Bearer token123")
  .setBody(JSON.stringify({ name: "Alice" }))
  .setTimeout(5_000)
  .build();

console.log(request.method, request.url); // POST https://api.example.com/users`,
    },
    {
      language: "python",
      filename: "builder.py",
      description:
        "Fluent HTTP request builder in Python. Each method returns self for chaining, and build() returns a frozen dataclass to ensure immutability.",
      code: `from dataclasses import dataclass, field
from typing import Self


@dataclass(frozen=True)
class HttpRequest:
    method: str
    url: str
    headers: dict[str, str]
    body: str | None
    timeout: int


class HttpRequestBuilder:
    def __init__(self) -> None:
        self._method = "GET"
        self._url = "/"
        self._headers: dict[str, str] = {}
        self._body: str | None = None
        self._timeout = 30_000

    def set_method(self, method: str) -> Self:
        self._method = method
        return self

    def set_url(self, url: str) -> Self:
        self._url = url
        return self

    def add_header(self, key: str, value: str) -> Self:
        self._headers[key] = value
        return self

    def set_body(self, body: str) -> Self:
        self._body = body
        return self

    def set_timeout(self, ms: int) -> Self:
        self._timeout = ms
        return self

    def build(self) -> HttpRequest:
        return HttpRequest(
            method=self._method,
            url=self._url,
            headers=dict(self._headers),
            body=self._body,
            timeout=self._timeout,
        )


# Usage
request = (
    HttpRequestBuilder()
    .set_method("POST")
    .set_url("https://api.example.com/users")
    .add_header("Content-Type", "application/json")
    .add_header("Authorization", "Bearer token123")
    .set_body('{"name": "Alice"}')
    .set_timeout(5_000)
    .build()
)

print(request.method, request.url)  # POST https://api.example.com/users`,
    },
    {
      language: "php",
      filename: "Builder.php",
      description:
        "Fluent HTTP request builder in PHP. Each setter returns $this for a chainable API, and build() produces a readonly DTO.",
      code: `<?php

declare(strict_types=1);

final readonly class HttpRequest
{
    /**
     * @param array<string, string> $headers
     */
    public function __construct(
        public string  $method,
        public string  $url,
        public array   $headers,
        public ?string $body,
        public int     $timeout,
    ) {}
}

final class HttpRequestBuilder
{
    private string $method = 'GET';
    private string $url = '/';
    /** @var array<string, string> */
    private array $headers = [];
    private ?string $body = null;
    private int $timeout = 30_000;

    public function setMethod(string $method): self
    {
        $this->method = $method;
        return $this;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function addHeader(string $key, string $value): self
    {
        $this->headers[$key] = $value;
        return $this;
    }

    public function setBody(string $body): self
    {
        $this->body = $body;
        return $this;
    }

    public function setTimeout(int $ms): self
    {
        $this->timeout = $ms;
        return $this;
    }

    public function build(): HttpRequest
    {
        return new HttpRequest(
            method:  $this->method,
            url:     $this->url,
            headers: $this->headers,
            body:    $this->body,
            timeout: $this->timeout,
        );
    }
}

// Usage
$request = (new HttpRequestBuilder())
    ->setMethod('POST')
    ->setUrl('https://api.example.com/users')
    ->addHeader('Content-Type', 'application/json')
    ->addHeader('Authorization', 'Bearer token123')
    ->setBody(json_encode(['name' => 'Alice']))
    ->setTimeout(5_000)
    ->build();

echo "{$request->method} {$request->url}\\n"; // POST https://api.example.com/users`,
    },
    {
      language: "rust",
      filename: "builder.rs",
      description:
        "Idiomatic Rust builder using owned self (consuming builder). Each method takes self by value and returns it, which prevents reuse of a partially-configured builder — a common Rust convention that avoids accidental sharing.",
      code: `#[derive(Debug)]
struct HttpRequest {
    method: String,
    url: String,
    headers: Vec<(String, String)>,
    body: Option<String>,
    timeout_ms: u64,
}

#[derive(Default)]
struct HttpRequestBuilder {
    method: String,
    url: String,
    headers: Vec<(String, String)>,
    body: Option<String>,
    timeout_ms: u64,
}

impl HttpRequestBuilder {
    fn new() -> Self {
        Self {
            method: "GET".into(),
            url: "/".into(),
            timeout_ms: 30_000,
            ..Default::default()
        }
    }

    fn method(mut self, method: &str) -> Self {
        self.method = method.into();
        self
    }

    fn url(mut self, url: &str) -> Self {
        self.url = url.into();
        self
    }

    fn header(mut self, key: &str, value: &str) -> Self {
        self.headers.push((key.into(), value.into()));
        self
    }

    fn body(mut self, body: &str) -> Self {
        self.body = Some(body.into());
        self
    }

    fn timeout(mut self, ms: u64) -> Self {
        self.timeout_ms = ms;
        self
    }

    fn build(self) -> HttpRequest {
        HttpRequest {
            method: self.method,
            url: self.url,
            headers: self.headers,
            body: self.body,
            timeout_ms: self.timeout_ms,
        }
    }
}

fn main() {
    let request = HttpRequestBuilder::new()
        .method("POST")
        .url("https://api.example.com/users")
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer token123")
        .body(r#"{"name":"Alice"}"#)
        .timeout(5_000)
        .build();

    println!("{} {}", request.method, request.url);
}`,
    },
  ],
  antiPatternNotices: [],
};
