---
name: adhd-writer
description: Parallel divergent ideation for creative writing and ideation. Spawns N isolated branches under different creative frames (method actor, dream logic, genre surgeon, unreliable narrator, constraint box), scores, clusters, prunes traps, and deepens top survivors. Use on /adhd-writer, brainstorm/ideate intents, or open-ended story, poem, script, essay, and creative-concept decisions. Skip for grammar fixes, factual lookups, single-line rewrites, or closed phrasing ("quick", "standard", "just fix this"). Full pre-flight gate is in the skill body.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [creative-writing, ideation, brainstorming, divergent-thinking, storytelling, poetry, screenwriting, adhd]
    related_skills: [writing-plans, subagent-driven-development]
---

# ADHD Writer

Stop picking the first story idea. The first three takes the model would give are the takes any competent writer would give in thirty seconds. Competent. Forgettable. The interesting ideas live past number three, in the awkward middle nobody walks into. This skill makes the model walk there.

## Pre-flight (run before Phase 1)

This skill is expensive. About 10 Agent calls, 30 to 90 seconds wall clock, 5 to 10x a single answer. Do not pay that cost when a direct answer is better. Run this gate before Phase 1.

**Step 1. Explicit invocation check.**

If the user typed `/adhd-writer` or explicitly asked for ADHD mode, "use the adhd-writer skill", or "run ADHD on this", **SKIP the rest of this section and go straight to Phase 1**. The user opted in. Do not second-guess.

**Step 2. Self-judge (only if Step 1 did not match).**

Ask yourself three questions. If the answer to any is no, ABORT.

1. **Open-ended?** Would a skilled writer give multiple viable takes here, or is there one canonical answer? If canonical, abort.
2. **High-stakes?** Is the cost of the obvious take being wrong actually high? A novel's central conceit, a screenplay's act structure, a poem's core metaphor, a brand's voice = yes. A text message at 11pm = no.
3. **Open phrasing?** Did the user avoid words like "quick", "standard", "just fix", "polish this", "one-line"? If they used any of those, they want the direct answer. Abort.

If all three checks pass, proceed to Phase 1.

If any fails, ABORT and answer the question directly. Optionally append one sentence: *"If you want a wider exploration under parallel creative frames with explicit trap detection, run `/adhd-writer <your prompt>`."*

## The loop

Two strict phases. Mixing them kills idea quality, because the critic strangles the generator.

### Phase 1 — Diverge (no critic)

For the prompt P:

1. Pick 5 creative frames from the table below. Bias toward `story` or `craft` tags when the prompt is narrative-shaped. Always include at least one `wild` frame to keep range.

2. Spawn 5 **parallel** Agent/Task tool calls. One per frame. Each Agent gets only:
   - the prompt P
   - any context the user provided
   - the chosen frame's vantage prompt
   - a system instruction that forbids evaluation

   The exact instruction to give each Agent:

   > You are in DIVERGENT mode. You are a generator, not a critic.
   > Generate 6 short distinct ideas under this frame. Each idea is one
   > phrase or one sentence. Do not evaluate. Do not rank. Do not hedge.
   > The first three obvious takes everyone would give are banned.
   > Push past them into the awkward middle.
   > Output a JSON array only. No prose before or after.
   > `[{"text": "...", "rationale": "..."}, ...]`

3. **Critical invariant.** The Agent calls must be parallel and isolated.
   Do NOT serialize them. Do NOT pass one branch's output as context to
   another. Branches that see each other anchor each other and the whole
   method collapses to a wider single thought.

### Phase 2 — Focus (critic on)

After all branches return:

1. **Score.** Rate each idea on three axes 0 to 10: novelty (distance from the obvious default take), viability (could it actually work as a story/poem/script/piece), fit (does it address the stated prompt). For any idea that looks attractive but is a trap (cliché, been-done-to-death, structurally broken, emotionally hollow), flag it with a one-line reason.

2. **Cluster.** Group ideas into 3 to 6 clusters by their underlying angle, not by surface keywords. Label clusters by angle: "unreliable-narrator plays", "constraint-box plays", "dream-logic plays", "genre-hybrid plays".

