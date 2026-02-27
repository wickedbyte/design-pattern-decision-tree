import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const facade: PatternDefinition = {
  slug: createPatternSlug("facade"),
  name: "Facade",
  category: createCategoryId("structural"),
  emoji: "🏛️",
  summary:
    "Provide a unified, simplified interface to a set of interfaces in a subsystem, making the subsystem easier to use.",
  intent:
    "Define a higher-level interface that shields clients from the complexity of a subsystem by exposing only the operations they actually need, delegating the orchestration of multiple internal components behind a single entry point.",
  problem:
    "Your subsystem has grown into many interrelated classes with intricate initialization sequences and complex dependencies. Clients that need to perform common tasks must understand and coordinate numerous objects, leading to tight coupling and fragile code that breaks whenever the subsystem evolves.",
  solution:
    "Create a facade class that provides a simple, high-level API for the most common use cases. The facade knows which subsystem classes are responsible for each request and delegates accordingly. Clients interact with the facade instead of the subsystem directly, though the subsystem remains accessible for advanced scenarios.",
  participants: [
    "Facade -- provides a simplified API and delegates to subsystem objects",
    "Subsystem classes -- implement the actual functionality; unaware of the facade",
    "Client -- calls the facade instead of manipulating subsystem objects directly",
  ],
  consequences: {
    advantages: [
      "Reduces coupling between clients and a complex subsystem",
      "Provides a convenient default configuration for common use cases",
      "Promotes subsystem independence -- internal changes stay behind the facade",
      "Does not prevent direct subsystem access when advanced control is needed",
    ],
    disadvantages: [
      "The facade can become a 'god object' if too many responsibilities accumulate",
      "May hide useful lower-level features, tempting developers to bypass the facade",
      "Adds an additional layer that must be kept in sync with the evolving subsystem",
    ],
  },
  realWorldAnalogy:
    "A hotel concierge acts as a facade. When you ask the concierge to arrange a city tour, they coordinate the taxi service, the tour guide company, and the restaurant reservation system. You interact with one person instead of calling three separate services yourself.",
  useCases: [
    "Simplifying a complex email-sending subsystem (SMTP connection, template engine, attachment handler) behind a single sendEmail() call",
    "Providing a startup/shutdown method for a home-theater system with projector, amplifier, and streaming player",
    "Wrapping a multi-step report-generation pipeline (data fetching, transformation, PDF rendering) in a single generateReport() method",
    "Offering a simplified API for a complex third-party SDK",
    "Encapsulating database migration steps (backup, schema diff, migration, verification) behind a migrate() call",
  ],
  relatedPatterns: [
    createPatternSlug("adapter"),
    createPatternSlug("singleton"),
    createPatternSlug("abstract-factory"),
  ],
  decisionTreeQuestion:
    "Need to simplify a complex subsystem behind one entry point?",
  codeExamples: [
    {
      language: "typescript",
      filename: "facade.ts",
      description:
        "A HomeTheaterFacade wraps multiple subsystem classes (projector, amplifier, streaming player) and exposes simple watchMovie/endMovie methods.",
      code: `// --- Subsystem classes ---
class Projector {
  on() { console.log("Projector on"); }
  setWidescreen() { console.log("Projector set to widescreen"); }
  off() { console.log("Projector off"); }
}

class Amplifier {
  on() { console.log("Amplifier on"); }
  setVolume(level: number) { console.log(\`Volume set to \${level}\`); }
  off() { console.log("Amplifier off"); }
}

class StreamingPlayer {
  on() { console.log("Streaming player on"); }
  play(movie: string) { console.log(\`Playing "\${movie}"\`); }
  stop() { console.log("Streaming player stopped"); }
  off() { console.log("Streaming player off"); }
}

// --- Facade ---
class HomeTheaterFacade {
  constructor(
    private readonly projector: Projector,
    private readonly amp: Amplifier,
    private readonly player: StreamingPlayer,
  ) {}

  watchMovie(movie: string): void {
    console.log("--- Preparing to watch movie ---");
    this.projector.on();
    this.projector.setWidescreen();
    this.amp.on();
    this.amp.setVolume(7);
    this.player.on();
    this.player.play(movie);
  }

  endMovie(): void {
    console.log("--- Shutting down ---");
    this.player.stop();
    this.player.off();
    this.amp.off();
    this.projector.off();
  }
}

// Client code
const theater = new HomeTheaterFacade(
  new Projector(),
  new Amplifier(),
  new StreamingPlayer(),
);
theater.watchMovie("Inception");
theater.endMovie();`,
    },
    {
      language: "python",
      filename: "facade.py",
      description:
        "A Python facade module that hides the complexity of coordinating projector, amplifier, and streaming player subsystems behind two simple functions.",
      code: `"""Home theater facade -- simplifies a multi-component subsystem."""


class Projector:
    def on(self) -> None:
        print("Projector on")

    def set_widescreen(self) -> None:
        print("Projector set to widescreen")

    def off(self) -> None:
        print("Projector off")


class Amplifier:
    def on(self) -> None:
        print("Amplifier on")

    def set_volume(self, level: int) -> None:
        print(f"Volume set to {level}")

    def off(self) -> None:
        print("Amplifier off")


class StreamingPlayer:
    def on(self) -> None:
        print("Streaming player on")

    def play(self, movie: str) -> None:
        print(f'Playing "{movie}"')

    def stop(self) -> None:
        print("Streaming player stopped")

    def off(self) -> None:
        print("Streaming player off")


class HomeTheaterFacade:
    """Single entry point for common home-theater operations."""

    def __init__(self) -> None:
        self._projector = Projector()
        self._amp = Amplifier()
        self._player = StreamingPlayer()

    def watch_movie(self, movie: str) -> None:
        print("--- Preparing to watch movie ---")
        self._projector.on()
        self._projector.set_widescreen()
        self._amp.on()
        self._amp.set_volume(7)
        self._player.on()
        self._player.play(movie)

    def end_movie(self) -> None:
        print("--- Shutting down ---")
        self._player.stop()
        self._player.off()
        self._amp.off()
        self._projector.off()


# Client code
facade = HomeTheaterFacade()
facade.watch_movie("Inception")
facade.end_movie()`,
    },
    {
      language: "php",
      filename: "Facade.php",
      description:
        "A PHP facade class that orchestrates projector, amplifier, and streaming player objects, offering clean watchMovie/endMovie methods.",
      code: `<?php

// --- Subsystem classes ---
class Projector
{
    public function on(): void { echo "Projector on\\n"; }
    public function setWidescreen(): void { echo "Projector set to widescreen\\n"; }
    public function off(): void { echo "Projector off\\n"; }
}

class Amplifier
{
    public function on(): void { echo "Amplifier on\\n"; }
    public function setVolume(int $level): void { echo "Volume set to {$level}\\n"; }
    public function off(): void { echo "Amplifier off\\n"; }
}

class StreamingPlayer
{
    public function on(): void { echo "Streaming player on\\n"; }
    public function play(string $movie): void { echo "Playing \\"{$movie}\\"\\n"; }
    public function stop(): void { echo "Streaming player stopped\\n"; }
    public function off(): void { echo "Streaming player off\\n"; }
}

// --- Facade ---
class HomeTheaterFacade
{
    public function __construct(
        private readonly Projector $projector,
        private readonly Amplifier $amp,
        private readonly StreamingPlayer $player,
    ) {}

    public function watchMovie(string $movie): void
    {
        echo "--- Preparing to watch movie ---\\n";
        $this->projector->on();
        $this->projector->setWidescreen();
        $this->amp->on();
        $this->amp->setVolume(7);
        $this->player->on();
        $this->player->play($movie);
    }

    public function endMovie(): void
    {
        echo "--- Shutting down ---\\n";
        $this->player->stop();
        $this->player->off();
        $this->amp->off();
        $this->projector->off();
    }
}

// Client code
$theater = new HomeTheaterFacade(
    new Projector(),
    new Amplifier(),
    new StreamingPlayer(),
);
$theater->watchMovie('Inception');
$theater->endMovie();`,
    },
    {
      language: "rust",
      filename: "facade.rs",
      description:
        "A Rust facade struct that owns the subsystem components and exposes simple methods, leveraging Rust's ownership model to manage lifecycle.",
      code: `// --- Subsystem structs ---
struct Projector;
impl Projector {
    fn on(&self) { println!("Projector on"); }
    fn set_widescreen(&self) { println!("Projector set to widescreen"); }
    fn off(&self) { println!("Projector off"); }
}

struct Amplifier;
impl Amplifier {
    fn on(&self) { println!("Amplifier on"); }
    fn set_volume(&self, level: u8) { println!("Volume set to {level}"); }
    fn off(&self) { println!("Amplifier off"); }
}

struct StreamingPlayer;
impl StreamingPlayer {
    fn on(&self) { println!("Streaming player on"); }
    fn play(&self, movie: &str) { println!("Playing \\"{movie}\\""); }
    fn stop(&self) { println!("Streaming player stopped"); }
    fn off(&self) { println!("Streaming player off"); }
}

// --- Facade ---
struct HomeTheaterFacade {
    projector: Projector,
    amp: Amplifier,
    player: StreamingPlayer,
}

impl HomeTheaterFacade {
    fn new() -> Self {
        Self {
            projector: Projector,
            amp: Amplifier,
            player: StreamingPlayer,
        }
    }

    fn watch_movie(&self, movie: &str) {
        println!("--- Preparing to watch movie ---");
        self.projector.on();
        self.projector.set_widescreen();
        self.amp.on();
        self.amp.set_volume(7);
        self.player.on();
        self.player.play(movie);
    }

    fn end_movie(&self) {
        println!("--- Shutting down ---");
        self.player.stop();
        self.player.off();
        self.amp.off();
        self.projector.off();
    }
}

fn main() {
    let theater = HomeTheaterFacade::new();
    theater.watch_movie("Inception");
    theater.end_movie();
}`,
    },
  ],
  antiPatternNotices: [],
};
