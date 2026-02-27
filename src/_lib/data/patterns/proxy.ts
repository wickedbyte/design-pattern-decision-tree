import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const proxy: PatternDefinition = {
  slug: createPatternSlug("proxy"),
  name: "Proxy",
  category: createCategoryId("structural"),
  icon: "shield-halved",
  summary:
    "Provide a surrogate or placeholder for another object to control access to it.",
  intent:
    "Introduce a stand-in object that controls access to a real subject -- deferring its creation, guarding its operations, or adding cross-cutting concerns -- while presenting the same interface so that clients cannot tell the difference.",
  problem:
    "You have an object that is expensive to create, located on a remote server, or requires access control. Allowing unrestricted direct access wastes resources, compromises security, or couples the client to infrastructure details. You need a way to interpose control logic without changing the client or the real object.",
  solution:
    "Create a proxy class that implements the same interface as the real subject. The proxy holds a reference (or lazily creates one) to the real subject and forwards requests to it, adding behavior such as lazy initialization, access checks, logging, or caching around each delegation.",
  participants: [
    "Subject -- the common interface shared by RealSubject and Proxy",
    "RealSubject -- the actual object that performs the work",
    "Proxy -- controls access to the RealSubject; implements the same interface",
    "Client -- works with the Subject interface, unaware whether it holds a Proxy or the RealSubject",
  ],
  consequences: {
    advantages: [
      "Controls access to the real object without clients knowing",
      "Enables lazy initialization of heavyweight objects (virtual proxy)",
      "Can add caching, logging, or access control transparently",
      "The real object's lifecycle can be managed independently of the client",
    ],
    disadvantages: [
      "Adds an extra layer of indirection, which can complicate debugging",
      "Response time may increase due to additional processing in the proxy",
      "Proxy code can become complex when combining multiple concerns (caching + auth + logging)",
      "The proxy must stay in sync with the real subject's interface evolution",
    ],
  },
  realWorldAnalogy:
    "A credit card is a proxy for your bank account. The store (client) swipes the card (proxy) instead of accessing your cash (real subject) directly. The card performs access control (PIN verification), communicates with the bank, and may apply spending limits -- all before letting the transaction through.",
  useCases: [
    "Virtual proxy: deferring the loading of a high-resolution image until it is scrolled into view",
    "Protection proxy: checking user permissions before allowing operations on a sensitive resource",
    "Caching proxy: storing results of expensive database queries and returning cached data on repeat calls",
    "Remote proxy: representing an object on a different server and marshalling calls over the network",
    "Logging proxy: recording every method invocation for auditing or debugging purposes",
  ],
  relatedPatterns: [
    createPatternSlug("decorator"),
    createPatternSlug("adapter"),
    createPatternSlug("facade"),
  ],
  decisionTreeQuestion:
    "Need to control access, lazy-load, or add a stand-in?",
  codeExamples: [
    {
      language: "typescript",
      filename: "proxy.ts",
      description:
        "A virtual proxy that lazily loads a heavy image object on first access and a protection proxy that checks permissions before delegating operations.",
      code: `// Subject interface
interface Image {
  display(): void;
  getFilename(): string;
}

// RealSubject -- expensive to create
class HighResImage implements Image {
  private data: string;

  constructor(private readonly filename: string) {
    // Simulate expensive loading
    this.data = \`[binary data of \${filename}]\`;
    console.log(\`Loaded \${filename} from disk (expensive!)\`);
  }

  display(): void {
    console.log(\`Displaying \${this.filename}\`);
  }

  getFilename(): string {
    return this.filename;
  }
}

// Virtual Proxy -- defers creation until actually needed
class LazyImageProxy implements Image {
  private real: HighResImage | null = null;

  constructor(private readonly filename: string) {
    console.log(\`Proxy created for \${filename} (no loading yet)\`);
  }

  private ensureLoaded(): HighResImage {
    if (!this.real) {
      this.real = new HighResImage(this.filename);
    }
    return this.real;
  }

  display(): void {
    this.ensureLoaded().display();
  }

  getFilename(): string {
    return this.filename; // no need to load just for the name
  }
}

// Protection Proxy -- adds access control
class ProtectedImageProxy implements Image {
  constructor(
    private readonly inner: Image,
    private readonly userRole: string,
  ) {}

  display(): void {
    if (this.userRole !== "admin" && this.userRole !== "viewer") {
      throw new Error("Access denied: insufficient permissions");
    }
    this.inner.display();
  }

  getFilename(): string {
    return this.inner.getFilename();
  }
}

// Client code
const image: Image = new ProtectedImageProxy(
  new LazyImageProxy("sunset-4k.png"),
  "viewer",
);
console.log("Filename:", image.getFilename()); // no heavy load
image.display(); // triggers lazy load + access check`,
    },
    {
      language: "python",
      filename: "proxy.py",
      description:
        "A Python virtual proxy using explicit delegation that lazily creates the expensive real object, plus a protection proxy that guards method access by role.",
      code: `"""Proxy pattern -- virtual and protection proxies."""

from __future__ import annotations

from abc import ABC, abstractmethod


# Subject interface
class Image(ABC):
    @abstractmethod
    def display(self) -> None: ...

    @abstractmethod
    def get_filename(self) -> str: ...


# RealSubject
class HighResImage(Image):
    def __init__(self, filename: str) -> None:
        self._filename = filename
        self._data = f"[binary data of {filename}]"
        print(f"Loaded {filename} from disk (expensive!)")

    def display(self) -> None:
        print(f"Displaying {self._filename}")

    def get_filename(self) -> str:
        return self._filename


# Virtual proxy -- defers loading
class LazyImageProxy(Image):
    def __init__(self, filename: str) -> None:
        self._filename = filename
        self._real: HighResImage | None = None
        print(f"Proxy created for {filename} (no loading yet)")

    def _ensure_loaded(self) -> HighResImage:
        if self._real is None:
            self._real = HighResImage(self._filename)
        return self._real

    def display(self) -> None:
        self._ensure_loaded().display()

    def get_filename(self) -> str:
        return self._filename  # cheap -- no load needed


# Protection proxy
class ProtectedImageProxy(Image):
    def __init__(self, inner: Image, user_role: str) -> None:
        self._inner = inner
        self._role = user_role

    def display(self) -> None:
        if self._role not in ("admin", "viewer"):
            raise PermissionError("Access denied: insufficient permissions")
        self._inner.display()

    def get_filename(self) -> str:
        return self._inner.get_filename()


# Client code
image: Image = ProtectedImageProxy(
    LazyImageProxy("sunset-4k.png"), "viewer"
)
print("Filename:", image.get_filename())
image.display()`,
    },
    {
      language: "php",
      filename: "Proxy.php",
      description:
        "PHP proxy classes implementing the same Image interface, with a virtual proxy for lazy loading and a protection proxy for access control.",
      code: `<?php

// Subject interface
interface Image
{
    public function display(): void;
    public function getFilename(): string;
}

// RealSubject
class HighResImage implements Image
{
    private string $data;

    public function __construct(private readonly string $filename)
    {
        $this->data = "[binary data of {$filename}]";
        echo "Loaded {$filename} from disk (expensive!)\\n";
    }

    public function display(): void
    {
        echo "Displaying {$this->filename}\\n";
    }

    public function getFilename(): string
    {
        return $this->filename;
    }
}

// Virtual proxy
class LazyImageProxy implements Image
{
    private ?HighResImage $real = null;

    public function __construct(private readonly string $filename)
    {
        echo "Proxy created for {$filename} (no loading yet)\\n";
    }

    private function ensureLoaded(): HighResImage
    {
        if ($this->real === null) {
            $this->real = new HighResImage($this->filename);
        }
        return $this->real;
    }

    public function display(): void
    {
        $this->ensureLoaded()->display();
    }

    public function getFilename(): string
    {
        return $this->filename;
    }
}

// Protection proxy
class ProtectedImageProxy implements Image
{
    public function __construct(
        private readonly Image $inner,
        private readonly string $userRole,
    ) {}

    public function display(): void
    {
        if (!in_array($this->userRole, ['admin', 'viewer'], true)) {
            throw new RuntimeException('Access denied: insufficient permissions');
        }
        $this->inner->display();
    }

    public function getFilename(): string
    {
        return $this->inner->getFilename();
    }
}

// Client code
$image = new ProtectedImageProxy(
    new LazyImageProxy('sunset-4k.png'),
    'viewer',
);
echo "Filename: " . $image->getFilename() . "\\n";
$image->display();`,
    },
    {
      language: "rust",
      filename: "proxy.rs",
      description:
        "A Rust proxy struct implementing the same trait as the real subject, using Option and lazy initialization with interior mutability via OnceCell.",
      code: `use std::cell::OnceCell;

// Subject trait
trait Image {
    fn display(&self);
    fn filename(&self) -> &str;
}

// RealSubject
struct HighResImage {
    name: String,
    _data: Vec<u8>,
}

impl HighResImage {
    fn load(name: &str) -> Self {
        println!("Loaded {name} from disk (expensive!)");
        Self {
            name: name.to_string(),
            _data: vec![0u8; 1024], // simulate heavy data
        }
    }
}

impl Image for HighResImage {
    fn display(&self) {
        println!("Displaying {}", self.name);
    }
    fn filename(&self) -> &str {
        &self.name
    }
}

// Virtual proxy -- lazy initialization
struct LazyImageProxy {
    name: String,
    real: OnceCell<HighResImage>,
}

impl LazyImageProxy {
    fn new(name: &str) -> Self {
        println!("Proxy created for {name} (no loading yet)");
        Self {
            name: name.to_string(),
            real: OnceCell::new(),
        }
    }

    fn ensure_loaded(&self) -> &HighResImage {
        self.real.get_or_init(|| HighResImage::load(&self.name))
    }
}

impl Image for LazyImageProxy {
    fn display(&self) {
        self.ensure_loaded().display();
    }
    fn filename(&self) -> &str {
        &self.name // cheap -- no load needed
    }
}

// Protection proxy
struct ProtectedImageProxy<T: Image> {
    inner: T,
    role: String,
}

impl<T: Image> Image for ProtectedImageProxy<T> {
    fn display(&self) {
        if self.role != "admin" && self.role != "viewer" {
            panic!("Access denied: insufficient permissions");
        }
        self.inner.display();
    }
    fn filename(&self) -> &str {
        self.inner.filename()
    }
}

fn main() {
    let image = ProtectedImageProxy {
        inner: LazyImageProxy::new("sunset-4k.png"),
        role: "viewer".to_string(),
    };
    println!("Filename: {}", image.filename());
    image.display();
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Interior mutability (OnceCell, RefCell) is needed for lazy initialization proxies because Rust enforces exclusive mutation. This is safe but differs from the transparent mutation possible in garbage-collected languages.",
      alternatives:
        "For thread-safe scenarios, use std::sync::OnceLock or the once_cell crate's sync::Lazy instead of OnceCell.",
    },
  ],
};