3. **Deepen the top 3.** Rank by weighted score (novelty 0.35 + viability 0.40 + fit 0.25), exclude traps, take top 3. For each, spawn one Agent call that produces:
   - a 4 to 8 sentence sketch of how the idea works as a piece of writing
   - the load-bearing risk (where it could fall apart emotionally or structurally)
   - the first concrete step a writer would take (a scene, a voice test, a structural outline)
   - 3 to 5 child ideas (variations, hybrids, unlocks)

   Deepen Agent instruction:

   > You are in FOCUS mode. Take one promising idea and connect dots.
   > Sketch how it would actually work as a piece of writing in 4 to 8
   > sentences. Name the load-bearing risk. Name the first concrete step
   > a writer would take. Then generate 3 to 5 sub-ideas that branch off
   > (variations, combinations with other genres/forms, things this unlocks).
   > Output JSON only.

## Frames

Pick 5 per run.

| Frame | Vantage prompt | Tags |
|---|---|---|
| **method actor** | You are a method actor preparing for a role. Inhabit the character completely — their posture, their speech patterns, their fears. What does the world look like through their eyes? What do they want that they can't say aloud? Generate ideas from inside that skin. | story, craft |
| **genre surgeon** | You dissect genres for a living. Take the tropes, conventions, and reader expectations of this genre and either subvert them brutally, hybridize two genres that shouldn't mix, or strip the genre down to its load-bearing element and rebuild from there. | story, craft |
| **child with crayons** | You are a child with a box of crayons and no rules. Draw the story as you see it — absurd, impossible, full of wonder and nonsense. Ignore logic, physics, and publishing conventions. What would make a 7-year-old gasp? | general, wild |
| **hostile critic** | You are a vicious critic who has read everything and hates everything. Attack the obvious take on this story/prompt. What's cliché, what's been done to death, what would make you throw the book across the room? Then invert each attack into an idea that avoids those traps. | story, craft |
| **myth & ritual** | Reach into myth, folklore, fairy tales, and ritual structures. Steal archetypes, transformation patterns, taboo-and-transgression mechanics, or the monomyth's hidden gears. Force-fit them onto this prompt. | story, wild |
| **dream logic** | Abandon causal logic. In dreams, meaning comes from juxtaposition, emotional resonance, and surreal transformation. Generate ideas that follow dream logic — where a door can be a mouth, a memory can be a room, and grief can wear a hat. | story, wild |
| **constraint box** | You thrive under brutal constraints. What if this story could only use 100 words? Could only be told in second person? Had to happen in one room in real time? No dialogue allowed? Pick an extreme constraint and generate ideas that only exist inside it. | craft, wild |
| **sensory collage** | You think in textures, smells, sounds, and temperatures — not plot. What does this story feel like on the skin? What does it smell like at 3am? Build ideas from pure sensory experience outward to narrative. | story, craft |
| **inversion** | Ask the OPPOSITE question. If the goal is a compelling story, brainstorm how to guarantee a boring, broken, or unreadable one. Then negate each answer back into a viable idea. The villain's plan becomes the hero's arc, the ending becomes the opening. | story, craft, general |
| **flash fiction** | You have 100 words and one sitting. No backstory, no setup, no explanation. What is the crudest, most essential version of this story that still lands an emotional punch? Strip to the bone. | story, general |
| **epic sprawl** | You have unlimited time, unlimited budget, and a 10-book series deal. What is the maximalist, sprawling, no-constraints version of this story? What would only be possible at that scale? | story, wild |
| **remove the obvious** | Name the thing everyone assumes this story needs — the hero, the conflict, the resolution, the setting, the genre convention. Imagine it's gone. What story exists in that absence? | story, craft, wild |
| **collage artist** | You work in collage — cutting up existing texts, images, and ideas and recombining them into something new. What if you mashed this prompt with a news headline, a scientific paper, a recipe, or a plumbing manual? Force the collision. | general, wild |
| **unreliable narrator** | You are an unreliable narrator. You lie, you omit, you misremember, you have an agenda. How does this story change when told by someone who can't be trusted? What truths emerge only through the cracks in their account? | story, craft |
| **silent film** | No dialogue. No internal monologue. Only images, actions, and objects. How does this story unfold as pure visual narrative? What does the audience infer that the characters never say? | story, craft |
| **the archaeologist** | You are an archaeologist uncovering this story layer by layer. You find fragments — a letter, a bone, a photograph, a tool — and must reconstruct the whole. What story is told through its artifacts rather than its events? | story, wild |
| **the gossip** | You are the town gossip. You know everyone's secrets, everyone's business, and you love to talk. How does this story sound when whispered over a fence, embellished with each retelling? What version of the truth survives? | story, general |
| **the translator** | You are translating this story from another language, another culture, another time. What gets lost in translation? What gains new meaning? How does the story bend when forced through a different linguistic and cultural lens? | story, craft |

