import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const observer: PatternDefinition = {
  slug: createPatternSlug("observer"),
  name: "Observer",
  category: createCategoryId("behavioral"),
  icon: "eye",
  summary:
    "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
  intent:
    "Establish a subscription mechanism that lets multiple objects listen for and react to events or state changes occurring in another object, without tightly coupling the publisher to its subscribers.",
  problem:
    "You have an object whose state changes are relevant to other objects, but you do not want to hard-code those dependencies. Polling for changes is wasteful, and direct method calls create rigid coupling between the subject and every interested party.",
  solution:
    "Define a Subject that maintains a list of Observers and provides methods to attach, detach, and notify them. When the Subject's state changes, it iterates through the list and calls an update method on each Observer. Observers register themselves with the Subject and implement a common interface so the Subject does not need to know their concrete types.",
  participants: [
    "Subject — maintains a list of observers and sends notifications on state change",
    "Observer — defines an update interface for objects that should be notified",
    "ConcreteSubject — stores state of interest and triggers notification when state changes",
    "ConcreteObserver — implements the update interface to keep its state consistent with the subject",
  ],
  consequences: {
    advantages: [
      "Loose coupling between the subject and its observers — the subject only knows the observer interface",
      "Support for broadcast communication — any number of observers can subscribe",
      "Observers can be added or removed at runtime without modifying the subject",
      "Encourages a clean separation between the core domain model and the presentation or side-effect layers",
    ],
    disadvantages: [
      "Notification order is not guaranteed, which can cause subtle bugs if observers depend on each other",
      "Memory leaks can occur if observers are not properly detached (lapsed listener problem)",
      "Cascade updates can be expensive or cause unexpected side effects when observers trigger further notifications",
      "Debugging can be harder because the flow of control is implicit rather than explicit",
    ],
  },
  realWorldAnalogy:
    "A newspaper subscription service works exactly like the Observer pattern. The publisher (Subject) does not need to know who the subscribers (Observers) are or what they do with the paper. Subscribers sign up and receive every new edition automatically. When they lose interest, they cancel their subscription and stop receiving issues — all without the publisher changing its printing process.",
  useCases: [
    "GUI event handling — buttons, inputs, and other widgets notify listeners of user actions",
    "Model-View synchronization in MVC/MVVM architectures",
    "Real-time data feeds such as stock tickers, chat messages, or sensor readings",
    "Pub/sub messaging systems and event buses",
    "Reactive streams and change-detection systems (e.g., RxJS, MobX, Vue reactivity)",
  ],
  relatedPatterns: [
    createPatternSlug("command"),
    createPatternSlug("strategy"),
    createPatternSlug("chain-of-responsibility"),
  ],
  decisionTreeQuestion: "Need to notify multiple objects when state changes?",
  codeExamples: [
    {
      language: "typescript",
      filename: "observer.ts",
      description:
        "A UserService event emitter that notifies Logger and EmailNotifier observers when a user_registered event fires, demonstrating typed subscriptions and observer management.",
      code: `// Observer interface
interface Observer<T> {
  update(event: string, data: T): void;
}

// Event data
interface UserData {
  id: number;
  email: string;
}

// Subject that manages subscriptions and notifications
class EventEmitter<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  emit(event: string, data: T): void {
    for (const observer of this.observers) {
      observer.update(event, data);
    }
  }
}

// Concrete observer: logs events to the console
class Logger implements Observer<UserData> {
  update(event: string, data: UserData): void {
    console.log(\`[Logger] \${event}: user #\${data.id} (\${data.email})\`);
  }
}

// Concrete observer: sends a welcome email
class EmailNotifier implements Observer<UserData> {
  update(event: string, data: UserData): void {
    console.log(\`[EmailNotifier] Sending welcome email to \${data.email}\`);
  }
}

// Concrete subject: emits events when users register
class UserService {
  private emitter = new EventEmitter<UserData>();

  subscribe(observer: Observer<UserData>): void {
    this.emitter.subscribe(observer);
  }

  unsubscribe(observer: Observer<UserData>): void {
    this.emitter.unsubscribe(observer);
  }

  register(id: number, email: string): void {
    const user: UserData = { id, email };
    console.log(\`UserService: registered user #\${id}\`);
    this.emitter.emit("user_registered", user);
  }
}

// Usage
const userService = new UserService();
const logger = new Logger();
const emailNotifier = new EmailNotifier();

userService.subscribe(logger);
userService.subscribe(emailNotifier);

userService.register(1, "alice@example.com");
// UserService: registered user #1
// [Logger] user_registered: user #1 (alice@example.com)
// [EmailNotifier] Sending welcome email to alice@example.com`,
    },
    {
      language: "python",
      filename: "observer.py",
      description:
        "A UserService that notifies Logger and EmailNotifier observers when a user_registered event fires, using abstract base classes for the observer contract.",
      code: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class UserData:
    id: int
    email: str


class Observer(ABC):
    """Interface for objects that react to events."""

    @abstractmethod
    def update(self, event: str, data: UserData) -> None: ...


class EventEmitter:
    """Subject that manages subscriptions and broadcasts events."""

    def __init__(self) -> None:
        self._observers: list[Observer] = []

    def subscribe(self, observer: Observer) -> None:
        self._observers.append(observer)

    def unsubscribe(self, observer: Observer) -> None:
        self._observers.remove(observer)

    def emit(self, event: str, data: UserData) -> None:
        for observer in self._observers:
            observer.update(event, data)


class Logger(Observer):
    """Concrete observer: logs events to the console."""

    def update(self, event: str, data: UserData) -> None:
        print(f"[Logger] {event}: user #{data.id} ({data.email})")


class EmailNotifier(Observer):
    """Concrete observer: sends a welcome email."""

    def update(self, event: str, data: UserData) -> None:
        print(f"[EmailNotifier] Sending welcome email to {data.email}")


class UserService:
    """Concrete subject: emits events when users register."""

    def __init__(self) -> None:
        self._emitter = EventEmitter()

    def subscribe(self, observer: Observer) -> None:
        self._emitter.subscribe(observer)

    def unsubscribe(self, observer: Observer) -> None:
        self._emitter.unsubscribe(observer)

    def register(self, user_id: int, email: str) -> None:
        user = UserData(id=user_id, email=email)
        print(f"UserService: registered user #{user_id}")
        self._emitter.emit("user_registered", user)


# Usage
user_service = UserService()
logger = Logger()
email_notifier = EmailNotifier()

user_service.subscribe(logger)
user_service.subscribe(email_notifier)

user_service.register(1, "alice@example.com")
# UserService: registered user #1
# [Logger] user_registered: user #1 (alice@example.com)
# [EmailNotifier] Sending welcome email to alice@example.com`,
    },
    {
      language: "php",
      filename: "Observer.php",
      description:
        "A UserService that notifies Logger and EmailNotifier observers when a user_registered event fires, using PHP interfaces for the observer and subject contracts.",
      code: `<?php

// Event data
readonly class UserData
{
    public function __construct(
        public int \$id,
        public string \$email,
    ) {}
}

// Observer interface
interface Observer
{
    public function update(string \$event, UserData \$data): void;
}

// Subject that manages subscriptions and broadcasts events
class EventEmitter
{
    /** @var Observer[] */
    private array \$observers = [];

    public function subscribe(Observer \$observer): void
    {
        \$this->observers[spl_object_id(\$observer)] = \$observer;
    }

    public function unsubscribe(Observer \$observer): void
    {
        unset(\$this->observers[spl_object_id(\$observer)]);
    }

    public function emit(string \$event, UserData \$data): void
    {
        foreach (\$this->observers as \$observer) {
            \$observer->update(\$event, \$data);
        }
    }
}

// Concrete observer: logs events to the console
class Logger implements Observer
{
    public function update(string \$event, UserData \$data): void
    {
        echo "[Logger] {\$event}: user #{\$data->id} ({\$data->email})\\n";
    }
}

// Concrete observer: sends a welcome email
class EmailNotifier implements Observer
{
    public function update(string \$event, UserData \$data): void
    {
        echo "[EmailNotifier] Sending welcome email to {\$data->email}\\n";
    }
}

// Concrete subject: emits events when users register
class UserService
{
    private EventEmitter \$emitter;

    public function __construct()
    {
        \$this->emitter = new EventEmitter();
    }

    public function subscribe(Observer \$observer): void
    {
        \$this->emitter->subscribe(\$observer);
    }

    public function unsubscribe(Observer \$observer): void
    {
        \$this->emitter->unsubscribe(\$observer);
    }

    public function register(int \$id, string \$email): void
    {
        \$user = new UserData(\$id, \$email);
        echo "UserService: registered user #{\$id}\\n";
        \$this->emitter->emit('user_registered', \$user);
    }
}

// Usage
\$userService = new UserService();
\$userService->subscribe(new Logger());
\$userService->subscribe(new EmailNotifier());

\$userService->register(1, 'alice@example.com');
// UserService: registered user #1
// [Logger] user_registered: user #1 (alice@example.com)
// [EmailNotifier] Sending welcome email to alice@example.com`,
    },
    {
      language: "rust",
      filename: "observer.rs",
      description:
        "A UserService that notifies Logger and EmailNotifier observers when a user_registered event fires, using trait objects for the observer contract.",
      code: `/// Event data passed to observers.
#[derive(Debug)]
struct UserData {
    id: u64,
    email: String,
}

/// Observer trait: receives event notifications.
trait Observer {
    fn update(&self, event: &str, data: &UserData);
}

/// Subject that manages subscriptions and broadcasts events.
struct EventEmitter {
    observers: Vec<Box<dyn Observer>>,
}

impl EventEmitter {
    fn new() -> Self {
        Self { observers: Vec::new() }
    }

    fn subscribe(&mut self, observer: Box<dyn Observer>) {
        self.observers.push(observer);
    }

    fn emit(&self, event: &str, data: &UserData) {
        for observer in &self.observers {
            observer.update(event, data);
        }
    }
}

/// Concrete observer: logs events to the console.
struct Logger;

impl Observer for Logger {
    fn update(&self, event: &str, data: &UserData) {
        println!("[Logger] {}: user #{} ({})", event, data.id, data.email);
    }
}

/// Concrete observer: sends a welcome email.
struct EmailNotifier;

impl Observer for EmailNotifier {
    fn update(&self, _event: &str, data: &UserData) {
        println!("[EmailNotifier] Sending welcome email to {}", data.email);
    }
}

/// Concrete subject: emits events when users register.
struct UserService {
    emitter: EventEmitter,
}

impl UserService {
    fn new() -> Self {
        Self { emitter: EventEmitter::new() }
    }

    fn subscribe(&mut self, observer: Box<dyn Observer>) {
        self.emitter.subscribe(observer);
    }

    fn register(&mut self, id: u64, email: &str) {
        let user = UserData { id, email: email.to_string() };
        println!("UserService: registered user #{}", id);
        self.emitter.emit("user_registered", &user);
    }
}

fn main() {
    let mut user_service = UserService::new();
    user_service.subscribe(Box::new(Logger));
    user_service.subscribe(Box::new(EmailNotifier));

    user_service.register(1, "alice@example.com");
    // UserService: registered user #1
    // [Logger] user_registered: user #1 (alice@example.com)
    // [EmailNotifier] Sending welcome email to alice@example.com
}`,
    },
  ],
  antiPatternNotices: [],
};
