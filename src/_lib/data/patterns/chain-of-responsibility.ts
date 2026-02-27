import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const chainOfResponsibility: PatternDefinition = {
  slug: createPatternSlug("chain-of-responsibility"),
  name: "Chain of Responsibility",
  category: createCategoryId("behavioral"),
  emoji: "⛓️",
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
  decisionTreeQuestion:
    "Request must pass through a chain of handlers?",
  codeExamples: [
    {
      language: "typescript",
      filename: "chain-of-responsibility.ts",
      description:
        "A middleware-style pipeline for HTTP request processing. Each handler processes the request and decides whether to pass it to the next handler in the chain.",
      code: `// Request object
interface HttpRequest {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  user?: string;
}

// Handler interface
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: HttpRequest): HttpRequest | null;
}

// Abstract base handler with chaining logic
abstract class BaseHandler implements Handler {
  private next: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler; // enables chaining: a.setNext(b).setNext(c)
  }

  handle(request: HttpRequest): HttpRequest | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return request;
  }
}

// Concrete handlers
class AuthHandler extends BaseHandler {
  handle(request: HttpRequest): HttpRequest | null {
    const token = request.headers["authorization"];
    if (!token) {
      console.log("[Auth] Rejected: no token");
      return null; // stops the chain
    }
    request.user = token.replace("Bearer ", "");
    console.log(\`[Auth] Authenticated: \${request.user}\`);
    return super.handle(request);
  }
}

class RateLimitHandler extends BaseHandler {
  private requests = 0;

  handle(request: HttpRequest): HttpRequest | null {
    this.requests++;
    if (this.requests > 100) {
      console.log("[RateLimit] Too many requests");
      return null;
    }
    console.log(\`[RateLimit] Request \${this.requests}/100\`);
    return super.handle(request);
  }
}

class LoggingHandler extends BaseHandler {
  handle(request: HttpRequest): HttpRequest | null {
    console.log(\`[Log] \${request.method} \${request.path}\`);
    return super.handle(request);
  }
}

// Build the chain
const auth = new AuthHandler();
const rateLimit = new RateLimitHandler();
const logging = new LoggingHandler();

auth.setNext(rateLimit).setNext(logging);

// Usage
const req: HttpRequest = {
  path: "/api/users",
  method: "GET",
  headers: { authorization: "Bearer alice" },
};

auth.handle(req);
// [Auth] Authenticated: alice
// [RateLimit] Request 1/100
// [Log] GET /api/users`,
    },
    {
      language: "python",
      filename: "chain_of_responsibility.py",
      description:
        "A validation chain using abstract base classes. Each validator checks one condition and passes the request to the next handler if validation succeeds.",
      code: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class RegistrationRequest:
    username: str
    email: str
    password: str
    age: int


class ValidationHandler(ABC):
    """Abstract handler with next-handler chaining."""

    def __init__(self) -> None:
        self._next: ValidationHandler | None = None

    def set_next(self, handler: "ValidationHandler") -> "ValidationHandler":
        self._next = handler
        return handler  # allows chaining

    def handle(self, request: RegistrationRequest) -> str | None:
        if self._next:
            return self._next.handle(request)
        return None  # all validations passed

    @abstractmethod
    def validate(self, request: RegistrationRequest) -> str | None:
        """Return error message or None if valid."""


class UsernameValidator(ValidationHandler):
    def handle(self, request: RegistrationRequest) -> str | None:
        error = self.validate(request)
        return error if error else super().handle(request)

    def validate(self, request: RegistrationRequest) -> str | None:
        if len(request.username) < 3:
            return "Username must be at least 3 characters"
        return None


class EmailValidator(ValidationHandler):
    def handle(self, request: RegistrationRequest) -> str | None:
        error = self.validate(request)
        return error if error else super().handle(request)

    def validate(self, request: RegistrationRequest) -> str | None:
        if "@" not in request.email:
            return "Invalid email address"
        return None


class AgeValidator(ValidationHandler):
    def handle(self, request: RegistrationRequest) -> str | None:
        error = self.validate(request)
        return error if error else super().handle(request)

    def validate(self, request: RegistrationRequest) -> str | None:
        if request.age < 18:
            return "Must be at least 18 years old"
        return None


# Build chain
username_check = UsernameValidator()
email_check = EmailValidator()
age_check = AgeValidator()
username_check.set_next(email_check).set_next(age_check)

# Usage
req = RegistrationRequest("al", "alice@mail.com", "secret123", 25)
error = username_check.handle(req)
print(error or "Registration valid!")
# Username must be at least 3 characters

req2 = RegistrationRequest("alice", "alice@mail.com", "secret123", 25)
error2 = username_check.handle(req2)
print(error2 or "Registration valid!")
# Registration valid!`,
    },
    {
      language: "php",
      filename: "ChainOfResponsibility.php",
      description:
        "A support ticket escalation system. Each support tier tries to resolve the issue; if it cannot, it escalates to the next tier in the chain.",
      code: `<?php

// Handler interface
interface SupportHandler
{
    public function setNext(SupportHandler \$handler): SupportHandler;
    public function handle(string \$issue, int \$severity): string;
}

// Abstract base handler
abstract class BaseSupportHandler implements SupportHandler
{
    private ?SupportHandler \$next = null;

    public function setNext(SupportHandler \$handler): SupportHandler
    {
        \$this->next = \$handler;
        return \$handler;
    }

    public function handle(string \$issue, int \$severity): string
    {
        if (\$this->next !== null) {
            return \$this->next->handle(\$issue, \$severity);
        }
        return "No handler could resolve: {\$issue}";
    }
}

// Concrete handlers
class FrontlineSupport extends BaseSupportHandler
{
    public function handle(string \$issue, int \$severity): string
    {
        if (\$severity <= 1) {
            return "[Tier-1] Resolved '{\$issue}' with FAQ reference.";
        }
        echo "[Tier-1] Escalating '{\$issue}'...\\n";
        return parent::handle(\$issue, \$severity);
    }
}

class TechnicalSupport extends BaseSupportHandler
{
    public function handle(string \$issue, int \$severity): string
    {
        if (\$severity <= 3) {
            return "[Tier-2] Resolved '{\$issue}' with technical fix.";
        }
        echo "[Tier-2] Escalating '{\$issue}'...\\n";
        return parent::handle(\$issue, \$severity);
    }
}

class EngineeringTeam extends BaseSupportHandler
{
    public function handle(string \$issue, int \$severity): string
    {
        return "[Engineering] Investigating '{\$issue}' — bug ticket created.";
    }
}

// Build chain
\$frontline = new FrontlineSupport();
\$technical = new TechnicalSupport();
\$engineering = new EngineeringTeam();

\$frontline->setNext(\$technical)->setNext(\$engineering);

// Usage
echo \$frontline->handle("Password reset", 1) . "\\n";
// [Tier-1] Resolved 'Password reset' with FAQ reference.

echo \$frontline->handle("API returns 500", 3) . "\\n";
// [Tier-1] Escalating...
// [Tier-2] Resolved 'API returns 500' with technical fix.

echo \$frontline->handle("Data corruption", 5) . "\\n";
// [Tier-1] Escalating...
// [Tier-2] Escalating...
// [Engineering] Investigating 'Data corruption' — bug ticket created.`,
    },
    {
      language: "rust",
      filename: "chain_of_responsibility.rs",
      description:
        "A logging chain using trait objects and Box<dyn Handler>. Each log handler checks the severity level and either processes the message or forwards it to the next handler.",
      code: `/// Log severity levels.
#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
enum Level {
    Debug,
    Info,
    Warning,
    Error,
}

/// Handler trait with optional next handler.
trait LogHandler {
    fn set_next(&mut self, next: Box<dyn LogHandler>);
    fn handle(&self, level: Level, message: &str);
}

struct ConsoleHandler {
    threshold: Level,
    next: Option<Box<dyn LogHandler>>,
}

impl ConsoleHandler {
    fn new(threshold: Level) -> Self {
        Self { threshold, next: None }
    }
}

impl LogHandler for ConsoleHandler {
    fn set_next(&mut self, next: Box<dyn LogHandler>) {
        self.next = Some(next);
    }

    fn handle(&self, level: Level, message: &str) {
        if level >= self.threshold {
            println!("[Console] {:?}: {}", level, message);
        }
        if let Some(ref next) = self.next {
            next.handle(level, message);
        }
    }
}

struct FileHandler {
    threshold: Level,
    filename: String,
    next: Option<Box<dyn LogHandler>>,
}

impl FileHandler {
    fn new(threshold: Level, filename: &str) -> Self {
        Self { threshold, filename: filename.to_string(), next: None }
    }
}

impl LogHandler for FileHandler {
    fn set_next(&mut self, next: Box<dyn LogHandler>) {
        self.next = Some(next);
    }

    fn handle(&self, level: Level, message: &str) {
        if level >= self.threshold {
            println!("[File:{}] {:?}: {}", self.filename, level, message);
        }
        if let Some(ref next) = self.next {
            next.handle(level, message);
        }
    }
}

struct AlertHandler {
    next: Option<Box<dyn LogHandler>>,
}

impl LogHandler for AlertHandler {
    fn set_next(&mut self, next: Box<dyn LogHandler>) {
        self.next = Some(next);
    }

    fn handle(&self, level: Level, message: &str) {
        if level >= Level::Error {
            println!("[ALERT] Paging on-call: {:?}: {}", level, message);
        }
        if let Some(ref next) = self.next {
            next.handle(level, message);
        }
    }
}

fn main() {
    // Build chain: console -> file -> alert
    let alert = AlertHandler { next: None };
    let mut file = FileHandler::new(Level::Warning, "app.log");
    file.set_next(Box::new(alert));
    let mut console = ConsoleHandler::new(Level::Debug);
    console.set_next(Box::new(file));

    console.handle(Level::Debug, "Startup complete");
    // [Console] Debug: Startup complete

    console.handle(Level::Error, "Database connection lost");
    // [Console] Error: Database connection lost
    // [File:app.log] Error: Database connection lost
    // [ALERT] Paging on-call: Error: Database connection lost
}`,
    },
  ],
  antiPatternNotices: [],
};
