import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const chainOfResponsibility: PatternDefinition = {
  slug: createPatternSlug("chain-of-responsibility"),
  name: "Chain of Responsibility",
  category: createCategoryId("behavioral"),
  icon: "link",
  summary:
    "Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.",
  intent:
    "Decouple the sender of a request from its receiver by allowing multiple objects to handle the request in sequence. Each handler decides either to process the request or to pass it along to the next handler in the chain.",
  problem:
    "You have a request that could be handled by several different objects, and you do not want the sender to know which specific object will handle it. Hard-coding the handler selection creates tight coupling and makes the system rigid when new handlers need to be added or the order needs to change.",
  solution:
    "Define a Handler interface with a method for processing requests and a reference to the next handler. Each ConcreteHandler either processes the request if it can, or forwards it to its successor. The client sends the request to the first handler in the chain without knowing which handler will ultimately process it. Handlers can be reordered, added, or removed without affecting the client.",
  participants: [
    "Handler — defines the interface for handling requests and optionally holds a reference to the next handler",
    "BaseHandler — optional abstract class that implements the default chaining behavior (forwarding to the next handler)",
    "ConcreteHandler — handles requests it is responsible for; can access its successor to forward unhandled requests",
    "Client — initiates the request to the first handler in the chain",
  ],
  consequences: {
    advantages: [
      "Reduces coupling — the sender does not need to know which handler processes the request",
      "Flexible chain composition — handlers can be added, removed, or reordered at runtime",
      "Each handler has a single responsibility, following the Single Responsibility Principle",
      "A request can be handled by multiple handlers in sequence (middleware-style processing)",
    ],
    disadvantages: [
      "No guarantee that a request will be handled — it may fall off the end of the chain",
      "Debugging can be difficult because the flow passes through multiple objects",
      "Chain configuration must be set up correctly; an incorrect order can produce wrong results",
      "Performance may suffer with very long chains, as each handler adds overhead",
    ],
  },
  realWorldAnalogy:
    "Calling a company's customer support hotline is a chain of responsibility. Your call goes to a front-line agent first. If they cannot resolve your issue, they escalate it to a specialist. If the specialist cannot help either, it goes to a manager. You, the caller, do not choose who handles your issue — you just enter the chain and each level decides whether to handle or escalate.",
  useCases: [
    "HTTP middleware pipelines — authentication, logging, CORS, rate limiting, compression",
    "Validation chains — each validator checks one rule and passes to the next if valid",
    "Support ticket routing — escalate from tier-1 to tier-2 to tier-3",
    "Event bubbling in DOM — events propagate from child to parent elements",
    "Approval workflows — manager, director, VP each have different authority levels",
    "Exception handling — catch blocks form a chain that handles different exception types",
  ],
  relatedPatterns: [
    createPatternSlug("command"),
    createPatternSlug("decorator"),
    createPatternSlug("composite"),
  ],
  decisionTreeQuestion: "Request must pass through a chain of handlers?",
  codeExamples: [
    {
      language: "typescript",
      filename: "chain-of-responsibility.ts",
      description:
        "An HTTP middleware pipeline where AuthHandler, RateLimitHandler, and LoggingHandler each inspect the request and decide whether to pass it to the next handler or reject it.",
      code: `// Request object
interface Request {
  method: string;
  path: string;
  headers: Map<string, string>;
  clientIp: string;
}

// Handler interface
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: Request): Request | null;
}

// Abstract base handler with chaining logic
abstract class BaseHandler implements Handler {
  private next: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler; // enables chaining: a.setNext(b).setNext(c)
  }

  handle(request: Request): Request | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return request;
  }
}

// Checks for a valid Authorization header
class AuthHandler extends BaseHandler {
  handle(request: Request): Request | null {
    const auth = request.headers.get("Authorization");
    if (!auth) {
      console.log("[Auth] Rejected: missing Authorization header");
      return null; // stops the chain
    }
    console.log(\`[Auth] Passed: token present for \${request.clientIp}\`);
    return super.handle(request);
  }
}

// Tracks per-IP request counts and rejects above threshold
class RateLimitHandler extends BaseHandler {
  private counts = new Map<string, number>();
  private readonly limit = 100;

  handle(request: Request): Request | null {
    const count = (this.counts.get(request.clientIp) ?? 0) + 1;
    this.counts.set(request.clientIp, count);
    if (count > this.limit) {
      console.log(\`[RateLimit] Rejected: \${request.clientIp} exceeded \${this.limit} requests\`);
      return null;
    }
    console.log(\`[RateLimit] Passed: \${request.clientIp} at \${count}/\${this.limit}\`);
    return super.handle(request);
  }
}

// Logs the request method and path, always passes through
class LoggingHandler extends BaseHandler {
  handle(request: Request): Request | null {
    console.log(\`[Logging] \${request.method} \${request.path} from \${request.clientIp}\`);
    return super.handle(request);
  }
}

// Build the chain: auth -> rateLimit -> logging
const auth = new AuthHandler();
const rateLimit = new RateLimitHandler();
const logging = new LoggingHandler();
auth.setNext(rateLimit).setNext(logging);

// Valid request — passes all handlers
console.log("--- Valid request ---");
const validReq: Request = {
  method: "GET",
  path: "/api/users",
  headers: new Map([["Authorization", "Bearer abc123"]]),
  clientIp: "192.168.1.10",
};
auth.handle(validReq);
// [Auth] Passed: token present for 192.168.1.10
// [RateLimit] Passed: 192.168.1.10 at 1/100
// [Logging] GET /api/users from 192.168.1.10

// Invalid request — rejected by AuthHandler
console.log("\\n--- Invalid request ---");
const invalidReq: Request = {
  method: "POST",
  path: "/api/admin",
  headers: new Map(),
  clientIp: "10.0.0.5",
};
auth.handle(invalidReq);
// [Auth] Rejected: missing Authorization header`,
    },
    {
      language: "python",
      filename: "chain_of_responsibility.py",
      description:
        "An HTTP middleware pipeline where AuthHandler, RateLimitHandler, and LoggingHandler each inspect the request and decide whether to pass it to the next handler or reject it.",
      code: `from __future__ import annotations

from abc import ABC
from dataclasses import dataclass, field


@dataclass
class Request:
    method: str
    path: str
    headers: dict[str, str]
    client_ip: str


class Handler(ABC):
    """Abstract handler with next-handler chaining."""

    def __init__(self) -> None:
        self._next: Handler | None = None

    def set_next(self, handler: Handler) -> Handler:
        self._next = handler
        return handler  # allows chaining

    def handle(self, request: Request) -> Request | None:
        if self._next:
            return self._next.handle(request)
        return request


class AuthHandler(Handler):
    """Checks for a valid Authorization header."""

    def handle(self, request: Request) -> Request | None:
        auth = request.headers.get("Authorization")
        if not auth:
            print("[Auth] Rejected: missing Authorization header")
            return None
        print("[Auth] Passed: token present for {ip}".format(ip=request.client_ip))
        return super().handle(request)


class RateLimitHandler(Handler):
    """Tracks per-IP request counts and rejects above threshold."""

    def __init__(self, limit: int = 100) -> None:
        super().__init__()
        self._counts: dict[str, int] = {}
        self._limit = limit

    def handle(self, request: Request) -> Request | None:
        count = self._counts.get(request.client_ip, 0) + 1
        self._counts[request.client_ip] = count
        if count > self._limit:
            print(
                "[RateLimit] Rejected: {ip} exceeded {lim} requests".format(
                    ip=request.client_ip, lim=self._limit
                )
            )
            return None
        print(
            "[RateLimit] Passed: {ip} at {n}/{lim}".format(
                ip=request.client_ip, n=count, lim=self._limit
            )
        )
        return super().handle(request)


class LoggingHandler(Handler):
    """Logs the request method and path, always passes through."""

    def handle(self, request: Request) -> Request | None:
        print(
            "[Logging] {method} {path} from {ip}".format(
                method=request.method, path=request.path, ip=request.client_ip
            )
        )
        return super().handle(request)


# Build the chain: auth -> rate_limit -> logging
auth = AuthHandler()
rate_limit = RateLimitHandler()
logging = LoggingHandler()
auth.set_next(rate_limit).set_next(logging)

# Valid request — passes all handlers
print("--- Valid request ---")
valid_req = Request(
    method="GET",
    path="/api/users",
    headers={"Authorization": "Bearer abc123"},
    client_ip="192.168.1.10",
)
auth.handle(valid_req)
# [Auth] Passed: token present for 192.168.1.10
# [RateLimit] Passed: 192.168.1.10 at 1/100
# [Logging] GET /api/users from 192.168.1.10

# Invalid request — rejected by AuthHandler
print("\\n--- Invalid request ---")
invalid_req = Request(
    method="POST",
    path="/api/admin",
    headers={},
    client_ip="10.0.0.5",
)
auth.handle(invalid_req)
# [Auth] Rejected: missing Authorization header`,
    },
    {
      language: "php",
      filename: "ChainOfResponsibility.php",
      description:
        "An HTTP middleware pipeline where AuthHandler, RateLimitHandler, and LoggingHandler each inspect the request and decide whether to pass it to the next handler or reject it.",
      code: `<?php

// Request value object
class Request
{
    public function __construct(
        public readonly string \$method,
        public readonly string \$path,
        /** @var array<string, string> */
        public readonly array \$headers,
        public readonly string \$clientIp,
    ) {}
}

// Handler interface
interface Handler
{
    public function setNext(Handler \$handler): Handler;
    public function handle(Request \$request): ?Request;
}

// Abstract base handler with chaining logic
abstract class BaseHandler implements Handler
{
    private ?Handler \$next = null;

    public function setNext(Handler \$handler): Handler
    {
        \$this->next = \$handler;
        return \$handler; // enables chaining
    }

    public function handle(Request \$request): ?Request
    {
        if (\$this->next !== null) {
            return \$this->next->handle(\$request);
        }
        return \$request;
    }
}

// Checks for a valid Authorization header
class AuthHandler extends BaseHandler
{
    public function handle(Request \$request): ?Request
    {
        if (!isset(\$request->headers['Authorization'])) {
            echo "[Auth] Rejected: missing Authorization header\\n";
            return null; // stops the chain
        }
        echo "[Auth] Passed: token present for {\$request->clientIp}\\n";
        return parent::handle(\$request);
    }
}

// Tracks per-IP request counts and rejects above threshold
class RateLimitHandler extends BaseHandler
{
    /** @var array<string, int> */
    private array \$counts = [];
    private int \$limit;

    public function __construct(int \$limit = 100)
    {
        \$this->limit = \$limit;
    }

    public function handle(Request \$request): ?Request
    {
        \$count = (\$this->counts[\$request->clientIp] ?? 0) + 1;
        \$this->counts[\$request->clientIp] = \$count;
        if (\$count > \$this->limit) {
            echo "[RateLimit] Rejected: {\$request->clientIp} exceeded {\$this->limit} requests\\n";
            return null;
        }
        echo "[RateLimit] Passed: {\$request->clientIp} at {\$count}/{\$this->limit}\\n";
        return parent::handle(\$request);
    }
}

// Logs the request method and path, always passes through
class LoggingHandler extends BaseHandler
{
    public function handle(Request \$request): ?Request
    {
        echo "[Logging] {\$request->method} {\$request->path} from {\$request->clientIp}\\n";
        return parent::handle(\$request);
    }
}

// Build the chain: auth -> rateLimit -> logging
\$auth = new AuthHandler();
\$rateLimit = new RateLimitHandler();
\$logging = new LoggingHandler();
\$auth->setNext(\$rateLimit)->setNext(\$logging);

// Valid request — passes all handlers
echo "--- Valid request ---\\n";
\$validReq = new Request('GET', '/api/users', ['Authorization' => 'Bearer abc123'], '192.168.1.10');
\$auth->handle(\$validReq);
// [Auth] Passed: token present for 192.168.1.10
// [RateLimit] Passed: 192.168.1.10 at 1/100
// [Logging] GET /api/users from 192.168.1.10

// Invalid request — rejected by AuthHandler
echo "\\n--- Invalid request ---\\n";
\$invalidReq = new Request('POST', '/api/admin', [], '10.0.0.5');
\$auth->handle(\$invalidReq);
// [Auth] Rejected: missing Authorization header`,
    },
    {
      language: "rust",
      filename: "chain_of_responsibility.rs",
      description:
        "An HTTP middleware pipeline where AuthHandler, RateLimitHandler, and LoggingHandler each inspect the request and decide whether to pass it to the next handler or reject it.",
      code: `use std::collections::HashMap;

/// HTTP request with method, path, headers, and client IP.
struct Request {
    method: String,
    path: String,
    headers: HashMap<String, String>,
    client_ip: String,
}

/// Handler trait with optional next handler.
trait Handler {
    fn set_next(&mut self, next: Box<dyn Handler>);
    fn handle(&mut self, request: &Request) -> bool;
}

/// Checks for a valid Authorization header.
struct AuthHandler {
    next: Option<Box<dyn Handler>>,
}

impl AuthHandler {
    fn new() -> Self {
        Self { next: None }
    }
}

impl Handler for AuthHandler {
    fn set_next(&mut self, next: Box<dyn Handler>) {
        self.next = Some(next);
    }

    fn handle(&mut self, request: &Request) -> bool {
        if !request.headers.contains_key("Authorization") {
            println!("[Auth] Rejected: missing Authorization header");
            return false;
        }
        println!("[Auth] Passed: token present for {}", request.client_ip);
        match self.next {
            Some(ref mut next) => next.handle(request),
            None => true,
        }
    }
}

/// Tracks per-IP request counts and rejects above threshold.
struct RateLimitHandler {
    counts: HashMap<String, u32>,
    limit: u32,
    next: Option<Box<dyn Handler>>,
}

impl RateLimitHandler {
    fn new(limit: u32) -> Self {
        Self {
            counts: HashMap::new(),
            limit,
            next: None,
        }
    }
}

impl Handler for RateLimitHandler {
    fn set_next(&mut self, next: Box<dyn Handler>) {
        self.next = Some(next);
    }

    fn handle(&mut self, request: &Request) -> bool {
        let count = self.counts.entry(request.client_ip.clone()).or_insert(0);
        *count += 1;
        if *count > self.limit {
            println!(
                "[RateLimit] Rejected: {} exceeded {} requests",
                request.client_ip, self.limit
            );
            return false;
        }
        println!(
            "[RateLimit] Passed: {} at {}/{}",
            request.client_ip, count, self.limit
        );
        match self.next {
            Some(ref mut next) => next.handle(request),
            None => true,
        }
    }
}

/// Logs the request method and path, always passes through.
struct LoggingHandler {
    next: Option<Box<dyn Handler>>,
}

impl LoggingHandler {
    fn new() -> Self {
        Self { next: None }
    }
}

impl Handler for LoggingHandler {
    fn set_next(&mut self, next: Box<dyn Handler>) {
        self.next = Some(next);
    }

    fn handle(&mut self, request: &Request) -> bool {
        println!(
            "[Logging] {} {} from {}",
            request.method, request.path, request.client_ip
        );
        match self.next {
            Some(ref mut next) => next.handle(request),
            None => true,
        }
    }
}

fn main() {
    // Build chain: auth -> rate_limit -> logging
    // Assemble inside-out because each handler owns the next.
    let logging = LoggingHandler::new();
    let mut rate_limit = RateLimitHandler::new(100);
    rate_limit.set_next(Box::new(logging));
    let mut auth = AuthHandler::new();
    auth.set_next(Box::new(rate_limit));

    // Valid request — passes all handlers
    println!("--- Valid request ---");
    let valid_req = Request {
        method: "GET".into(),
        path: "/api/users".into(),
        headers: HashMap::from([("Authorization".into(), "Bearer abc123".into())]),
        client_ip: "192.168.1.10".into(),
    };
    auth.handle(&valid_req);
    // [Auth] Passed: token present for 192.168.1.10
    // [RateLimit] Passed: 192.168.1.10 at 1/100
    // [Logging] GET /api/users from 192.168.1.10

    // Invalid request — rejected by AuthHandler
    println!("\\n--- Invalid request ---");
    let invalid_req = Request {
        method: "POST".into(),
        path: "/api/admin".into(),
        headers: HashMap::new(),
        client_ip: "10.0.0.5".into(),
    };
    auth.handle(&invalid_req);
    // [Auth] Rejected: missing Authorization header
}`,
    },
  ],
  antiPatternNotices: [],
};
