import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const bridge: PatternDefinition = {
  slug: createPatternSlug("bridge"),
  name: "Bridge",
  category: createCategoryId("structural"),
  emoji: "🌉",
  summary:
    "Decouple an abstraction from its implementation so that the two can vary independently.",
  intent:
    "Split a class that has two orthogonal dimensions of variation into separate hierarchies -- an abstraction and an implementation -- connected by a bridge (composition), so that either side can evolve without affecting the other.",
  problem:
    "You have a concept that can vary along two independent axes. For example, shapes and rendering backends, or notifications and delivery channels. Using inheritance alone leads to a combinatorial explosion of subclasses (CircleSvgRenderer, CircleCanvasRenderer, SquareSvgRenderer, ...) and makes adding a new variant on either axis disproportionately expensive.",
  solution:
    "Extract one of the dimensions into a separate interface hierarchy (the implementation). The original hierarchy (the abstraction) holds a reference to an implementation object and delegates the platform-specific work to it. Both hierarchies can be extended independently, and new combinations are formed through composition rather than subclassing.",
  participants: [
    "Abstraction -- defines the high-level control interface; holds a reference to an Implementor",
    "RefinedAbstraction -- extends the Abstraction with richer behavior",
    "Implementor -- declares the interface for implementation-specific operations",
    "ConcreteImplementor -- provides a concrete implementation of the Implementor interface",
  ],
  consequences: {
    advantages: [
      "Avoids the combinatorial explosion of subclasses from two orthogonal dimensions",
      "Abstraction and implementation can be extended independently",
      "Implementation details can be switched or replaced at runtime",
      "Follows the Open/Closed Principle -- new abstractions and implementations do not require modifying existing code",
    ],
    disadvantages: [
      "Increases complexity by adding extra levels of indirection",
      "Requires careful up-front analysis to identify the correct dimensions of variation",
      "Overkill if there is only one implementation or the abstraction never changes",
    ],
  },
  realWorldAnalogy:
    "A universal TV remote (abstraction) works with any brand of television (implementation). The remote defines buttons like power, volume, and channel, while each TV brand implements how those commands are executed internally. You can buy a new remote or a new TV independently -- they communicate through a standard infrared protocol (the bridge).",
  useCases: [
    "Shapes that can be rendered with different graphics backends (SVG, Canvas, OpenGL)",
    "Notifications that can be delivered through different channels (email, SMS, push)",
    "Device remotes that abstract over multiple device types (TV, radio, smart speaker)",
    "Persistence layers where business objects bridge to different storage backends (SQL, NoSQL, file)",
    "Cross-platform UI frameworks where widgets bridge to platform-native rendering",
  ],
  relatedPatterns: [
    createPatternSlug("adapter"),
    createPatternSlug("abstract-factory"),
    createPatternSlug("strategy"),
  ],
  decisionTreeQuestion:
    "Need to vary abstraction and implementation independently?",
  codeExamples: [
    {
      language: "typescript",
      filename: "bridge.ts",
      description:
        "Separates Shape (abstraction) from Renderer (implementation) so new shapes and new rendering backends can be added independently.",
      code: `// Implementor interface
interface Renderer {
  renderCircle(x: number, y: number, radius: number): void;
  renderRect(x: number, y: number, w: number, h: number): void;
}

// ConcreteImplementors
class SvgRenderer implements Renderer {
  renderCircle(x: number, y: number, radius: number): void {
    console.log(\`<circle cx="\${x}" cy="\${y}" r="\${radius}" />\`);
  }
  renderRect(x: number, y: number, w: number, h: number): void {
    console.log(\`<rect x="\${x}" y="\${y}" width="\${w}" height="\${h}" />\`);
  }
}

class CanvasRenderer implements Renderer {
  renderCircle(x: number, y: number, radius: number): void {
    console.log(\`ctx.arc(\${x}, \${y}, \${radius}, 0, 2*PI); ctx.stroke();\`);
  }
  renderRect(x: number, y: number, w: number, h: number): void {
    console.log(\`ctx.strokeRect(\${x}, \${y}, \${w}, \${h});\`);
  }
}

// Abstraction
abstract class Shape {
  constructor(protected readonly renderer: Renderer) {}
  abstract draw(): void;
  abstract resize(factor: number): void;
}

// RefinedAbstractions
class Circle extends Shape {
  constructor(renderer: Renderer, private x: number, private y: number, private radius: number) {
    super(renderer);
  }
  draw(): void { this.renderer.renderCircle(this.x, this.y, this.radius); }
  resize(factor: number): void { this.radius *= factor; }
}

class Rectangle extends Shape {
  constructor(renderer: Renderer, private x: number, private y: number, private w: number, private h: number) {
    super(renderer);
  }
  draw(): void { this.renderer.renderRect(this.x, this.y, this.w, this.h); }
  resize(factor: number): void { this.w *= factor; this.h *= factor; }
}

// Any shape works with any renderer
const shapes: Shape[] = [
  new Circle(new SvgRenderer(), 10, 10, 5),
  new Circle(new CanvasRenderer(), 10, 10, 5),
  new Rectangle(new SvgRenderer(), 0, 0, 100, 50),
];
shapes.forEach((s) => s.draw());`,
    },
    {
      language: "python",
      filename: "bridge.py",
      description:
        "Python bridge separating Shape abstractions from Renderer implementations, connected through composition and using Protocol for the implementor interface.",
      code: `"""Bridge pattern -- Shape x Renderer."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Protocol


# Implementor
class Renderer(Protocol):
    def render_circle(self, x: float, y: float, radius: float) -> None: ...
    def render_rect(self, x: float, y: float, w: float, h: float) -> None: ...


# ConcreteImplementors
class SvgRenderer:
    def render_circle(self, x: float, y: float, radius: float) -> None:
        print(f'<circle cx="{x}" cy="{y}" r="{radius}" />')

    def render_rect(self, x: float, y: float, w: float, h: float) -> None:
        print(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" />')


class CanvasRenderer:
    def render_circle(self, x: float, y: float, radius: float) -> None:
        print(f"ctx.arc({x}, {y}, {radius}, 0, 2*PI); ctx.stroke();")

    def render_rect(self, x: float, y: float, w: float, h: float) -> None:
        print(f"ctx.strokeRect({x}, {y}, {w}, {h});")


# Abstraction
class Shape(ABC):
    def __init__(self, renderer: Renderer) -> None:
        self._renderer = renderer

    @abstractmethod
    def draw(self) -> None: ...

    @abstractmethod
    def resize(self, factor: float) -> None: ...


# RefinedAbstractions
class Circle(Shape):
    def __init__(self, renderer: Renderer, x: float, y: float, radius: float) -> None:
        super().__init__(renderer)
        self.x, self.y, self.radius = x, y, radius

    def draw(self) -> None:
        self._renderer.render_circle(self.x, self.y, self.radius)

    def resize(self, factor: float) -> None:
        self.radius *= factor


class Rectangle(Shape):
    def __init__(self, renderer: Renderer, x: float, y: float, w: float, h: float) -> None:
        super().__init__(renderer)
        self.x, self.y, self.w, self.h = x, y, w, h

    def draw(self) -> None:
        self._renderer.render_rect(self.x, self.y, self.w, self.h)

    def resize(self, factor: float) -> None:
        self.w *= factor
        self.h *= factor


# Any shape + any renderer
shapes: list[Shape] = [
    Circle(SvgRenderer(), 10, 10, 5),
    Circle(CanvasRenderer(), 10, 10, 5),
    Rectangle(SvgRenderer(), 0, 0, 100, 50),
]
for shape in shapes:
    shape.draw()`,
    },
    {
      language: "php",
      filename: "Bridge.php",
      description:
        "PHP bridge separating a Shape abstract class from a Renderer interface, allowing shapes and renderers to be extended independently.",
      code: `<?php

// Implementor interface
interface Renderer
{
    public function renderCircle(float $x, float $y, float $radius): void;
    public function renderRect(float $x, float $y, float $w, float $h): void;
}

// ConcreteImplementors
class SvgRenderer implements Renderer
{
    public function renderCircle(float $x, float $y, float $radius): void
    {
        echo "<circle cx=\\"{$x}\\" cy=\\"{$y}\\" r=\\"{$radius}\\" />\\n";
    }
    public function renderRect(float $x, float $y, float $w, float $h): void
    {
        echo "<rect x=\\"{$x}\\" y=\\"{$y}\\" width=\\"{$w}\\" height=\\"{$h}\\" />\\n";
    }
}

class CanvasRenderer implements Renderer
{
    public function renderCircle(float $x, float $y, float $radius): void
    {
        echo "ctx.arc({$x}, {$y}, {$radius}, 0, 2*PI); ctx.stroke();\\n";
    }
    public function renderRect(float $x, float $y, float $w, float $h): void
    {
        echo "ctx.strokeRect({$x}, {$y}, {$w}, {$h});\\n";
    }
}

// Abstraction
abstract class Shape
{
    public function __construct(protected readonly Renderer $renderer) {}
    abstract public function draw(): void;
    abstract public function resize(float $factor): void;
}

// RefinedAbstractions
class Circle extends Shape
{
    public function __construct(Renderer $renderer, private float $x, private float $y, private float $radius)
    {
        parent::__construct($renderer);
    }
    public function draw(): void { $this->renderer->renderCircle($this->x, $this->y, $this->radius); }
    public function resize(float $factor): void { $this->radius *= $factor; }
}

class RectangleShape extends Shape
{
    public function __construct(Renderer $renderer, private float $x, private float $y, private float $w, private float $h)
    {
        parent::__construct($renderer);
    }
    public function draw(): void { $this->renderer->renderRect($this->x, $this->y, $this->w, $this->h); }
    public function resize(float $factor): void { $this->w *= $factor; $this->h *= $factor; }
}

// Any shape + any renderer
$shapes = [
    new Circle(new SvgRenderer(), 10, 10, 5),
    new Circle(new CanvasRenderer(), 10, 10, 5),
    new RectangleShape(new SvgRenderer(), 0, 0, 100, 50),
];
foreach ($shapes as $shape) {
    $shape->draw();
}`,
    },
    {
      language: "rust",
      filename: "bridge.rs",
      description:
        "Idiomatic Rust bridge using a generic struct parameterized by a Renderer trait, avoiding trait objects when the implementation is known at compile time.",
      code: `// Implementor trait
trait Renderer {
    fn render_circle(&self, x: f64, y: f64, radius: f64);
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64);
}

// ConcreteImplementors
struct SvgRenderer;
impl Renderer for SvgRenderer {
    fn render_circle(&self, x: f64, y: f64, radius: f64) {
        println!(r#"<circle cx="{x}" cy="{y}" r="{radius}" />"#);
    }
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64) {
        println!(r#"<rect x="{x}" y="{y}" width="{w}" height="{h}" />"#);
    }
}

struct CanvasRenderer;
impl Renderer for CanvasRenderer {
    fn render_circle(&self, x: f64, y: f64, radius: f64) {
        println!("ctx.arc({x}, {y}, {radius}, 0, 2*PI); ctx.stroke();");
    }
    fn render_rect(&self, x: f64, y: f64, w: f64, h: f64) {
        println!("ctx.strokeRect({x}, {y}, {w}, {h});");
    }
}

// Abstraction -- generic over the Renderer
struct Circle<R: Renderer> {
    renderer: R,
    x: f64,
    y: f64,
    radius: f64,
}

impl<R: Renderer> Circle<R> {
    fn draw(&self) {
        self.renderer.render_circle(self.x, self.y, self.radius);
    }
    fn resize(&mut self, factor: f64) {
        self.radius *= factor;
    }
}

struct Rect<R: Renderer> {
    renderer: R,
    x: f64,
    y: f64,
    w: f64,
    h: f64,
}

impl<R: Renderer> Rect<R> {
    fn draw(&self) {
        self.renderer.render_rect(self.x, self.y, self.w, self.h);
    }
    fn resize(&mut self, factor: f64) {
        self.w *= factor;
        self.h *= factor;
    }
}

fn main() {
    // Same shapes, different renderers -- no combinatorial subclassing
    let svg_circle = Circle { renderer: SvgRenderer, x: 10.0, y: 10.0, radius: 5.0 };
    let canvas_circle = Circle { renderer: CanvasRenderer, x: 10.0, y: 10.0, radius: 5.0 };
    let svg_rect = Rect { renderer: SvgRenderer, x: 0.0, y: 0.0, w: 100.0, h: 50.0 };

    svg_circle.draw();
    canvas_circle.draw();
    svg_rect.draw();
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust generics monomorphize at compile time, giving zero-cost abstraction but preventing heterogeneous collections of shapes with different renderers. Use Box<dyn Renderer> if you need to store mixed renderer types at the cost of dynamic dispatch.",
      alternatives:
        "For runtime flexibility, accept Box<dyn Renderer> instead of a generic parameter. For static dispatch, the generic approach shown here is preferred.",
    },
  ],
};
