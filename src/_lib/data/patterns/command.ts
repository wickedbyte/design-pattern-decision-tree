import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const command: PatternDefinition = {
  slug: createPatternSlug("command"),
  name: "Command",
  category: createCategoryId("behavioral"),
  emoji: "📋",
  summary:
    "Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
  intent:
    "Turn a request into a standalone object that contains all information about the request. This transformation lets you pass requests as method arguments, delay or queue execution, and support undo/redo functionality.",
  problem:
    "You need to issue requests to objects without knowing anything about the operation being requested or the receiver of the request. You also want to support undo, redo, transaction logging, or macro recording, but embedding all that logic directly in the caller makes the code complex and tightly coupled.",
  solution:
    "Create a Command interface with an execute() method (and optionally undo()). Each concrete command encapsulates a receiver and the parameters needed to perform the action. An Invoker stores and triggers commands without knowing what they do. Because commands are objects, they can be stored in a history stack for undo/redo, serialized for logging, or composed into macros.",
  participants: [
    "Command — declares the interface for executing an operation (and optionally undoing it)",
    "ConcreteCommand — binds a receiver to an action; implements execute() by invoking the corresponding method on the receiver",
    "Invoker — asks the command to carry out the request; maintains command history for undo/redo",
    "Receiver — knows how to perform the operations associated with carrying out a request",
    "Client — creates a ConcreteCommand and sets its receiver",
  ],
  consequences: {
    advantages: [
      "Decouples the object that invokes the operation from the one that knows how to perform it",
      "Commands are first-class objects that can be manipulated, composed, and extended",
      "Easy to add undo/redo by storing executed commands in a history stack",
      "Commands can be assembled into composite (macro) commands",
      "Supports deferred execution, queuing, and transaction logging",
    ],
    disadvantages: [
      "Increases the number of classes since each action becomes its own command class",
      "Can be overkill for simple operations that do not need undo or queueing",
      "Undo implementation can be complex if commands have side effects on external systems",
    ],
  },
  realWorldAnalogy:
    "Ordering at a restaurant works like the Command pattern. You (Client) tell the waiter (Invoker) what you want. The waiter writes it down on an order slip (Command) and passes it to the kitchen (Receiver). The kitchen does not need to interact with you directly, and the waiter does not need to know how to cook. If you change your mind, the waiter can cross off the item (undo). Orders can also be queued and processed in sequence.",
  useCases: [
    "Text editor operations — type, delete, bold, with full undo/redo history",
    "GUI button actions — each button triggers a command object that can be reassigned",
    "Transaction systems — commands represent database operations that can be rolled back",
    "Remote control devices — each button maps to a command that controls a different device",
    "Job queues and task schedulers — commands are serialized and executed asynchronously",
    "Macro recording — a sequence of commands is recorded and replayed later",
  ],
  relatedPatterns: [
    createPatternSlug("observer"),
    createPatternSlug("chain-of-responsibility"),
    createPatternSlug("strategy"),
  ],
  decisionTreeQuestion:
    "Need undo/redo, queuing, or logging of operations?",
  codeExamples: [
    {
      language: "typescript",
      filename: "command.ts",
      description:
        "A text editor with undo/redo support. Each operation (insert, delete) is a command object that knows how to execute and reverse itself.",
      code: `// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class TextDocument {
  private content = "";

  insert(text: string, position: number): void {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }

  delete(position: number, length: number): string {
    const deleted = this.content.slice(position, position + length);
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
    return deleted;
  }

  toString(): string { return this.content; }
}

// Concrete commands
class InsertCommand implements Command {
  constructor(
    private doc: TextDocument,
    private text: string,
    private position: number
  ) {}

  execute(): void { this.doc.insert(this.text, this.position); }
  undo(): void { this.doc.delete(this.position, this.text.length); }
}

class DeleteCommand implements Command {
  private deleted = "";

  constructor(
    private doc: TextDocument,
    private position: number,
    private length: number
  ) {}

  execute(): void { this.deleted = this.doc.delete(this.position, this.length); }
  undo(): void { this.doc.insert(this.deleted, this.position); }
}

// Invoker with undo/redo
class Editor {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  executeCommand(cmd: Command): void {
    cmd.execute();
    this.history.push(cmd);
    this.redoStack = []; // clear redo stack on new action
  }

  undo(): void {
    const cmd = this.history.pop();
    if (cmd) { cmd.undo(); this.redoStack.push(cmd); }
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (cmd) { cmd.execute(); this.history.push(cmd); }
  }
}

// Usage
const doc = new TextDocument();
const editor = new Editor();

editor.executeCommand(new InsertCommand(doc, "Hello", 0));
editor.executeCommand(new InsertCommand(doc, " World", 5));
console.log(doc.toString()); // "Hello World"

editor.undo();
console.log(doc.toString()); // "Hello"

editor.redo();
console.log(doc.toString()); // "Hello World"`,
    },
    {
      language: "python",
      filename: "command.py",
      description:
        "A remote control simulator using abstract base classes. Commands encapsulate device operations and support undo for each action.",
      code: `from abc import ABC, abstractmethod


class Command(ABC):
    """Abstract command with execute and undo."""

    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...


# Receivers
class Light:
    def __init__(self, room: str) -> None:
        self.room = room
        self.brightness = 0

    def on(self) -> None:
        self.brightness = 100
        print(f"{self.room} light ON (brightness: {self.brightness}%)")

    def off(self) -> None:
        self.brightness = 0
        print(f"{self.room} light OFF")

    def dim(self, level: int) -> None:
        self.brightness = level
        print(f"{self.room} light dimmed to {level}%")


# Concrete commands
class LightOnCommand(Command):
    def __init__(self, light: Light) -> None:
        self._light = light
        self._prev_brightness = 0

    def execute(self) -> None:
        self._prev_brightness = self._light.brightness
        self._light.on()

    def undo(self) -> None:
        self._light.dim(self._prev_brightness)


class LightOffCommand(Command):
    def __init__(self, light: Light) -> None:
        self._light = light
        self._prev_brightness = 0

    def execute(self) -> None:
        self._prev_brightness = self._light.brightness
        self._light.off()

    def undo(self) -> None:
        self._light.dim(self._prev_brightness)


# Invoker
class RemoteControl:
    def __init__(self) -> None:
        self._history: list[Command] = []

    def press(self, command: Command) -> None:
        command.execute()
        self._history.append(command)

    def undo(self) -> None:
        if self._history:
            self._history.pop().undo()


# Usage
living_room = Light("Living Room")
remote = RemoteControl()

remote.press(LightOnCommand(living_room))   # Living Room light ON
remote.press(LightOffCommand(living_room))  # Living Room light OFF
remote.undo()  # Living Room light dimmed to 100%`,
    },
    {
      language: "php",
      filename: "Command.php",
      description:
        "A file system command pattern with execute/undo. Commands wrap file operations and an invoker maintains a history stack for reversal.",
      code: `<?php

// Command interface
interface Command
{
    public function execute(): void;
    public function undo(): void;
}

// Receiver
class FileSystem
{
    /** @var array<string, string> */
    private array \$files = [];

    public function createFile(string \$name, string \$content): void
    {
        \$this->files[\$name] = \$content;
        echo "Created: {\$name}\\n";
    }

    public function deleteFile(string \$name): ?string
    {
        \$content = \$this->files[\$name] ?? null;
        unset(\$this->files[\$name]);
        echo "Deleted: {\$name}\\n";
        return \$content;
    }

    public function listFiles(): void
    {
        echo "Files: " . implode(', ', array_keys(\$this->files)) . "\\n";
    }
}

// Concrete commands
class CreateFileCommand implements Command
{
    public function __construct(
        private FileSystem \$fs,
        private string \$name,
        private string \$content,
    ) {}

    public function execute(): void
    {
        \$this->fs->createFile(\$this->name, \$this->content);
    }

    public function undo(): void
    {
        \$this->fs->deleteFile(\$this->name);
    }
}

class DeleteFileCommand implements Command
{
    private ?string \$backup = null;

    public function __construct(
        private FileSystem \$fs,
        private string \$name,
    ) {}

    public function execute(): void
    {
        \$this->backup = \$this->fs->deleteFile(\$this->name);
    }

    public function undo(): void
    {
        if (\$this->backup !== null) {
            \$this->fs->createFile(\$this->name, \$this->backup);
        }
    }
}

// Invoker
class CommandHistory
{
    /** @var Command[] */
    private array \$history = [];

    public function execute(Command \$cmd): void
    {
        \$cmd->execute();
        \$this->history[] = \$cmd;
    }

    public function undo(): void
    {
        \$cmd = array_pop(\$this->history);
        \$cmd?->undo();
    }
}

// Usage
\$fs = new FileSystem();
\$history = new CommandHistory();

\$history->execute(new CreateFileCommand(\$fs, 'readme.md', '# Hello'));
\$history->execute(new CreateFileCommand(\$fs, 'config.json', '{}'));
\$fs->listFiles(); // Files: readme.md, config.json

\$history->undo(); // Deleted: config.json
\$fs->listFiles(); // Files: readme.md`,
    },
    {
      language: "rust",
      filename: "command.rs",
      description:
        "A calculator with undo support using a Command trait. Each operation stores enough state to reverse itself, and the invoker maintains a history stack.",
      code: `/// Command trait with execute and undo.
trait Command {
    fn execute(&mut self, value: &mut f64);
    fn undo(&mut self, value: &mut f64);
}

struct AddCommand {
    amount: f64,
}

impl Command for AddCommand {
    fn execute(&mut self, value: &mut f64) {
        *value += self.amount;
    }
    fn undo(&mut self, value: &mut f64) {
        *value -= self.amount;
    }
}

struct MultiplyCommand {
    factor: f64,
    prev_value: f64, // stored for undo
}

impl MultiplyCommand {
    fn new(factor: f64) -> Self {
        Self { factor, prev_value: 0.0 }
    }
}

impl Command for MultiplyCommand {
    fn execute(&mut self, value: &mut f64) {
        self.prev_value = *value;
        *value *= self.factor;
    }
    fn undo(&mut self, value: &mut f64) {
        *value = self.prev_value;
    }
}

/// Invoker that tracks command history for undo.
struct Calculator {
    value: f64,
    history: Vec<Box<dyn Command>>,
}

impl Calculator {
    fn new(initial: f64) -> Self {
        Self { value: initial, history: Vec::new() }
    }

    fn execute(&mut self, mut cmd: Box<dyn Command>) {
        cmd.execute(&mut self.value);
        self.history.push(cmd);
        println!("= {}", self.value);
    }

    fn undo(&mut self) {
        if let Some(mut cmd) = self.history.pop() {
            cmd.undo(&mut self.value);
            println!("Undo -> {}", self.value);
        }
    }
}

fn main() {
    let mut calc = Calculator::new(10.0);

    calc.execute(Box::new(AddCommand { amount: 5.0 }));       // = 15
    calc.execute(Box::new(MultiplyCommand::new(3.0)));         // = 45
    calc.execute(Box::new(AddCommand { amount: -10.0 }));      // = 35

    calc.undo(); // Undo -> 45
    calc.undo(); // Undo -> 15
}`,
    },
  ],
  antiPatternNotices: [],
};
