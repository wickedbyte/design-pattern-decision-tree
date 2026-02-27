import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const composite: PatternDefinition = {
  slug: createPatternSlug("composite"),
  name: "Composite",
  category: createCategoryId("structural"),
  emoji: "🌳",
  summary:
    "Compose objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.",
  intent:
    "Let clients work with complex tree structures by treating both leaf nodes and branches through the same interface, so that adding, removing, or operating on elements does not require the client to distinguish between simple and compound objects.",
  problem:
    "Your domain has a natural part-whole hierarchy -- files and directories, departments and employees, or UI containers and widgets. Client code that traverses or operates on this structure is littered with type checks and conditional logic to distinguish between leaf nodes and composite containers, making it fragile and difficult to extend with new node types.",
  solution:
    "Define a Component interface that declares operations common to both leaf and composite objects. Leaf nodes implement the operations directly. Composite nodes store child components and implement operations by delegating to each child. Because both conform to the same interface, clients traverse and manipulate the entire tree uniformly.",
  participants: [
    "Component -- declares the shared interface for leaf and composite objects",
    "Leaf -- represents end objects that have no children",
    "Composite -- stores child Components and implements operations by iterating over children",
    "Client -- manipulates objects through the Component interface",
  ],
  consequences: {
    advantages: [
      "Clients treat leaf and composite objects uniformly, reducing conditional logic",
      "Easy to add new kinds of components -- they just implement the Component interface",
      "Recursive structures are naturally modeled and traversed",
      "Simplifies client code by eliminating the need to distinguish between node types",
    ],
    disadvantages: [
      "Making the design too general can make it hard to restrict the types of children a composite accepts",
      "Type safety is weaker -- the shared interface may include operations meaningless for leaves (e.g., addChild)",
      "Can make designs overly abstract if the hierarchy is simple",
      "Ordering or limiting children often requires extra bookkeeping",
    ],
  },
  realWorldAnalogy:
    "An organizational chart is a composite structure. A department (composite) contains teams, which contain individual employees (leaves). When the CEO asks for total headcount, the request propagates down the tree: each department sums its teams, each team sums its members, and the results bubble up. The CEO does not care whether a node is a person or a department -- the count operation works uniformly.",
  useCases: [
    "File system: files (leaves) and directories (composites) sharing a common FileSystemNode interface",
    "UI component trees: containers that hold buttons, text fields, and other containers",
    "Organization charts: employees and departments with a common getHeadcount() or getCost() method",
    "Menu systems: menu items and sub-menus rendered through the same interface",
    "Arithmetic expression trees: numbers (leaves) and operations (composites) with a common evaluate() method",
  ],
  relatedPatterns: [
    createPatternSlug("decorator"),
    createPatternSlug("chain-of-responsibility"),
    createPatternSlug("command"),
  ],
  decisionTreeQuestion: "Working with tree / part-whole hierarchies?",
  codeExamples: [
    {
      language: "typescript",
      filename: "composite.ts",
      description:
        "A file-system tree with a common FileSystemNode interface, where File is a leaf and Directory is a composite that recursively computes total size.",
      code: `// Component interface
interface FileSystemNode {
  name: string;
  getSize(): number;
  print(indent?: string): void;
}

// Leaf
class File implements FileSystemNode {
  constructor(
    public readonly name: string,
    private readonly size: number,
  ) {}

  getSize(): number {
    return this.size;
  }

  print(indent = ""): void {
    console.log(\`\${indent}\${this.name} (\${this.size} bytes)\`);
  }
}

// Composite
class Directory implements FileSystemNode {
  private children: FileSystemNode[] = [];

  constructor(public readonly name: string) {}

  add(child: FileSystemNode): this {
    this.children.push(child);
    return this;
  }

  remove(child: FileSystemNode): void {
    this.children = this.children.filter((c) => c !== child);
  }

  getSize(): number {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  print(indent = ""): void {
    console.log(\`\${indent}\${this.name}/\`);
    for (const child of this.children) {
      child.print(indent + "  ");
    }
  }
}

// Build and use the tree uniformly
const root = new Directory("project");
const src = new Directory("src");
src.add(new File("index.ts", 1200));
src.add(new File("utils.ts", 800));

const docs = new Directory("docs");
docs.add(new File("README.md", 500));

root.add(src);
root.add(docs);
root.add(new File("package.json", 300));

root.print();
console.log(\`Total size: \${root.getSize()} bytes\`);`,
    },
    {
      language: "python",
      filename: "composite.py",
      description:
        "A Python ABC-based file system tree where File and Directory share a common interface, using recursive traversal to compute size and print the tree.",
      code: `"""Composite pattern -- file-system tree."""

from __future__ import annotations

from abc import ABC, abstractmethod


# Component
class FileSystemNode(ABC):
    def __init__(self, name: str) -> None:
        self.name = name

    @abstractmethod
    def get_size(self) -> int: ...

    @abstractmethod
    def print_tree(self, indent: str = "") -> None: ...


# Leaf
class File(FileSystemNode):
    def __init__(self, name: str, size: int) -> None:
        super().__init__(name)
        self._size = size

    def get_size(self) -> int:
        return self._size

    def print_tree(self, indent: str = "") -> None:
        print(f"{indent}{self.name} ({self._size} bytes)")


# Composite
class Directory(FileSystemNode):
    def __init__(self, name: str) -> None:
        super().__init__(name)
        self._children: list[FileSystemNode] = []

    def add(self, child: FileSystemNode) -> "Directory":
        self._children.append(child)
        return self

    def remove(self, child: FileSystemNode) -> None:
        self._children.remove(child)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self._children)

    def print_tree(self, indent: str = "") -> None:
        print(f"{indent}{self.name}/")
        for child in self._children:
            child.print_tree(indent + "  ")


# Build the tree
root = Directory("project")
src = Directory("src")
src.add(File("index.ts", 1200))
src.add(File("utils.ts", 800))

docs = Directory("docs")
docs.add(File("README.md", 500))

root.add(src)
root.add(docs)
root.add(File("package.json", 300))

root.print_tree()
print(f"Total size: {root.get_size()} bytes")`,
    },
    {
      language: "php",
      filename: "Composite.php",
      description:
        "PHP implementation with an abstract FileSystemNode base class, File leaf, and Directory composite that recursively delegates getSize() and print().",
      code: `<?php

// Component
abstract class FileSystemNode
{
    public function __construct(public readonly string $name) {}

    abstract public function getSize(): int;
    abstract public function printTree(string $indent = ''): void;
}

// Leaf
class File extends FileSystemNode
{
    public function __construct(
        string $name,
        private readonly int $size,
    ) {
        parent::__construct($name);
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function printTree(string $indent = ''): void
    {
        echo "{$indent}{$this->name} ({$this->size} bytes)\\n";
    }
}

// Composite
class Directory extends FileSystemNode
{
    /** @var FileSystemNode[] */
    private array $children = [];

    public function add(FileSystemNode $child): self
    {
        $this->children[] = $child;
        return $this;
    }

    public function getSize(): int
    {
        return array_sum(
            array_map(fn(FileSystemNode $c) => $c->getSize(), $this->children)
        );
    }

    public function printTree(string $indent = ''): void
    {
        echo "{$indent}{$this->name}/\\n";
        foreach ($this->children as $child) {
            $child->printTree($indent . '  ');
        }
    }
}

// Build the tree
$root = new Directory('project');
$src  = (new Directory('src'))
    ->add(new File('index.ts', 1200))
    ->add(new File('utils.ts', 800));

$docs = (new Directory('docs'))
    ->add(new File('README.md', 500));

$root->add($src)
     ->add($docs)
     ->add(new File('package.json', 300));

$root->printTree();
echo "Total size: " . $root->getSize() . " bytes\\n";`,
    },
    {
      language: "rust",
      filename: "composite.rs",
      description:
        "An idiomatic Rust enum-based tree that models leaf and composite nodes without trait objects, using recursive enums and pattern matching.",
      code: `/// Idiomatic Rust composite using an enum instead of trait objects.
/// Enums are preferred because they are sized, stack-allocated, and
/// exhaustive match ensures all variants are handled.

enum FsNode {
    File { name: String, size: u64 },
    Dir { name: String, children: Vec<FsNode> },
}

impl FsNode {
    fn file(name: &str, size: u64) -> Self {
        FsNode::File { name: name.to_string(), size }
    }

    fn dir(name: &str, children: Vec<FsNode>) -> Self {
        FsNode::Dir { name: name.to_string(), children }
    }

    fn get_size(&self) -> u64 {
        match self {
            FsNode::File { size, .. } => *size,
            FsNode::Dir { children, .. } => {
                children.iter().map(|c| c.get_size()).sum()
            }
        }
    }

    fn print_tree(&self, indent: &str) {
        match self {
            FsNode::File { name, size } => {
                println!("{indent}{name} ({size} bytes)");
            }
            FsNode::Dir { name, children } => {
                println!("{indent}{name}/");
                let child_indent = format!("{indent}  ");
                for child in children {
                    child.print_tree(&child_indent);
                }
            }
        }
    }
}

fn main() {
    let root = FsNode::dir("project", vec![
        FsNode::dir("src", vec![
            FsNode::file("index.ts", 1200),
            FsNode::file("utils.ts", 800),
        ]),
        FsNode::dir("docs", vec![
            FsNode::file("README.md", 500),
        ]),
        FsNode::file("package.json", 300),
    ]);

    root.print_tree("");
    println!("Total size: {} bytes", root.get_size());
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Classical OOP Composite with trait objects (Box<dyn Component>) forces heap allocation and loses type information. Rust's enum approach is more idiomatic: it is sized, stack-friendly, and pattern matching enforces exhaustive handling of all node types at compile time.",
      alternatives:
        "If the set of node types is open-ended (plugins, user-defined nodes), use Box<dyn Component> trait objects instead of enums.",
    },
  ],
};
