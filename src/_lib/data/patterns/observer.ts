import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const observer: PatternDefinition = {
  slug: createPatternSlug("observer"),
  name: "Observer",
  category: createCategoryId("behavioral"),
  emoji: "👁️",
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
        "An EventEmitter-style implementation where a Subject manages typed subscriptions and notifies all registered observers when an event is published.",
      code: `// Observer interface
interface Observer<T> {
  update(data: T): void;
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

  notify(data: T): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

// Concrete observer
class Logger implements Observer<string> {
  update(message: string): void {
    console.log(\`[LOG] \${message}\`);
  }
}

class AlertService implements Observer<string> {
  update(message: string): void {
    console.log(\`[ALERT] \${message}\`);
  }
}

// Usage
const emitter = new EventEmitter<string>();
const logger = new Logger();
const alerts = new AlertService();

emitter.subscribe(logger);
emitter.subscribe(alerts);
emitter.notify("User signed up");
// [LOG] User signed up
// [ALERT] User signed up

emitter.unsubscribe(alerts);
emitter.notify("User placed order");
// [LOG] User placed order`,
    },
    {
      language: "python",
      filename: "observer.py",
      description:
        "A classic Observer implementation using an abstract base class. The Subject tracks attached observers and broadcasts state changes via notify().",
      code: `from abc import ABC, abstractmethod


class Observer(ABC):
    """Interface for objects that should be notified of changes."""

    @abstractmethod
    def update(self, message: str) -> None: ...


class Subject:
    """Maintains a list of observers and notifies them on state change."""

    def __init__(self) -> None:
        self._observers: list[Observer] = []

    def attach(self, observer: Observer) -> None:
        self._observers.append(observer)

    def detach(self, observer: Observer) -> None:
        self._observers.remove(observer)

    def notify(self, message: str) -> None:
        for observer in self._observers:
            observer.update(message)


class EmailSubscriber(Observer):
    def __init__(self, address: str) -> None:
        self._address = address

    def update(self, message: str) -> None:
        print(f"Email to {self._address}: {message}")


class SMSSubscriber(Observer):
    def __init__(self, phone: str) -> None:
        self._phone = phone

    def update(self, message: str) -> None:
        print(f"SMS to {self._phone}: {message}")


# Usage
newsletter = Subject()
email = EmailSubscriber("alice@example.com")
sms = SMSSubscriber("+1234567890")

newsletter.attach(email)
newsletter.attach(sms)
newsletter.notify("New edition published!")
# Email to alice@example.com: New edition published!
# SMS to +1234567890: New edition published!`,
    },
    {
      language: "php",
      filename: "Observer.php",
      description:
        "A custom Observer implementation using PHP interfaces. The NewsPublisher subject maintains subscribers and broadcasts headlines to all attached observers.",
      code: `<?php

// Observer interface
interface Observer
{
    public function update(string \$event, mixed \$data): void;
}

// Subject interface
interface Subject
{
    public function attach(Observer \$observer): void;
    public function detach(Observer \$observer): void;
    public function notify(string \$event, mixed \$data): void;
}

// Concrete subject
class NewsPublisher implements Subject
{
    /** @var Observer[] */
    private array \$observers = [];

    public function attach(Observer \$observer): void
    {
        \$this->observers[spl_object_id(\$observer)] = \$observer;
    }

    public function detach(Observer \$observer): void
    {
        unset(\$this->observers[spl_object_id(\$observer)]);
    }

    public function notify(string \$event, mixed \$data): void
    {
        foreach (\$this->observers as \$observer) {
            \$observer->update(\$event, \$data);
        }
    }

    public function publishHeadline(string \$headline): void
    {
        echo "Publishing: {\$headline}\\n";
        \$this->notify('headline', \$headline);
    }
}

// Concrete observers
class WebDisplay implements Observer
{
    public function update(string \$event, mixed \$data): void
    {
        echo "[Web] {\$event}: {\$data}\\n";
    }
}

class MobileAlert implements Observer
{
    public function update(string \$event, mixed \$data): void
    {
        echo "[Mobile Push] {\$event}: {\$data}\\n";
    }
}

// Usage
\$publisher = new NewsPublisher();
\$publisher->attach(new WebDisplay());
\$publisher->attach(new MobileAlert());
\$publisher->publishHeadline("Design Patterns in PHP");`,
    },
    {
      language: "rust",
      filename: "observer.rs",
      description:
        "A callback-based observer using boxed closures stored in a Vec. This is idiomatic Rust — trait-object observers are possible but closures are simpler for most use cases.",
      code: `/// A simple event emitter that stores boxed closure observers.
struct EventEmitter<T> {
    listeners: Vec<Box<dyn Fn(&T)>>,
}

impl<T> EventEmitter<T> {
    fn new() -> Self {
        Self { listeners: Vec::new() }
    }

    fn subscribe(&mut self, listener: impl Fn(&T) + 'static) {
        self.listeners.push(Box::new(listener));
    }

    fn notify(&self, event: &T) {
        for listener in &self.listeners {
            listener(event);
        }
    }
}

// A domain event
#[derive(Debug)]
struct OrderPlaced {
    order_id: u64,
    total: f64,
}

fn main() {
    let mut emitter = EventEmitter::new();

    // Register observers as closures
    emitter.subscribe(|e: &OrderPlaced| {
        println!("[Logger] Order #{} placed, total: {:.2}", e.order_id, e.total);
    });

    emitter.subscribe(|e: &OrderPlaced| {
        println!("[Inventory] Reserving stock for order #{}", e.order_id);
    });

    emitter.subscribe(|e: &OrderPlaced| {
        if e.total > 100.0 {
            println!("[Rewards] VIP bonus applied for order #{}", e.order_id);
        }
    });

    let event = OrderPlaced { order_id: 42, total: 149.99 };
    emitter.notify(&event);
    // [Logger] Order #42 placed, total: 149.99
    // [Inventory] Reserving stock for order #42
    // [Rewards] VIP bonus applied for order #42
}`,
    },
  ],
  antiPatternNotices: [],
};
