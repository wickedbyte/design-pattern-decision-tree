# Design Pattern Decision Tree

## Summary

**Source:** _"Stop Memorizing Design Patterns: Use This Decision Tree Instead"_ by Alina Kovtun (Medium / Women in Technology, Jan 2026)

The article's core argument is that design patterns don't fail because they're wrong — they fail because developers reach for them at the wrong moment or as a substitute for naming the real problem. Instead of memorizing all 23 Gang of Four patterns, the author proposes a **pain-point-first decision tree**: before picking a pattern, describe the friction you're trying to remove.

The decision tree starts with one question: **"What is your main pain point?"** — which branches into three categories:

1. **Object Creation** — creation logic is getting more complex or scattered
2. **Boundaries & Structure** — fighting boundaries between components or external dependencies
3. **Behavior & Logic** — behavior keeps changing and your code is accumulating conditionals

From there, targeted follow-up questions lead you to the right pattern.

---

## The Decision Tree (Text Version)

### Step 1: Identify Your Pain Point

| Pain Point                                         | Description                                                                                           | Pattern Category        |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------- |
| Object creation is complex or scattered            | Constructors are growing, creation logic is duplicated, you need to control how/when objects are made | **Creational Patterns** |
| Component boundaries or integration is painful     | You're fighting incompatible interfaces, complex subsystems, or need to structure relationships       | **Structural Patterns** |
| Behavior keeps changing, conditionals keep growing | You're adding if/else chains, behavior varies by context, or objects need to react to each other      | **Behavioral Patterns** |

---

### Branch 1: Object Creation Pain → Creational Patterns

| Question                                                             | If Yes →             | Pattern Summary                                                                    |
| -------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------- |
| Need exactly one shared instance?                                    | **Singleton**        | One global instance with controlled access (e.g., config, logger, connection pool) |
| Object has many optional parts or complex step-by-step construction? | **Builder**          | Construct complex objects step-by-step; avoid telescoping constructors             |
| Need to clone an existing object rather than build from scratch?     | **Prototype**        | Copy an existing object and modify the clone                                       |
| Creating families of related objects that must stay consistent?      | **Abstract Factory** | Produce families of related objects without specifying concrete classes            |
| None of the above, but creation should be delegated?                 | **Factory Method**   | Let subclasses decide which class to instantiate                                   |

---

### Branch 2: Boundaries & Structure Pain → Structural Patterns

| Question                                                                        | If Yes →      | Pattern Summary                                                |
| ------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------- |
| Integrating with an incompatible interface or legacy system?                    | **Adapter**   | Convert one interface into another that clients expect         |
| Need to hide a complex subsystem behind one simple entry point?                 | **Facade**    | Provide a unified, simplified interface over complex internals |
| Need to add responsibilities to objects dynamically without subclassing?        | **Decorator** | Wrap objects in layers that each add behavior                  |
| Need to control access, lazy-load, cache, or add a stand-in for another object? | **Proxy**     | A placeholder that controls access to the real object          |
| Working with tree structures or part-whole hierarchies?                         | **Composite** | Treat individual objects and compositions uniformly            |
| Need to vary abstraction and implementation independently?                      | **Bridge**    | Decouple abstraction from implementation so both can evolve    |

---

### Branch 3: Behavior & Logic Pain → Behavioral Patterns

| Question                                                 | If Yes →                    | Pattern Summary                                                         |
| -------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| Need to notify multiple objects when something changes?  | **Observer**                | Publish-subscribe mechanism for state-change notifications              |
| Need to swap algorithms or strategies at runtime?        | **Strategy**                | Encapsulate interchangeable algorithms behind a common interface        |
| Object behavior depends entirely on its current state?   | **State**                   | Object changes behavior when its internal state changes                 |
| Need undo/redo, queuing, or logging of operations?       | **Command**                 | Encapsulate a request as an object with execute/undo                    |
| A request must pass through a chain of handlers?         | **Chain of Responsibility** | Each handler decides to process or pass along                           |
| Need a fixed algorithm skeleton with customizable steps? | **Template Method**         | Define the skeleton in a base class; subclasses override specific steps |

---

### If None of These Fit

Re-examine the problem. The article emphasizes that often the right move is **not** a design pattern at all — it's a simpler refactoring: extract a method, rename a class, or break a module apart. Patterns solve recurring structural problems; they shouldn't be used as a substitute for clear thinking about your actual code friction.

---

## Key Takeaways

- **Start with the pain, not the pattern.** Naming the friction is the real skill.
- **Patterns fail from misapplication, not from being wrong.** A perfectly valid pattern used in the wrong context creates more complexity than it removes.
- **Simpler is often better.** If a basic refactoring removes the friction, skip the pattern.
- **The decision tree is a thinking tool, not a flowchart to follow blindly.** Judgment still matters — but you'll spend less time guessing and more time deciding.
