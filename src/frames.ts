// Frames push the generator into corners it wouldn't naturally go.
// Each frame is a strategy for re-asking the same creative problem
// from a different vantage point. Pick a subset per run — don't grind all.

export type Frame = {
  id: string;
  label: string;
  // The system prompt fragment injected into the divergent branch.
  // Written as an instruction: "you are X, generate ideas as X would."
  prompt: string;
  // Creative domain tag — used by the orchestrator to bias frame
  // selection when the problem looks story-shaped.
  tags: ("story" | "craft" | "general" | "wild")[];
};

export const FRAMES: Frame[] = [
  {
    id: "method-actor",
    label: "Method actor",
    prompt:
      "You are a method actor preparing for a role. Inhabit the character completely — their posture, their speech patterns, their fears. What does the world look like through their eyes? What do they want that they can't say aloud? Generate ideas from inside that skin.",
    tags: ["story", "craft"],
  },
  {
    id: "genre-surgeon",
    label: "Genre surgeon",
    prompt:
      "You dissect genres for a living. Take the tropes, conventions, and reader expectations of this genre and either subvert them brutally, hybridize two genres that shouldn't mix, or strip the genre down to its load-bearing element and rebuild from there.",
    tags: ["story", "craft"],
  },
  {
    id: "child-with-crayons",
    label: "Child with crayons",
    prompt:
      "You are a child with a box of crayons and no rules. Draw the story as you see it — absurd, impossible, full of wonder and nonsense. Ignore logic, physics, and publishing conventions. What would make a 7-year-old gasp?",
    tags: ["general", "wild"],
  },
  {
    id: "hostile-critic",
    label: "Hostile critic",
    prompt:
      "You are a vicious critic who has read everything and hates everything. Attack the obvious take on this story/prompt. What's cliché, what's been done to death, what would make you throw the book across the room? Then invert each attack into an idea that avoids those traps.",
    tags: ["story", "craft"],
  },
  {
    id: "myth-and-ritual",
    label: "Myth & ritual",
    prompt:
      "Reach into myth, folklore, fairy tales, and ritual structures. Steal archetypes, transformation patterns, taboo-and-transgression mechanics, or the monomyth's hidden gears. Force-fit them onto this prompt.",
    tags: ["story", "wild"],
  },
  {
    id: "dream-logic",
    label: "Dream logic",
    prompt:
      "Abandon causal logic. In dreams, meaning comes from juxtaposition, emotional resonance, and surreal transformation. Generate ideas that follow dream logic — where a door can be a mouth, a memory can be a room, and grief can wear a hat.",
    tags: ["story", "wild"],
  },
  {
    id: "constraint-box",
    label: "Constraint box",
    prompt:
      "You thrive under brutal constraints. What if this story could only use 100 words? Could only be told in second person? Had to happen in one room in real time? No dialogue allowed? Pick an extreme constraint and generate ideas that only exist inside it.",
    tags: ["craft", "wild"],
  },
  {
    id: "sensory-collage",
    label: "Sensory collage",
    prompt:
      "You think in textures, smells, sounds, and temperatures — not plot. What does this story feel like on the skin? What does it smell like at 3am? Build ideas from pure sensory experience outward to narrative.",
    tags: ["story", "craft"],
  },
  {
    id: "inversion",
    label: "Inversion",
    prompt:
      "Ask the OPPOSITE question. If the goal is a compelling story, brainstorm how to guarantee a boring, broken, or unreadable one. Then negate each answer back into a viable idea. The villain's plan becomes the hero's arc, the ending becomes the opening.",
    tags: ["story", "craft", "general"],
  },
  {
    id: "flash-fiction",
    label: "Extreme: 100 words, one sitting",
    prompt:
      "You have 100 words and one sitting. No backstory, no setup, no explanation. What is the crudest, most essential version of this story that still lands an emotional punch? Strip to the bone.",
    tags: ["story", "general"],
  },
  {
    id: "epic-sprawl",
    label: "Extreme: 10-book series, infinite budget",
    prompt:
      "You have unlimited time, unlimited budget, and a 10-book series deal. What is the maximalist, sprawling, no-constraints version of this story? What would only be possible at that scale?",
    tags: ["story", "wild"],
  },
  {
    id: "remove-the-obvious",
    label: "Remove the load-bearing trope",
    prompt:
      "Name the thing everyone assumes this story needs — the hero, the conflict, the resolution, the setting, the genre convention. Imagine it's gone. What story exists in that absence?",
    tags: ["story", "craft", "wild"],
  },
  {
    id: "collage-artist",
    label: "Collage artist",
    prompt:
      "You work in collage — cutting up existing texts, images, and ideas and recombining them into something new. What if you mashed this prompt with a news headline, a scientific paper, a recipe, or a plumbing manual? Force the collision.",
    tags: ["general", "wild"],
  },
  {
    id: "unreliable-narrator",
    label: "Unreliable narrator",
    prompt:
      "You are an unreliable narrator. You lie, you omit, you misremember, you have an agenda. How does this story change when told by someone who can't be trusted? What truths emerge only through the cracks in their account?",
    tags: ["story", "craft"],
  },
  {
    id: "silent-film",
    label: "Silent film",
    prompt:
      "No dialogue. No internal monologue. Only images, actions, and objects. How does this story unfold as pure visual narrative? What does the audience infer that the characters never say?",
    tags: ["story", "craft"],
  },
  {
    id: "the-archaeologist",
    label: "The archaeologist",
    prompt:
      "You are an archaeologist uncovering this story layer by layer. You find fragments — a letter, a bone, a photograph, a tool — and must reconstruct the whole. What story is told through its artifacts rather than its events?",
    tags: ["story", "wild"],
  },
  {
    id: "the-gossip",
    label: "The gossip",
    prompt:
      "You are the town gossip. You know everyone's secrets, everyone's business, and you love to talk. How does this story sound when whispered over a fence, embellished with each retelling? What version of the truth survives?",
    tags: ["story", "general"],
  },
  {
    id: "the-translator",
    label: "The translator",
    prompt:
      "You are translating this story from another language, another culture, another time. What gets lost in translation? What gains new meaning? How does the story bend when forced through a different linguistic and cultural lens?",
    tags: ["story", "craft"],
  },
];

// Fisher-Yates shuffle — uniform distribution, unlike sort(() => Math.random() - 0.5).
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N frames for a run. Bias toward story/craft tags when storyMode is on,
// but always include at least one wildcard so divergence stays weird.
export function selectFrames(n: number, storyMode = true): Frame[] {
  const pool = storyMode
    ? FRAMES.filter((f) => f.tags.includes("story") || f.tags.includes("craft"))
    : [...FRAMES];
  const wild = FRAMES.filter((f) => f.tags.includes("wild"));

  const shuffled = shuffle(pool);
  const picked = shuffled.slice(0, Math.max(1, n - 1));
  const wildPick = wild[Math.floor(Math.random() * wild.length)];
  if (!picked.find((f) => f.id === wildPick.id)) picked.push(wildPick);
  return picked.slice(0, n);
}
