import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const abstractFactory: PatternDefinition = {
  slug: createPatternSlug("abstract-factory"),
  name: "Abstract Factory",
  category: createCategoryId("creational"),
  emoji: "🏭",
  summary:
    "Provide an interface for creating families of related or dependent objects without specifying their concrete classes.",
  intent:
    "Define an abstract interface for creating a suite of related products (a 'family') so that client code can work with any family interchangeably. The concrete factory determines which specific product variants are instantiated.",
  problem:
    "Your code needs to create sets of related objects — for example, UI controls that must all belong to the same visual theme, or data-access objects that must all target the same database engine. If you instantiate concrete classes directly, switching to a different family requires changes scattered across many files, and mixing products from different families introduces subtle bugs.",
  solution:
    "Declare abstract interfaces for each distinct product in the family, then declare an Abstract Factory interface with a creation method for each product. For every family variant, implement a concrete factory that returns products from that specific family. Client code works exclusively through the abstract interfaces, so swapping the entire family is a single-line change at the composition root.",
  participants: [
    "AbstractFactory — declares creation methods for each abstract product in the family",
    "ConcreteFactory — implements the creation methods to produce products of a specific variant/family",
    "AbstractProduct — declares an interface for a type of product (e.g., Button, Checkbox)",
    "ConcreteProduct — implements the abstract product interface for a specific variant (e.g., DarkButton, LightCheckbox)",
    "Client — uses only the abstract factory and abstract product interfaces",
  ],
  consequences: {
    advantages: [
      "Guarantees that products from the same family are used together, preventing incompatible mixes",
      "Isolates concrete product classes from client code (Dependency Inversion Principle)",
      "Swapping an entire product family requires changing only the concrete factory (Open/Closed Principle)",
      "Promotes consistency among products created by the same factory",
    ],
    disadvantages: [
      "Adding a new product to the family requires changing every factory interface and all concrete implementations",
      "Introduces many interfaces and classes, which can feel over-engineered for small families",
      "Can obscure the code path — readers must trace through several layers of abstraction to see which product is actually created",
    ],
  },
  realWorldAnalogy:
    "A furniture showroom is like an abstract factory. You choose a style — modern, Victorian, or Art Deco — and the showroom provides a matching set of chair, sofa, and coffee table in that style. You never mix a Victorian chair with a modern sofa because each showroom section (concrete factory) only produces items from its own style family.",
  useCases: [
    "UI toolkit that supports multiple themes (light/dark) or platform targets (Windows/macOS/Linux)",
    "Database access layer that targets multiple engines (PostgreSQL, MySQL, SQLite) with compatible connection, command, and reader objects",
    "Cross-platform document rendering that produces consistent PDF, HTML, or DOCX output families",
    "Game asset loading that provides compatible sprite, sound, and animation sets per level theme",
    "Cloud infrastructure abstraction that groups compatible compute, storage, and network resources per provider",
  ],
  relatedPatterns: [
    createPatternSlug("factory-method"),
    createPatternSlug("builder"),
    createPatternSlug("singleton"),
    createPatternSlug("prototype"),
  ],
  decisionTreeQuestion:
    "Creating families of related objects that must be consistent?",
  codeExamples: [
    {
      language: "typescript",
      filename: "abstract-factory.ts",
      description:
        "UI theme factory that produces consistent Button and Checkbox widgets for light and dark themes. Client code depends only on the abstract interfaces and can switch theme families at the composition root.",
      code: `// --- Abstract products ---
interface Button {
  render(): string;
}

interface Checkbox {
  render(): string;
  toggle(): void;
}

// --- Abstract factory ---
interface UIFactory {
  createButton(label: string): Button;
  createCheckbox(label: string): Checkbox;
}

// --- Dark family ---
class DarkButton implements Button {
  constructor(private label: string) {}
  render() { return \`[Dark Button: \${this.label}]\`; }
}

class DarkCheckbox implements Checkbox {
  private checked = false;
  constructor(private label: string) {}
  render() { return \`[Dark Checkbox: \${this.label} \${this.checked ? "☑" : "☐"}]\`; }
  toggle() { this.checked = !this.checked; }
}

class DarkThemeFactory implements UIFactory {
  createButton(label: string) { return new DarkButton(label); }
  createCheckbox(label: string) { return new DarkCheckbox(label); }
}

// --- Light family ---
class LightButton implements Button {
  constructor(private label: string) {}
  render() { return \`(Light Button: \${this.label})\`; }
}

class LightCheckbox implements Checkbox {
  private checked = false;
  constructor(private label: string) {}
  render() { return \`(Light Checkbox: \${this.label} \${this.checked ? "☑" : "☐"})\`; }
  toggle() { this.checked = !this.checked; }
}

class LightThemeFactory implements UIFactory {
  createButton(label: string) { return new LightButton(label); }
  createCheckbox(label: string) { return new LightCheckbox(label); }
}

// --- Client code works with abstract interfaces ---
function buildUI(factory: UIFactory) {
  const btn = factory.createButton("Submit");
  const chk = factory.createCheckbox("Remember me");
  chk.toggle();
  console.log(btn.render());  // theme-specific output
  console.log(chk.render());  // theme-specific output
}

// Switch theme by swapping the factory
buildUI(new DarkThemeFactory());
buildUI(new LightThemeFactory());`,
    },
    {
      language: "python",
      filename: "abstract_factory.py",
      description:
        "ABC-based abstract factory for light and dark UI themes. Python's abstract base classes enforce that each concrete factory implements all creation methods.",
      code: `from abc import ABC, abstractmethod


# --- Abstract products ---
class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...


class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: ...

    @abstractmethod
    def toggle(self) -> None: ...


# --- Abstract factory ---
class UIFactory(ABC):
    @abstractmethod
    def create_button(self, label: str) -> Button: ...

    @abstractmethod
    def create_checkbox(self, label: str) -> Checkbox: ...


# --- Dark family ---
class DarkButton(Button):
    def __init__(self, label: str) -> None:
        self.label = label

    def render(self) -> str:
        return f"[Dark Button: {self.label}]"


class DarkCheckbox(Checkbox):
    def __init__(self, label: str) -> None:
        self.label = label
        self._checked = False

    def render(self) -> str:
        mark = "☑" if self._checked else "☐"
        return f"[Dark Checkbox: {self.label} {mark}]"

    def toggle(self) -> None:
        self._checked = not self._checked


class DarkThemeFactory(UIFactory):
    def create_button(self, label: str) -> Button:
        return DarkButton(label)

    def create_checkbox(self, label: str) -> Checkbox:
        return DarkCheckbox(label)


# --- Light family ---
class LightButton(Button):
    def __init__(self, label: str) -> None:
        self.label = label

    def render(self) -> str:
        return f"(Light Button: {self.label})"


class LightCheckbox(Checkbox):
    def __init__(self, label: str) -> None:
        self.label = label
        self._checked = False

    def render(self) -> str:
        mark = "☑" if self._checked else "☐"
        return f"(Light Checkbox: {self.label} {mark})"

    def toggle(self) -> None:
        self._checked = not self._checked


class LightThemeFactory(UIFactory):
    def create_button(self, label: str) -> Button:
        return LightButton(label)

    def create_checkbox(self, label: str) -> Checkbox:
        return LightCheckbox(label)


# --- Client ---
def build_ui(factory: UIFactory) -> None:
    btn = factory.create_button("Submit")
    chk = factory.create_checkbox("Remember me")
    chk.toggle()
    print(btn.render())
    print(chk.render())


build_ui(DarkThemeFactory())
build_ui(LightThemeFactory())`,
    },
    {
      language: "php",
      filename: "AbstractFactory.php",
      description:
        "Interface-based abstract factory for UI themes in PHP. Concrete factories return theme-consistent widgets, and the client depends only on the interfaces.",
      code: `<?php

declare(strict_types=1);

// --- Abstract products ---
interface Button
{
    public function render(): string;
}

interface Checkbox
{
    public function render(): string;
    public function toggle(): void;
}

// --- Abstract factory ---
interface UIFactory
{
    public function createButton(string $label): Button;
    public function createCheckbox(string $label): Checkbox;
}

// --- Dark family ---
class DarkButton implements Button
{
    public function __construct(private readonly string $label) {}

    public function render(): string
    {
        return "[Dark Button: {$this->label}]";
    }
}

class DarkCheckbox implements Checkbox
{
    private bool $checked = false;

    public function __construct(private readonly string $label) {}

    public function render(): string
    {
        $mark = $this->checked ? '☑' : '☐';
        return "[Dark Checkbox: {$this->label} {$mark}]";
    }

    public function toggle(): void
    {
        $this->checked = !$this->checked;
    }
}

class DarkThemeFactory implements UIFactory
{
    public function createButton(string $label): Button   { return new DarkButton($label); }
    public function createCheckbox(string $label): Checkbox { return new DarkCheckbox($label); }
}

// --- Light family ---
class LightButton implements Button
{
    public function __construct(private readonly string $label) {}

    public function render(): string
    {
        return "(Light Button: {$this->label})";
    }
}

class LightCheckbox implements Checkbox
{
    private bool $checked = false;

    public function __construct(private readonly string $label) {}

    public function render(): string
    {
        $mark = $this->checked ? '☑' : '☐';
        return "(Light Checkbox: {$this->label} {$mark})";
    }

    public function toggle(): void
    {
        $this->checked = !$this->checked;
    }
}

class LightThemeFactory implements UIFactory
{
    public function createButton(string $label): Button   { return new LightButton($label); }
    public function createCheckbox(string $label): Checkbox { return new LightCheckbox($label); }
}

// --- Client ---
function buildUI(UIFactory $factory): void
{
    $btn = $factory->createButton('Submit');
    $chk = $factory->createCheckbox('Remember me');
    $chk->toggle();
    echo $btn->render() . "\\n";
    echo $chk->render() . "\\n";
}

buildUI(new DarkThemeFactory());
buildUI(new LightThemeFactory());`,
    },
    {
      language: "rust",
      filename: "abstract_factory.rs",
      description:
        "Trait-based abstract factory using Rust's trait objects for runtime polymorphism. Each concrete factory returns boxed trait objects, allowing the client to work with any theme family interchangeably.",
      code: `// --- Abstract products ---
trait Button {
    fn render(&self) -> String;
}

trait Checkbox {
    fn render(&self) -> String;
    fn toggle(&mut self);
}

// --- Abstract factory ---
trait UIFactory {
    fn create_button(&self, label: &str) -> Box<dyn Button>;
    fn create_checkbox(&self, label: &str) -> Box<dyn Checkbox>;
}

// --- Dark family ---
struct DarkButton { label: String }
impl Button for DarkButton {
    fn render(&self) -> String { format!("[Dark Button: {}]", self.label) }
}

struct DarkCheckbox { label: String, checked: bool }
impl Checkbox for DarkCheckbox {
    fn render(&self) -> String {
        let mark = if self.checked { "☑" } else { "☐" };
        format!("[Dark Checkbox: {} {}]", self.label, mark)
    }
    fn toggle(&mut self) { self.checked = !self.checked; }
}

struct DarkThemeFactory;
impl UIFactory for DarkThemeFactory {
    fn create_button(&self, label: &str) -> Box<dyn Button> {
        Box::new(DarkButton { label: label.into() })
    }
    fn create_checkbox(&self, label: &str) -> Box<dyn Checkbox> {
        Box::new(DarkCheckbox { label: label.into(), checked: false })
    }
}

// --- Light family ---
struct LightButton { label: String }
impl Button for LightButton {
    fn render(&self) -> String { format!("(Light Button: {})", self.label) }
}

struct LightCheckbox { label: String, checked: bool }
impl Checkbox for LightCheckbox {
    fn render(&self) -> String {
        let mark = if self.checked { "☑" } else { "☐" };
        format!("(Light Checkbox: {} {})", self.label, mark)
    }
    fn toggle(&mut self) { self.checked = !self.checked; }
}

struct LightThemeFactory;
impl UIFactory for LightThemeFactory {
    fn create_button(&self, label: &str) -> Box<dyn Button> {
        Box::new(LightButton { label: label.into() })
    }
    fn create_checkbox(&self, label: &str) -> Box<dyn Checkbox> {
        Box::new(LightCheckbox { label: label.into(), checked: false })
    }
}

// --- Client ---
fn build_ui(factory: &dyn UIFactory) {
    let btn = factory.create_button("Submit");
    let mut chk = factory.create_checkbox("Remember me");
    chk.toggle();
    println!("{}", btn.render());
    println!("{}", chk.render());
}

fn main() {
    build_ui(&DarkThemeFactory);
    build_ui(&LightThemeFactory);
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "php",
      reason:
        "In PHP's ecosystem, where duck typing and dependency injection containers are prevalent, a full Abstract Factory hierarchy can be unnecessarily ceremonious. Many PHP frameworks achieve the same decoupling through service container bindings and auto-wiring, making explicit factory interfaces less common in practice.",
      alternatives:
        "Use a dependency injection container (e.g., Laravel's service container or Symfony DI) to bind interfaces to concrete implementations. Alternatively, use a simple factory function or a registry pattern when the family of products is small.",
    },
  ],
};
