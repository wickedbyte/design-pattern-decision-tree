import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const command: PatternDefinition = {
  slug: createPatternSlug("command"),
  name: "Command",
  category: createCategoryId("behavioral"),
  icon: "terminal",
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
        "A text editor with undo support. InsertCommand and DeleteCommand operate on a TextDocument receiver, while the Editor invoker maintains a history stack.",
      code: `// Command interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class TextDocument {
  private content = "";

  insert(text: string, position: number): void {
    this.content =
      this.content.slice(0, position) + text + this.content.slice(position);
  }

  delete(position: number, length: number): string {
    const deleted = this.content.slice(position, position + length);
    this.content =
      this.content.slice(0, position) + this.content.slice(position + length);
    return deleted;
  }

  toString(): string {
    return this.content;
  }
}

// Concrete commands
class InsertCommand implements Command {
  constructor(
    private doc: TextDocument,
    private text: string,
    private position: number,
  ) {}

  execute(): void {
    this.doc.insert(this.text, this.position);
  }

  undo(): void {
    this.doc.delete(this.position, this.text.length);
  }
}

class DeleteCommand implements Command {
  private deleted = "";

  constructor(
    private doc: TextDocument,
    private position: number,
    private length: number,
  ) {}

  execute(): void {
    this.deleted = this.doc.delete(this.position, this.length);
  }

  undo(): void {
    this.doc.insert(this.deleted, this.position);
  }
}

// Invoker
class Editor {
  private history: Command[] = [];

  execute(cmd: Command): void {
    cmd.execute();
    this.history.push(cmd);
  }

  undo(): void {
    const cmd = this.history.pop();
    if (cmd) {
      cmd.undo();
    }
  }
}

// Usage
const doc = new TextDocument();
const editor = new Editor();

editor.execute(new InsertCommand(doc, "Hello", 0));
console.log(String(doc)); // "Hello"

editor.execute(new InsertCommand(doc, " World", 5));
console.log(String(doc)); // "Hello World"

editor.undo();
console.log(String(doc)); // "Hello"`,
    },
    {
      language: "python",
      filename: "command.py",
      description:
        "A text editor with undo support. InsertCommand and DeleteCommand operate on a TextDocument receiver, while the Editor invoker maintains a history stack.",
      code: `from abc import ABC, abstractmethod


class Command(ABC):
    """Abstract command with execute and undo."""

    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...


# Receiver
class TextDocument:
    def __init__(self) -> None:
        self._content = ""

    def insert(self, text: str, position: int) -> None:
        self._content = (
            self._content[:position] + text + self._content[position:]
        )

    def delete(self, position: int, length: int) -> str:
        deleted = self._content[position : position + length]
        self._content = (
            self._content[:position] + self._content[position + length :]
        )
        return deleted

    def __str__(self) -> str:
        return self._content


# Concrete commands
class InsertCommand(Command):
    def __init__(self, doc: TextDocument, text: str, position: int) -> None:
        self._doc = doc
        self._text = text
        self._position = position

    def execute(self) -> None:
        self._doc.insert(self._text, self._position)

    def undo(self) -> None:
        self._doc.delete(self._position, len(self._text))


class DeleteCommand(Command):
    def __init__(self, doc: TextDocument, position: int, length: int) -> None:
        self._doc = doc
        self._position = position
        self._length = length
        self._deleted = ""

    def execute(self) -> None:
        self._deleted = self._doc.delete(self._position, self._length)

    def undo(self) -> None:
        self._doc.insert(self._deleted, self._position)


# Invoker
class Editor:
    def __init__(self) -> None:
        self._history: list[Command] = []

    def execute(self, cmd: Command) -> None:
        cmd.execute()
        self._history.append(cmd)

    def undo(self) -> None:
        if self._history:
            self._history.pop().undo()


# Usage
doc = TextDocument()
editor = Editor()

editor.execute(InsertCommand(doc, "Hello", 0))
print(doc)  # Hello

editor.execute(InsertCommand(doc, " World", 5))
print(doc)  # Hello World

editor.undo()
print(doc)  # Hello`,
    },
    {
      language: "php",
      filename: "Command.php",
      description:
        "A text editor with undo support. InsertCommand and DeleteCommand operate on a TextDocument receiver, while the Editor invoker maintains a history stack.",
      code: `<?php

// Command interface
interface Command
{
    public function execute(): void;
    public function undo(): void;
}

// Receiver
class TextDocument
{
    private string \$content = '';

    public function insert(string \$text, int \$position): void
    {
        \$this->content =
            substr(\$this->content, 0, \$position)
            . \$text
            . substr(\$this->content, \$position);
    }

    public function delete(int \$position, int \$length): string
    {
        \$deleted = substr(\$this->content, \$position, \$length);
        \$this->content =
            substr(\$this->content, 0, \$position)
            . substr(\$this->content, \$position + \$length);
        return \$deleted;
    }

    public function __toString(): string
    {
        return \$this->content;
    }
}

// Concrete commands
class InsertCommand implements Command
{
    public function __construct(
        private TextDocument \$doc,
        private string \$text,
        private int \$position,
    ) {}

    public function execute(): void
    {
        \$this->doc->insert(\$this->text, \$this->position);
    }

    public function undo(): void
    {
        \$this->doc->delete(\$this->position, strlen(\$this->text));
    }
}

class DeleteCommand implements Command
{
    private string \$deleted = '';

    public function __construct(
        private TextDocument \$doc,
        private int \$position,
        private int \$length,
    ) {}

    public function execute(): void
    {
        \$this->deleted = \$this->doc->delete(\$this->position, \$this->length);
    }

    public function undo(): void
    {
        \$this->doc->insert(\$this->deleted, \$this->position);
    }
}

// Invoker
class Editor
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
\$doc = new TextDocument();
\$editor = new Editor();

\$editor->execute(new InsertCommand(\$doc, 'Hello', 0));
echo \$doc . "\\n"; // Hello

\$editor->execute(new InsertCommand(\$doc, ' World', 5));
echo \$doc . "\\n"; // Hello World

\$editor->undo();
echo \$doc . "\\n"; // Hello`,
    },
    {
      language: "rust",
      filename: "command.rs",
      description:
        "A text editor with undo support. InsertCommand and DeleteCommand operate on a TextDocument receiver, while the Editor invoker maintains a history stack.",
      code: `/// Command trait with execute and undo.
trait Command {
    fn execute(&mut self, doc: &mut TextDocument);
    fn undo(&mut self, doc: &mut TextDocument);
}

/// Receiver — holds the text content.
struct TextDocument {
    content: String,
}

impl TextDocument {
    fn new() -> Self {
        Self { content: String::new() }
    }

    fn insert(&mut self, text: &str, position: usize) {
        self.content.insert_str(position, text);
    }

    fn delete(&mut self, position: usize, length: usize) -> String {
        let deleted: String = self.content[position..position + length]
            .to_string();
        self.content.replace_range(position..position + length, "");
        deleted
    }
}

impl std::fmt::Display for TextDocument {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.content)
    }
}

// Concrete commands

struct InsertCommand {
    text: String,
    position: usize,
}

impl InsertCommand {
    fn new(text: &str, position: usize) -> Self {
        Self { text: text.to_string(), position }
    }
}

impl Command for InsertCommand {
    fn execute(&mut self, doc: &mut TextDocument) {
        doc.insert(&self.text, self.position);
    }

    fn undo(&mut self, doc: &mut TextDocument) {
        doc.delete(self.position, self.text.len());
    }
}

struct DeleteCommand {
    position: usize,
    length: usize,
    deleted: String,
}

impl DeleteCommand {
    fn new(position: usize, length: usize) -> Self {
        Self { position, length, deleted: String::new() }
    }
}

impl Command for DeleteCommand {
    fn execute(&mut self, doc: &mut TextDocument) {
        self.deleted = doc.delete(self.position, self.length);
    }

    fn undo(&mut self, doc: &mut TextDocument) {
        doc.insert(&self.deleted, self.position);
    }
}

/// Invoker — stores command history for undo.
struct Editor {
    history: Vec<Box<dyn Command>>,
}

impl Editor {
    fn new() -> Self {
        Self { history: Vec::new() }
    }

    fn execute(&mut self, mut cmd: Box<dyn Command>, doc: &mut TextDocument) {
        cmd.execute(doc);
        self.history.push(cmd);
    }

    fn undo(&mut self, doc: &mut TextDocument) {
        if let Some(mut cmd) = self.history.pop() {
            cmd.undo(doc);
        }
    }
}

fn main() {
    let mut doc = TextDocument::new();
    let mut editor = Editor::new();

    editor.execute(Box::new(InsertCommand::new("Hello", 0)), &mut doc);
    println!("{doc}"); // Hello

    editor.execute(Box::new(InsertCommand::new(" World", 5)), &mut doc);
    println!("{doc}"); // Hello World

    editor.undo(&mut doc);
    println!("{doc}"); // Hello
}`,
    },
  ],
  antiPatternNotices: [],
};
