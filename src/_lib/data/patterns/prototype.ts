import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const prototype: PatternDefinition = {
  slug: createPatternSlug("prototype"),
  name: "Prototype",
  category: createCategoryId("creational"),
  emoji: "🧬",
  summary:
    "Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.",
  intent:
    "Create new objects by cloning an existing instance (the prototype) rather than constructing from scratch, allowing you to duplicate complex objects without coupling your code to their concrete classes.",
  problem:
    "You need to create an exact copy of an object, but the object may have private fields or complex internal state that is not accessible from outside. Calling 'new' and manually copying every field is brittle, tightly coupled to the concrete class, and breaks when the class changes. Some objects are expensive to set up from scratch when a pre-configured template already exists.",
  solution:
    "Declare a common interface (or use a language trait) with a clone method. Each concrete class implements clone by creating a new instance of itself and copying its internal state — including private fields. Clients ask the prototype to clone itself rather than instantiating a new object directly.",
  participants: [
    "Prototype — declares the clone interface",
    "ConcretePrototype — implements the clone operation by copying its own internal state into a new instance",
    "Client — creates a new object by asking the prototype to clone itself",
  ],
  consequences: {
    advantages: [
      "Clones objects without coupling to their concrete classes — the client only knows the prototype interface",
      "Eliminates repeated initialization code when preconfigured templates are available",
      "Produces complex objects more conveniently than building them from scratch",
      "Provides an alternative to subclassing for varying the type of objects a factory creates",
    ],
    disadvantages: [
      "Cloning complex objects with circular references or deep dependency graphs can be tricky",
      "Deep copy vs. shallow copy semantics must be decided and documented carefully",
      "Languages without a built-in clone mechanism require significant boilerplate",
    ],
  },
  realWorldAnalogy:
    "Cell division (mitosis) is nature's prototype pattern. Rather than assembling a new cell from individual molecules, an existing cell duplicates its entire internal state — DNA, organelles, membranes — and splits into two independent copies. Each copy can then mutate independently without affecting the original.",
  useCases: [
    "Duplicating graphical shapes in a drawing editor while preserving position, color, and layer",
    "Creating document templates that users can clone and customize",
    "Game development: spawning enemies from a preconfigured prototype rather than re-reading config files",
    "Caching expensive-to-create objects and cloning them on demand",
    "Undo/redo systems that snapshot and restore object state via cloning",
  ],
  relatedPatterns: [
    createPatternSlug("builder"),
    createPatternSlug("factory-method"),
    createPatternSlug("abstract-factory"),
  ],
  decisionTreeQuestion: "Need to clone an existing object?",
  codeExamples: [
    {
      language: "typescript",
      filename: "prototype.ts",
      description:
        "Cloneable Shape hierarchy using structuredClone for deep copying. Each shape implements a clone method that returns a fully independent copy, allowing modifications without affecting the original.",
      code: `interface Cloneable<T> {
  clone(): T;
}

class Shape implements Cloneable<Shape> {
  constructor(
    public x: number,
    public y: number,
    public color: string,
  ) {}

  clone(): Shape {
    // structuredClone handles deep copies of plain data
    return Object.assign(Object.create(Object.getPrototypeOf(this)), structuredClone(this));
  }
}

class Circle extends Shape {
  constructor(
    x: number,
    y: number,
    color: string,
    public radius: number,
  ) {
    super(x, y, color);
  }
}

class Rectangle extends Shape {
  constructor(
    x: number,
    y: number,
    color: string,
    public width: number,
    public height: number,
  ) {
    super(x, y, color);
  }
}

// Usage — clone and modify independently
const original = new Circle(10, 20, "red", 50);
const copy = original.clone() as Circle;

copy.x = 100;
copy.color = "blue";

console.log(original.x, original.color); // 10 red  (unchanged)
console.log(copy.x, copy.color);         // 100 blue
console.log(copy instanceof Circle);      // true`,
    },
    {
      language: "python",
      filename: "prototype.py",
      description:
        "Prototype pattern using copy.deepcopy for full deep cloning. A base Shape class provides the clone method, and concrete shapes inherit it without extra boilerplate.",
      code: `from __future__ import annotations

import copy
from abc import ABC, abstractmethod


class Shape(ABC):
    def __init__(self, x: int, y: int, color: str) -> None:
        self.x = x
        self.y = y
        self.color = color

    def clone(self) -> Shape:
        """Create a deep copy of this shape, preserving its concrete type."""
        return copy.deepcopy(self)

    @abstractmethod
    def area(self) -> float: ...


class Circle(Shape):
    def __init__(self, x: int, y: int, color: str, radius: float) -> None:
        super().__init__(x, y, color)
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2


class Rectangle(Shape):
    def __init__(self, x: int, y: int, color: str, width: float, height: float) -> None:
        super().__init__(x, y, color)
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height


# Usage — clone and modify independently
original = Circle(10, 20, "red", 50)
cloned = original.clone()

assert isinstance(cloned, Circle)
cloned.x = 100
cloned.color = "blue"

print(original.x, original.color)  # 10 red  (unchanged)
print(cloned.x, cloned.color)      # 100 blue`,
    },
    {
      language: "php",
      filename: "Prototype.php",
      description:
        "PHP Prototype using the built-in __clone magic method. PHP's clone keyword creates a shallow copy and then calls __clone on the new object, giving you a hook to deep-copy any reference-type fields.",
      code: `<?php

declare(strict_types=1);

abstract class Shape
{
    public function __construct(
        public int    $x,
        public int    $y,
        public string $color,
    ) {}

    /**
     * __clone is called after PHP creates a shallow copy.
     * Override in subclasses to deep-copy reference-type fields.
     */
    public function __clone(): void
    {
        // Base fields are value types — no extra work needed here.
    }

    abstract public function area(): float;
}

class Circle extends Shape
{
    public function __construct(
        int    $x,
        int    $y,
        string $color,
        public float $radius,
    ) {
        parent::__construct($x, $y, $color);
    }

    public function area(): float
    {
        return M_PI * $this->radius ** 2;
    }
}

class Rectangle extends Shape
{
    public function __construct(
        int    $x,
        int    $y,
        string $color,
        public float $width,
        public float $height,
    ) {
        parent::__construct($x, $y, $color);
    }

    public function area(): float
    {
        return $this->width * $this->height;
    }
}

// Usage — clone keyword triggers __clone
$original = new Circle(10, 20, 'red', 50);
$copy = clone $original;

$copy->x = 100;
$copy->color = 'blue';

echo "{$original->x} {$original->color}\\n"; // 10 red  (unchanged)
echo "{$copy->x} {$copy->color}\\n";          // 100 blue
var_dump($copy instanceof Circle);             // true`,
    },
    {
      language: "rust",
      filename: "prototype.rs",
      description:
        "Prototype via Rust's derive Clone trait — the idiomatic way to create deep copies. #[derive(Clone)] auto-generates a clone() method that recursively clones every field.",
      code: `/// The Clone trait is Rust's built-in prototype mechanism.
/// #[derive(Clone)] generates a field-by-field clone implementation.

#[derive(Clone, Debug)]
struct Circle {
    x: i32,
    y: i32,
    color: String,
    radius: f64,
}

impl Circle {
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
}

#[derive(Clone, Debug)]
struct Rectangle {
    x: i32,
    y: i32,
    color: String,
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

fn main() {
    let original = Circle {
        x: 10,
        y: 20,
        color: "red".into(),
        radius: 50.0,
    };

    // .clone() produces an independent deep copy
    let mut copy = original.clone();
    copy.x = 100;
    copy.color = "blue".into();

    println!("{} {}", original.x, original.color); // 10 red  (unchanged)
    println!("{} {}", copy.x, copy.color);          // 100 blue
    println!("Area: {:.2}", copy.area());            // Area: 7853.98
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "The Clone trait is Rust's first-class, idiomatic implementation of the Prototype pattern. It is not an anti-pattern — it is the standard approach. However, be mindful that Clone on types containing Arc, Rc, or raw pointers may produce shallow reference copies rather than true deep clones.",
      alternatives:
        "For types that must not be cloned (e.g., file handles, sockets), omit the Clone derive. Use explicit constructor functions instead when full reconstruction is preferable to cloning.",
    },
  ],
};
