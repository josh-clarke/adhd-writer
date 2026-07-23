<p align="center">
  <a href="https://github.com/josh-clarke/adhd-writer">
    <img src="docs/hero.png" alt="ADHD Writer — a skill for creative agents" width="100%">
  </a>
</p>

# ADHD Writer — a skill for creative agents

[![CI](https://github.com/josh-clarke/adhd-writer/actions/workflows/ci.yml/badge.svg)](https://github.com/josh-clarke/adhd-writer/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/adhd-writer.svg)](https://www.npmjs.com/package/adhd-writer)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](./documentation/install.md)

> **An architectural fix for premature convergence in creative ideation.**

Linear Chain-of-Thought anchors on whatever it says first. Tree-of-Thought widens the search but still walks a single shared context, so the anchoring persists across branches. **ADHD Writer treats this as an architectural problem, not a prompting one** — it spawns N isolated reasoning processes under deliberately distorted creative frames, with zero shared context during divergence, then runs a separate critic pass to score, cluster, prune traps, and deepen the survivors.

Reach for it on **story concepts, character design, plot structure, poetic form, narrative voice, creative constraints, worldbuilding, and any prompt of the shape *"give me a few ways to…"***.

Adapted from [ADHD](https://github.com/UditAkhourii/adhd) by Udit Akhouri — the original engineering-oriented divergent ideation skill. This fork re-frames the method for creative writing and ideation.

---

## Side-by-side: baseline vs ADHD Writer

One creative prompt, same model, two strategies.

> **Prompt.** *"A story about a lighthouse keeper who discovers the light is calling something."*

<table>
<tr>
<th width="50%">🟦 Baseline (single-shot)</th>
<th width="50%">🟧 ADHD Writer</th>
</tr>
<tr valign="top">
<td>

Walks through four **textbook** takes:

1. The lighthouse keeper is lonely and the light summons a ghost ship
2. The light is a metaphor for the keeper's own longing
3. A sea monster answers the light, destruction ensues
4. The keeper falls in love with the thing in the light

Lands on a **hybrid** — lonely keeper + mysterious creature + tragic romance. Sensible. The answer a competent writer gives in 30 seconds.

**What's missing:** no formal experimentation, no questioning of the "lighthouse = isolation" trope, no structural risk-taking, no acknowledgment that the prompt might not need a "creature" at all.

</td>
<td>

Spawns 6 isolated frames, surfaces a **wide set** of 30+ ideas across `dream-logic`, `constraint-box`, `unreliable-narrator`, `genre-hybrid`, `silent-film`, `collage-artist` clusters, then:

- ★ **Non-obvious pick:** *"The light is the lighthouse keeper's own heartbeat, amplified and projected — the 'something' answering is their own body, trying to get back in."* A body-horror / magical-realism hybrid where the keeper must choose between the light and their own pulse. No creature. No romance. Just a person at war with their own signal.
- Plus shortlist: the light is a language and the keeper is the only one who doesn't speak it; the lighthouse is a cage and the light is the lock; the "something" is the next lighthouse keeper, answering across time.
- **20 traps flagged with one-line reasons** — including the cute "the light is aliens" and "the keeper is dead and doesn't know it" ideas before they waste a draft.

</td>
</tr>
</table>

---

## Install

One command, auto-detects your agent (Claude Code, Cursor, Antigravity, Codex, Cline, Gemini CLI, Windsurf, and ~50 more):

```bash
npx skills add josh-clarke/adhd-writer
```

Then invoke explicitly with `/adhd-writer "your prompt"`, or let it auto-trigger on ideation intents.

### Hermes Agent quick path

Hermes Agent uses a different skill system. Install the SKILL.md directly into your Hermes skills directory:

```bash
mkdir -p ~/.hermes/skills/creative/adhd-writer
curl -fsSL https://raw.githubusercontent.com/josh-clarke/adhd-writer/main/skills/adhd-writer/SKILL.md \
  -o ~/.hermes/skills/creative/adhd-writer/SKILL.md
```

Restart Hermes. The skill will auto-load when you ask for creative ideation or invoke `/adhd-writer "your prompt"`.

### CLI and library

```bash
npm install -g adhd-writer     # CLI
npm install adhd-writer        # library
```

CLI and library installs, manual curl for other agents, and per-platform paths are in **[documentation/install.md](./documentation/install.md)**.

---

## Quickstart

```bash
adhd-writer "a story about a lighthouse keeper who discovers the light is calling something"
adhd-writer "name this character" --frames 3 --ideas 8 --top 2
```

```ts
import { run, renderText } from "adhd-writer";

const result = await run({ problem: "a poem about grief that doesn't mention death", framesPerRun: 5, topK: 3 });
console.log(renderText(result));
// result.shortlist · result.nonObviousPick · result.traps · result.deepened · result.clusters
```

Full reference: **[documentation/api.md](./documentation/api.md)**.

---

## How it works

A two-phase loop with a hard wall between the phases.

1. **Diverge.** Pick N creative frames. Spawn N parallel, **isolated** Agent calls — each sees the prompt plus one frame's vantage prompt, and a system prompt that forbids evaluation. Branches never see each other, so no anchoring.
2. **Focus.** A separate critic call scores every idea (`novelty / viability / fit`), flags traps with reasons, clusters by underlying angle, and deepens the top-K survivors into sketches with risks and first steps.

The generator-critic split is **mechanical** — separate LLM calls with opposite system prompts — not promised in one prompt. Deep dive: **[documentation/how-it-works.md](./documentation/how-it-works.md)**. How it differs from CoT and ToT: **[documentation/vs-cot-and-tot.md](./documentation/vs-cot-and-tot.md)**.

---

## The 18 creative frames

| Frame | What it does | Tags |
|---|---|---|
| **method actor** | Inhabit the character completely — posture, speech, fears. What do they want that they can't say? | story, craft |
| **genre surgeon** | Subvert tropes, hybridize genres, strip to load-bearing element and rebuild | story, craft |
| **child with crayons** | Absurd, impossible, full of wonder. Ignore logic and publishing conventions | general, wild |
| **hostile critic** | Attack the obvious take. What's cliché? Invert each attack into an idea | story, craft |
| **myth & ritual** | Steal archetypes, transformation patterns, taboo mechanics from folklore | story, wild |
| **dream logic** | Juxtaposition, emotional resonance, surreal transformation over causal logic | story, wild |
| **constraint box** | 100 words, second person, one room, no dialogue. Extreme constraints only | craft, wild |
| **sensory collage** | Textures, smells, sounds, temperatures. Build from sensory experience outward | story, craft |
| **inversion** | Brainstorm how to guarantee a boring story, then negate each answer back | story, craft, general |
| **flash fiction** | 100 words, one sitting. Strip to the bone. No backstory, no setup | story, general |
| **epic sprawl** | 10-book series, unlimited budget. Maximalist, sprawling, no constraints | story, wild |
| **remove the obvious** | Remove the hero, the conflict, the resolution. What story exists in that absence? | story, craft, wild |
| **collage artist** | Mash the prompt with a news headline, a recipe, a plumbing manual | general, wild |
| **unreliable narrator** | Lies, omissions, misremembering. What truths emerge through the cracks? | story, craft |
| **silent film** | No dialogue, no internal monologue. Pure visual narrative | story, craft |
| **the archaeologist** | Story told through artifacts — a letter, a bone, a photograph | story, wild |
| **the gossip** | Whispered over a fence, embellished with each retelling | story, general |
| **the translator** | Translate from another language, culture, time. What gets lost? What gains meaning? | story, craft |

---

## Results

Mean scores across 6 open-ended creative prompts (0–10), ADHD Writer vs a single-shot baseline at the same model, judged by an independent LLM with a skeptical-editor prompt, A/B order randomized.

| Dimension          | ADHD Writer | Baseline | Δ         | Ratio |
| ------------------ | ----------: | -------: | --------: | ----: |
| breadth            | **9.00**    | 4.83     | **+4.17** | 1.9×  |
| novelty            | **7.83**    | 2.67     | **+5.17** | 2.9×  |
| trap detection     | **9.50**    | 1.83     | **+7.67** | 5.2×  |
| actionability      | **9.50**    | 6.50     | **+3.00** | 1.5×  |
| writer usefulness  | **7.67**    | 6.83     | **+0.83** | 1.1×  |

**ADHD Writer wins 5 of 6 prompts.** Biggest gap is trap detection — baselines rarely name the seductive-but-broken ideas. Methodology, limitations, and how to reproduce: **[documentation/evals.md](./documentation/evals.md)**.

---

## Documentation

| Page | What's in it |
|---|---|
| [Quickstart](./documentation/quickstart.md) | First skill, CLI, and TypeScript runs with practical commands |
| [Install](./documentation/install.md) | Every install path — skill, CLI, library, per-platform |
| [How it works](./documentation/how-it-works.md) | The two-phase loop + architecture (context, pruning, orchestration) |
| [vs CoT & ToT](./documentation/vs-cot-and-tot.md) | Structural comparison, the three load-bearing differences, frames vs personas |
| [Frames](./documentation/frames.md) | The 18 creative frames, how selection works, how to author your own |
| [When to use](./documentation/when-to-use.md) | Use / don't use, why it shines on creative work, cost & speed |
| [CLI & API](./documentation/api.md) | CLI flags, library types, using ADHD Writer inside your own agent |
| [Evals](./documentation/evals.md) | Methodology, headline numbers, limitations, roadmap |

Also: [SKILL.md](./skills/adhd-writer/SKILL.md) (the runnable skill) · [SOURCE-SPEC.md](./SOURCE-SPEC.md) (original spec) · [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Attribution

This project is a fork of [ADHD](https://github.com/UditAkhourii/adhd) by **Udit Akhouri** — the original divergent ideation skill for coding agents. The core method (parallel isolated frames, generator/critic split, trap detection, deepening) is Udit's. This fork re-frames the method for creative writing and ideation.

Original preprint: [ADHD: Parallel Divergent Ideation for Coding Agents](https://adhdstack.github.io/)

---

## License

MIT License.

ADHD Writer operationalizes the *Divergent Ideation* source spec ([SOURCE-SPEC.md](./SOURCE-SPEC.md)). The runnable skill is at [`skills/adhd-writer/SKILL.md`](./skills/adhd-writer/SKILL.md).

---

## Contact

**Josh Clarke** — maintainer of the creative-writing fork.

Open to collaboration with writers, poets, screenwriters, and creative-AI researchers working on ideation, narrative structure, and agentic creativity.