### Picking frames

For story-shaped problems: pick 4 frames tagged `story` or `craft`, plus 1 tagged `wild`. For open creative or conceptual problems: a mix from all tags. Vary the picks across sessions so the same prompt produces different candidate sets when re-run.

## Output shape

After Phase 2, render in this order. Do not collapse it into a wall of prose. The structure is the point.

1. **Brief.** One or two lines confirming the prompt and any reframe used.
2. **Wide set.** Full pool grouped by cluster. Each cluster labeled by underlying angle. Each idea is one short phrase. Show score chips like `[N7 V8 F9]` next to each.
3. **Converge.** A 2 to 4 idea shortlist. State why each is on the list. Mark the non-obvious-but-viable pick explicitly with ★. List traps separately, each with the one-line reason it is a trap.
4. **Focus.** The 3 deepened branches. For each: the sketch, the load-bearing risk, the first concrete step, and the child ideas.
5. **Provocation.** One wildcard question or idea that opens a new direction the user can push into if nothing landed.

## Anti-patterns

These are how this skill goes wrong. Watch for them.

- **Convergence disguised as divergence.** Ten minor variations of one idea is not breadth. If every candidate shares the same underlying assumption, you have not diverged. You have decorated.
- **Weird-for-weird's-sake with no convergence.** A pile of 30 unsorted absurdities is as useless as one safe answer. Always converge.
- **Walls of equally-weighted prose.** Cluster, label, pull out the best. Structure is half the value.
- **Refusing to commit.** After diverging, take a position on what is actually promising. "Here are 20 ideas, you decide" is a cop-out. Generate wide, but converge with a real opinion.
- **Skipping the isolation invariant.** If you simulate parallel branches by writing them sequentially in one context, you have not done ADHD. You have done a wider single thought. The Agent/Task tool gives each branch a fresh context. Use it.

## Calibration

- **How many ideas?** Scale to stakes. Quick "name this character" = 3 frames × 4 ideas. "What should this novel be about" = 5 frames × 8 ideas. Default is 5 × 6 = 30.
- **How weird?** Read the room. Serious literary work: flag the wild cards clearly so they do not read as unserious. Open brainstorming or play: let it run loose. Absurd ideas earn their place by seeding viable ones.
- **When to stop diverging?** Stop when new candidates start repeating the shape of existing ones. The space is mapped. Do not pad to hit a number.

## Cost

5 diverge + 1 score + 1 cluster + 3 deepen ≈ 10 Agent calls per run. About 5 to 10x a single-shot answer. Not for every keystroke. For decision points where the cost of the obvious take is high.

## Hermes Agent execution notes

When running inside Hermes Agent (not Claude Code), the `Agent` / `Task` tool maps to `delegate_task`. Key adaptations:

- **Parallel isolation:** Use `delegate_task` with `role='leaf'` for each frame. Each subagent gets a fresh context — no cross-talk. Batch all 5 calls in one `tasks` array for true parallelism.
- **No tools in divergence:** The `delegate_task` tool does not accept a `tools` parameter, so the subagent inherits the parent's toolset. Instruct the subagent explicitly in the prompt: "Do not use any tools. Generate text only."
- **JSON output:** Hermes subagents return summaries, not raw JSON. Instruct the subagent to output ONLY the JSON array, and parse it from the returned text.
- **Convergence:** The score/cluster/deepen steps can run in the parent context (no isolation needed) or as a single `delegate_task` with the full idea pool.
- **Cost control:** Hermes `delegate_task` max_concurrent_children defaults to 3. For 5 frames, batch as [3, 2] or use `terminal` with `npx adhd-writer` for the CLI version.

## Companion library and CLI

There is a Node/TS implementation that does the same loop with structured JSON parsing, score weighting, and a CLI. Use it when running outside an agent or in batch.

    npm install -g adhd-writer
    adhd-writer "a story about a lighthouse keeper who discovers the light is calling something"

Code, paper, evals, and contributing guide at https://github.com/josh-clarke/adhd-writer. The skill above gives you the same loop inside an agent with no install required.

## Source spec

This skill operationalises a written spec on divergent ideation. The original prose is preserved in `SOURCE-SPEC.md` for reference. The implementation choices made here (parallel isolated Agent calls, mechanical generator/critic split, frame-based branching) follow from that spec.
