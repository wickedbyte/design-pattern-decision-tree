import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const factoryMethod: PatternDefinition = {
  slug: createPatternSlug("factory-method"),
  name: "Factory Method",
  category: createCategoryId("creational"),
  icon: "gear",
  summary:
    "Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.",
  intent:
    "Define a method in a base class that returns an object conforming to a common interface, but defer the decision of which concrete class to instantiate to subclasses. This allows a framework to work with any user-defined product type without modification.",
  problem:
    "A class needs to create objects but cannot anticipate the exact type of object it must create. Hard-coding a specific class name couples the creator to that particular product, making it impossible to extend the system with new product types without modifying existing code. You need a way to delegate the 'which class?' decision to a point that can be overridden.",
  solution:
    "Replace direct constructor calls with calls to a special factory method. The base class declares the factory method (often abstract), and each subclass overrides it to return a different product variant. Client code calls the factory method through the base class interface, remaining decoupled from concrete product types.",
  participants: [
    "Creator — declares the factory method (which may have a default implementation) and uses it to obtain product instances",
    "ConcreteCreator — overrides the factory method to return a specific ConcreteProduct",
    "Product — defines the interface of objects the factory method creates",
    "ConcreteProduct — implements the Product interface",
  ],
  consequences: {
    advantages: [
      "Decouples the creator from concrete product classes (Dependency Inversion Principle)",
      "New product types can be introduced without changing existing creator code (Open/Closed Principle)",
      "Centralizes product creation logic in one place, making it easier to control and swap implementations",
      "Supports the 'programming to an interface' principle naturally",
    ],
    disadvantages: [
      "Requires creating a new subclass of the creator for each new product type, which can lead to a parallel class hierarchy",
      "Adds indirection that can make the code harder to follow for simple cases",
      "If the creator has significant logic beyond product creation, subclassing just for the factory method can feel heavyweight",
    ],
  },
  realWorldAnalogy:
    "A logistics company has a central dispatch office (creator) that schedules deliveries. The office does not decide whether to use a truck or a ship — that decision is made by regional suboffices (concrete creators) that know local conditions. The dispatch office only knows that it will get a 'transport' that can deliver cargo. Rural suboffices return trucks; coastal suboffices return ships.",
  useCases: [
    "Framework code that lets application-level subclasses control which objects to create",
    "Document editors where each application type (text editor, spreadsheet) creates its own document subclass",
    "Logistics systems where the transport type is determined by region or cargo type",
    "Plugin systems where third-party modules register their own creators",
    "Notification services that produce email, SMS, or push notifications depending on configuration",
  ],
  relatedPatterns: [
    createPatternSlug("abstract-factory"),
    createPatternSlug("prototype"),
    createPatternSlug("builder"),
  ],
  decisionTreeQuestion:
    "None of the above, but creation should be delegated?",
  codeExamples: [
    {
      language: "typescript",
      filename: "factory-method.ts",
      description:
        "Abstract creator class for a logistics system. Each concrete creator overrides the factory method to return the appropriate transport type, while shared planning logic stays in the base class.",
      code: `// --- Product interface ---
interface Transport {
  deliver(cargo: string): string;
  capacity(): number;
}

// --- Concrete products ---
class Truck implements Transport {
  deliver(cargo: string) {
    return \`🚚 Delivering "\${cargo}" by road\`;
  }
  capacity() { return 10; } // tons
}

class Ship implements Transport {
  deliver(cargo: string) {
    return \`🚢 Delivering "\${cargo}" by sea\`;
  }
  capacity() { return 500; } // tons
}

// --- Creator ---
abstract class LogisticsCompany {
  /** Factory method — subclasses decide which Transport to create */
  abstract createTransport(): Transport;

  /** Shared business logic that uses the factory method */
  planDelivery(cargo: string): string {
    const transport = this.createTransport();
    return [
      \`Capacity: \${transport.capacity()} tons\`,
      transport.deliver(cargo),
    ].join("\\n");
  }
}

// --- Concrete creators ---
class RoadLogistics extends LogisticsCompany {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends LogisticsCompany {
  createTransport(): Transport {
    return new Ship();
  }
}

// --- Client code works with the base class ---
function ship(company: LogisticsCompany, cargo: string) {
  console.log(company.planDelivery(cargo));
}

ship(new RoadLogistics(), "Electronics");
ship(new SeaLogistics(), "Grain");`,
    },
    {
      language: "python",
      filename: "factory_method.py",
      description:
        "ABC-based factory method for a logistics system. The abstract creator declares the factory method, and concrete creators provide the specific transport implementations.",
      code: `from abc import ABC, abstractmethod


# --- Product interface ---
class Transport(ABC):
    @abstractmethod
    def deliver(self, cargo: str) -> str: ...

    @abstractmethod
    def capacity(self) -> int: ...


# --- Concrete products ---
class Truck(Transport):
    def deliver(self, cargo: str) -> str:
        return f"Delivering \\"{cargo}\\" by road"

    def capacity(self) -> int:
        return 10  # tons


class Ship(Transport):
    def deliver(self, cargo: str) -> str:
        return f"Delivering \\"{cargo}\\" by sea"

    def capacity(self) -> int:
        return 500  # tons


# --- Creator ---
class LogisticsCompany(ABC):
    @abstractmethod
    def create_transport(self) -> Transport:
        """Factory method — subclasses decide which Transport to create."""
        ...

    def plan_delivery(self, cargo: str) -> str:
        """Shared business logic that uses the factory method."""
        transport = self.create_transport()
        return f"Capacity: {transport.capacity()} tons\\n{transport.deliver(cargo)}"


# --- Concrete creators ---
class RoadLogistics(LogisticsCompany):
    def create_transport(self) -> Transport:
        return Truck()


class SeaLogistics(LogisticsCompany):
    def create_transport(self) -> Transport:
        return Ship()


# --- Client code ---
def ship(company: LogisticsCompany, cargo: str) -> None:
    print(company.plan_delivery(cargo))


ship(RoadLogistics(), "Electronics")
ship(SeaLogistics(), "Grain")`,
    },
    {
      language: "php",
      filename: "FactoryMethod.php",
      description:
        "Abstract class-based factory method in PHP. The creator declares the factory method as abstract, and each concrete creator returns the appropriate transport implementation.",
      code: `<?php

declare(strict_types=1);

// --- Product interface ---
interface Transport
{
    public function deliver(string $cargo): string;
    public function capacity(): int;
}

// --- Concrete products ---
class Truck implements Transport
{
    public function deliver(string $cargo): string
    {
        return "Delivering \\"{$cargo}\\" by road";
    }

    public function capacity(): int
    {
        return 10; // tons
    }
}

class Ship implements Transport
{
    public function deliver(string $cargo): string
    {
        return "Delivering \\"{$cargo}\\" by sea";
    }

    public function capacity(): int
    {
        return 500; // tons
    }
}

// --- Creator ---
abstract class LogisticsCompany
{
    /** Factory method — subclasses decide which Transport to create */
    abstract protected function createTransport(): Transport;

    /** Shared business logic that uses the factory method */
    public function planDelivery(string $cargo): string
    {
        $transport = $this->createTransport();
        return sprintf(
            "Capacity: %d tons\\n%s",
            $transport->capacity(),
            $transport->deliver($cargo),
        );
    }
}

// --- Concrete creators ---
class RoadLogistics extends LogisticsCompany
{
    protected function createTransport(): Transport
    {
        return new Truck();
    }
}

class SeaLogistics extends LogisticsCompany
{
    protected function createTransport(): Transport
    {
        return new Ship();
    }
}

// --- Client code ---
function ship(LogisticsCompany $company, string $cargo): void
{
    echo $company->planDelivery($cargo) . "\\n\\n";
}

ship(new RoadLogistics(), 'Electronics');
ship(new SeaLogistics(), 'Grain');`,
    },
    {
      language: "rust",
      filename: "factory_method.rs",
      description:
        "Trait-based factory method in Rust. The creator trait declares the factory method returning a boxed trait object, and concrete creators implement it. Shared logic lives in a default method on the creator trait.",
      code: `// --- Product trait ---
trait Transport {
    fn deliver(&self, cargo: &str) -> String;
    fn capacity(&self) -> u32;
}

// --- Concrete products ---
struct Truck;
impl Transport for Truck {
    fn deliver(&self, cargo: &str) -> String {
        format!("Delivering \"{}\" by road", cargo)
    }
    fn capacity(&self) -> u32 { 10 } // tons
}

struct Ship;
impl Transport for Ship {
    fn deliver(&self, cargo: &str) -> String {
        format!("Delivering \"{}\" by sea", cargo)
    }
    fn capacity(&self) -> u32 { 500 } // tons
}

// --- Creator trait with factory method ---
trait LogisticsCompany {
    /// Factory method — implementors decide which Transport to create
    fn create_transport(&self) -> Box<dyn Transport>;

    /// Shared business logic that calls the factory method
    fn plan_delivery(&self, cargo: &str) -> String {
        let transport = self.create_transport();
        format!(
            "Capacity: {} tons\n{}",
            transport.capacity(),
            transport.deliver(cargo),
        )
    }
}

// --- Concrete creators ---
struct RoadLogistics;
impl LogisticsCompany for RoadLogistics {
    fn create_transport(&self) -> Box<dyn Transport> {
        Box::new(Truck)
    }
}

struct SeaLogistics;
impl LogisticsCompany for SeaLogistics {
    fn create_transport(&self) -> Box<dyn Transport> {
        Box::new(Ship)
    }
}

// --- Client code ---
fn ship(company: &dyn LogisticsCompany, cargo: &str) {
    println!("{}", company.plan_delivery(cargo));
}

fn main() {
    ship(&RoadLogistics, "Electronics");
    ship(&SeaLogistics, "Grain");
}`,
    },
  ],
  antiPatternNotices: [],
};
