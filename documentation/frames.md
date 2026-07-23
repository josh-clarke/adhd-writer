# Frames — the creative distortions

[← back to README](../README.md)

A frame is a *vantage operator*: a system-prompt payload that re-poses the entire creative prompt from a different artistic position. Not a persona, not a genre expert — a deliberate distortion that forces the generator into a corner it would not naturally drift toward.

18 built-in frames ship today, biased toward `story` and `craft` when `storyMode` is on (the default). Each is a vantage prompt plus tags.

| Frame | Vantage | Tags |
|---|---|---|
| **Method actor** | Inhabit the character completely — posture, speech, fears. What do they want that they can't say? | story, craft |
| **Genre surgeon** | Subvert tropes, hybridize genres, strip to load-bearing element and rebuild | story, craft |
| **Child with crayons** | Absurd, impossible, full of wonder. Ignore logic and publishing conventions | general, wild |
| **Hostile critic** | Attack the obvious take. What's cliché? Invert each attack into an idea | story, craft |
| **Myth & ritual** | Steal archetypes, transformation patterns, taboo mechanics from folklore | story, wild |
| **Dream logic** | Juxtaposition, emotional resonance, surreal transformation over causal logic | story, wild |
| **Constraint box** | 100 words, second person, one room, no dialogue. Extreme constraints only | craft, wild |
| **Sensory collage** | Textures, smells, sounds, temperatures. Build from sensory experience outward | story, craft |
| **Inversion** | Brainstorm how to guarantee a boring story, then negate each answer back | story, craft, general |
| **Flash fiction** | 100 words, one sitting. Strip to the bone. No backstory, no setup | story, general |
| **Epic sprawl** | 10-book series, unlimited budget. Maximalist, sprawling, no constraints | story, wild |
| **Remove the obvious** | Remove the hero, the conflict, the resolution. What story exists in that absence? | story, craft, wild |
| **Collage artist** | Mash the prompt with a news headline, a recipe, a plumbing manual | general, wild |
| **Unreliable narrator** | Lies, omissions, misremembering. What truths emerge through the cracks? | story, craft |
| **Silent film** | No dialogue, no internal monologue. Pure visual narrative | story, craft |
| **The archaeologist** | Story told through artifacts — a letter, a bone, a photograph | story, wild |
| **The gossip** | Whispered over a fence, embellished with each retelling | story, general |
| **The translator** | Translate from another language, culture, time. What gets lost? What gains meaning? | story, craft |

## How frames are selected

- `storyMode` (default `true`) biases selection toward `story` and `craft` tags.
- A `wild` frame always gets one reserved slot per run so divergence stays weird.
- Selection is deterministic per-seed so runs are reproducible.

## Authoring your own frames

A good frame is a *lever*, not a *label*. It should:

1. **Change what counts as a valid answer.** "Method actor" makes interiority valid; "silent film" makes dialogue invalid.
2. **Have a built-in constraint or distortion.** The best frames are slightly uncomfortable.
3. **Be orthogonal to the other frames.** Don't add "novelist" if you already have "method actor" — they overlap too much.
4. **Fit in one sentence.** If the vantage prompt needs a paragraph, it's two frames.

Add frames to `src/frames.ts` with a unique `id`, a `label`, a `prompt` (the system-prompt fragment), and `tags`. The orchestrator picks a subset per run, so frames should work independently — no frame should require another frame's output to make sense.

## Frame taxonomy

| Tag | Meaning | When to use |
|---|---|---|
| `story` | Narrative structure, character, plot, worldbuilding | Story-shaped prompts |
| `craft` | Form, voice, technique, constraint, structure | Craft-shaped prompts |
| `general` | Works across story and craft | Mixed prompts |
| `wild` | Deliberately absurd, surreal, or rule-breaking | Always include one per run |

The `wild` tag is load-bearing. Without it, the method drifts toward tasteful, competent, boring. One wild frame per run is the minimum viable weirdness.
