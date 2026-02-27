import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const adapter: PatternDefinition = {
  slug: createPatternSlug("adapter"),
  name: "Adapter",
  category: createCategoryId("structural"),
  emoji: "🔌",
  summary:
    "Convert the interface of a class into another interface clients expect, enabling classes to work together that otherwise could not due to incompatible interfaces.",
  intent:
    "Allow two incompatible interfaces to collaborate by wrapping one object with an adapter that translates calls from the expected interface into the actual interface of the wrapped object.",
  problem:
    "You need to integrate a third-party library, legacy module, or external service whose interface does not match the one your application expects. Rewriting the existing code is impractical or impossible because you do not own it, or because many other consumers already depend on it.",
  solution:
    "Introduce an adapter class that implements the target interface your code expects and internally delegates to the incompatible object, translating method signatures, data formats, or protocols as needed. The rest of your application interacts only with the target interface, remaining oblivious to the adaptation happening underneath.",
  participants: [
    "Target -- the interface the client expects",
    "Adaptee -- the existing class or service with an incompatible interface",
    "Adapter -- translates calls from the Target interface to the Adaptee",
    "Client -- collaborates with objects through the Target interface",
  ],
  consequences: {
    advantages: [
      "Single Responsibility -- translation logic lives in one place, separate from business logic",
      "Open/Closed -- new adapters can be introduced without modifying existing client code or the adaptee",
      "Reuse of existing, tested code that otherwise would not fit the required interface",
      "Decouples clients from third-party or legacy implementation details",
    ],
    disadvantages: [
      "Adds an extra layer of indirection, which can obscure debugging and stack traces",
      "If the adaptee's interface is very different, the adapter can become complex and hard to maintain",
      "Proliferation of adapter classes when many incompatible interfaces need bridging",
    ],
  },
  realWorldAnalogy:
    "A power plug adapter lets you use a European appliance in an American outlet. The appliance (adaptee) has a round-prong plug, your wall outlet (target) has flat slots, and the physical adapter translates between the two shapes without modifying either the appliance or the outlet.",
  useCases: [
    "Wrapping a legacy XML-based API to expose a modern JSON interface",
    "Integrating a third-party payment gateway whose SDK does not match your internal PaymentProcessor interface",
    "Connecting an old database driver to a new ORM abstraction layer",
    "Translating between different logging frameworks so application code uses one consistent API",
    "Bridging platform-specific APIs behind a unified cross-platform interface",
  ],
  relatedPatterns: [
    createPatternSlug("bridge"),
    createPatternSlug("decorator"),
    createPatternSlug("facade"),
    createPatternSlug("proxy"),
  ],
  decisionTreeQuestion:
    "Integrating with an incompatible interface or legacy system?",
  codeExamples: [
    {
      language: "typescript",
      filename: "adapter.ts",
      description:
        "A class adapter that wraps a legacy XML payment gateway behind a modern JSON-based PaymentProcessor interface, translating data formats transparently.",
      code: `// Target interface the application expects
interface PaymentProcessor {
  charge(amount: number, currency: string): Promise<{ id: string; status: string }>;
}

// Adaptee -- legacy third-party SDK with an incompatible interface
class LegacyXmlPaymentGateway {
  submitPaymentXml(xml: string): string {
    // Simulates sending XML and returning XML response
    console.log("Sending XML:", xml);
    return "<response><txn-id>TXN-42</txn-id><result>OK</result></response>";
  }
}

// Adapter translates between the two interfaces
class XmlPaymentAdapter implements PaymentProcessor {
  constructor(private readonly gateway: LegacyXmlPaymentGateway) {}

  async charge(
    amount: number,
    currency: string,
  ): Promise<{ id: string; status: string }> {
    // Build XML that the legacy gateway expects
    const xml = \`<payment><amount>\${amount}</amount><cur>\${currency}</cur></payment>\`;
    const xmlResponse = this.gateway.submitPaymentXml(xml);

    // Parse response XML into the JSON structure our app uses
    const id = xmlResponse.match(/<txn-id>(.*?)<\\/txn-id>/)?.[1] ?? "unknown";
    const status = xmlResponse.match(/<result>(.*?)<\\/result>/)?.[1] ?? "error";
    return { id, status: status.toLowerCase() };
  }
}

// Client code only knows about PaymentProcessor
async function processOrder(processor: PaymentProcessor) {
  const result = await processor.charge(29.99, "USD");
  console.log(\`Payment \${result.id}: \${result.status}\`);
}

// Wire up the adapter
const legacy = new LegacyXmlPaymentGateway();
const processor = new XmlPaymentAdapter(legacy);
processOrder(processor);`,
    },
    {
      language: "python",
      filename: "adapter.py",
      description:
        "An adapter class that uses composition to wrap a legacy XML payment gateway, exposing a clean Pythonic interface to client code.",
      code: `from __future__ import annotations
import re
from typing import Protocol


# Target interface
class PaymentProcessor(Protocol):
    def charge(self, amount: float, currency: str) -> dict[str, str]: ...


# Adaptee -- legacy SDK we cannot modify
class LegacyXmlPaymentGateway:
    def submit_payment_xml(self, xml: str) -> str:
        print(f"Sending XML: {xml}")
        return "<response><txn-id>TXN-42</txn-id><result>OK</result></response>"


# Adapter bridges the gap
class XmlPaymentAdapter:
    def __init__(self, gateway: LegacyXmlPaymentGateway) -> None:
        self._gateway = gateway

    def charge(self, amount: float, currency: str) -> dict[str, str]:
        xml = f"<payment><amount>{amount}</amount><cur>{currency}</cur></payment>"
        xml_resp = self._gateway.submit_payment_xml(xml)

        txn_id = _extract(xml_resp, "txn-id") or "unknown"
        status = (_extract(xml_resp, "result") or "error").lower()
        return {"id": txn_id, "status": status}


def _extract(xml: str, tag: str) -> str | None:
    m = re.search(rf"<{tag}>(.*?)</{tag}>", xml)
    return m.group(1) if m else None


# Client code
def process_order(processor: PaymentProcessor) -> None:
    result = processor.charge(29.99, "USD")
    print(f"Payment {result['id']}: {result['status']}")


legacy = LegacyXmlPaymentGateway()
adapter = XmlPaymentAdapter(legacy)
process_order(adapter)`,
    },
    {
      language: "php",
      filename: "Adapter.php",
      description:
        "A PHP adapter implementing a PaymentProcessor interface while internally delegating to a legacy XML-based gateway class.",
      code: `<?php

// Target interface
interface PaymentProcessor
{
    /** @return array{id: string, status: string} */
    public function charge(float $amount, string $currency): array;
}

// Adaptee -- legacy third-party class
class LegacyXmlPaymentGateway
{
    public function submitPaymentXml(string $xml): string
    {
        echo "Sending XML: {$xml}\\n";
        return '<response><txn-id>TXN-42</txn-id><result>OK</result></response>';
    }
}

// Adapter
class XmlPaymentAdapter implements PaymentProcessor
{
    public function __construct(
        private readonly LegacyXmlPaymentGateway $gateway,
    ) {}

    public function charge(float $amount, string $currency): array
    {
        $xml = "<payment><amount>{$amount}</amount><cur>{$currency}</cur></payment>";
        $resp = $this->gateway->submitPaymentXml($xml);

        preg_match('/<txn-id>(.*?)<\\/txn-id>/', $resp, $idMatch);
        preg_match('/<result>(.*?)<\\/result>/', $resp, $statusMatch);

        return [
            'id'     => $idMatch[1] ?? 'unknown',
            'status' => strtolower($statusMatch[1] ?? 'error'),
        ];
    }
}

// Client code
function processOrder(PaymentProcessor $processor): void
{
    $result = $processor->charge(29.99, 'USD');
    echo "Payment {$result['id']}: {$result['status']}\\n";
}

$legacy  = new LegacyXmlPaymentGateway();
$adapter = new XmlPaymentAdapter($legacy);
processOrder($adapter);`,
    },
    {
      language: "rust",
      filename: "adapter.rs",
      description:
        "Uses the newtype pattern to wrap a foreign type and implement a local trait, the idiomatic Rust approach to the Adapter pattern.",
      code: `// Target trait our application expects
trait PaymentProcessor {
    fn charge(&self, amount: f64, currency: &str) -> PaymentResult;
}

struct PaymentResult {
    id: String,
    status: String,
}

// Adaptee -- legacy crate type we cannot modify
struct LegacyXmlPaymentGateway;

impl LegacyXmlPaymentGateway {
    fn submit_payment_xml(&self, xml: &str) -> String {
        println!("Sending XML: {xml}");
        "<response><txn-id>TXN-42</txn-id><result>OK</result></response>".into()
    }
}

// Adapter -- newtype wrapper so we can implement our trait
struct XmlPaymentAdapter(LegacyXmlPaymentGateway);

impl PaymentProcessor for XmlPaymentAdapter {
    fn charge(&self, amount: f64, currency: &str) -> PaymentResult {
        let xml = format!("<payment><amount>{amount}</amount><cur>{currency}</cur></payment>");
        let resp = self.0.submit_payment_xml(&xml);

        let id = extract_tag(&resp, "txn-id").unwrap_or("unknown".into());
        let status = extract_tag(&resp, "result")
            .unwrap_or("error".into())
            .to_lowercase();

        PaymentResult { id, status }
    }
}

fn extract_tag(xml: &str, tag: &str) -> Option<String> {
    let open = format!("<{tag}>");
    let close = format!("</{tag}>");
    let start = xml.find(&open)? + open.len();
    let end = xml.find(&close)?;
    Some(xml[start..end].to_string())
}

// Client code
fn process_order(processor: &dyn PaymentProcessor) {
    let result = processor.charge(29.99, "USD");
    println!("Payment {}: {}", result.id, result.status);
}

fn main() {
    let adapter = XmlPaymentAdapter(LegacyXmlPaymentGateway);
    process_order(&adapter);
}`,
    },
  ],
  antiPatternNotices: [
    {
      language: "rust",
      reason:
        "Rust's orphan rule prevents implementing a foreign trait for a foreign type. The newtype pattern (wrapping in a tuple struct) is the idiomatic workaround and is essentially the Adapter pattern built into the language's design philosophy.",
    },
  ],
};
