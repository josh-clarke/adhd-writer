---
name: adhd-writer
description: Parallel divergent ideation for creative writing and ideation. Spawns N isolated branches under different creative frames (method actor, dream logic, genre surgeon, unreliable narrator, constraint box), scores, clusters, prunes traps, and deepens top survivors. Use on /adhd-writer, brainstorm/ideate intents, or open-ended story, poem, script, essay, and creative-concept decisions. Skip for grammar fixes, factual lookups, single-line rewrites, or closed phrasing ("quick", "standard", "just fix this"). Full pre-flight gate is in the skill body.
version: 1.1.0
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

This skill is expensive. About 12 Agent calls, 30 to 90 seconds wall clock, 5 to 10x a single answer. Do not pay that cost when a direct answer is better. Run this gate before Phase 1.

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

1. Select frames. **Minimum 6 per run.** Three frames are always included:

   - **hostile critic** — catches traps, clichés, and been-done-to-death ideas before they waste a draft
   - **child with crayons** — keeps divergence weird, stops the pool from collapsing into tasteful competence
   - **inversion** — finds the blind spot by asking what makes it NOT work, then negating back

   Fill the remaining 3+ slots from the selectable pool. Choose frames that both **enhance** the prompt (amplify its inherent strengths, dig deeper into its territory) and **contrast** it (pull in the opposite direction, import foreign logic). If the prompt is interior and emotional, add structural frames (constraint box, silent film). If it's plot-heavy, add sensory and voice frames (sensory collage, unreliable narrator). If it's grounded realism, add a wild frame (dream logic, myth & ritual). Vary picks across sessions.

   When presenting the selection to the user, always offer 2-3 **alternative frame suggestions** they could swap in. Example: *"I'm running method-actor, genre-surgeon, and dream-logic for the selectable slots. If you want, you could swap dream-logic for unreliable-narrator (more grounded) or remove-the-obvious (more structural)."*

2. Spawn 6 **parallel** Agent/Task tool calls. One per frame. Each Agent gets only:
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

After all branches return, the synthesis step runs. **This can be you (the orchestrator/parent agent) — it does not need to be an isolated branch.** The synthesis reads all divergence outputs, but since it runs AFTER divergence is complete, there is no anchoring risk. The critic seeing all ideas is the whole point.

If running via Kanban, the synthesis task can be assigned to the orchestrator's profile or any profile you trust for judgment. It does not need the same model diversity as the divergence phase — one good model is fine here.

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

Minimum 6 per run. Three are always on. The rest are selected to enhance and contrast the prompt.

**Always on (backbone of every run):**

| Frame | Why it's always on | Tags |
|---|---|---|
| **hostile critic** | Catches traps and clichés before they waste a draft. Every prompt benefits from having its obvious take attacked. | story, craft |
| **child with crayons** | Keeps divergence weird. Stops the pool from collapsing into tasteful competence. The wild card that's always in the deck. | general, wild |
| **inversion** | Finds the blind spot. Asks what makes it NOT work, then negates back. Every prompt has an inversion worth finding. | story, craft, general |

**Selectable pool (choose 3+ to fill remaining slots):**

| Frame | Vantage prompt | Tags |
|---|---|---|
| **method actor** | You are a method actor preparing for a role. Inhabit the character completely — their posture, their speech patterns, their fears. What does the world look like through their eyes? What do they want that they can't say aloud? Generate ideas from inside that skin. | story, craft |
| **genre surgeon** | You dissect genres for a living. Take the tropes, conventions, and reader expectations of this genre and either subvert them brutally, hybridize two genres that shouldn't mix, or strip the genre down to its load-bearing element and rebuild from there. | story, craft |
| **myth & ritual** | Reach into myth, folklore, fairy tales, and ritual structures. Steal archetypes, transformation patterns, taboo-and-transgression mechanics, or the monomyth's hidden gears. Force-fit them onto this prompt. | story, wild |
| **dream logic** | Abandon causal logic. In dreams, meaning comes from juxtaposition, emotional resonance, and surreal transformation. Generate ideas that follow dream logic — where a door can be a mouth, a memory can be a room, and grief can wear a hat. | story, wild |
| **constraint box** | You thrive under brutal constraints. What if this story could only use 100 words? Could only be told in second person? Had to happen in one room in real time? No dialogue allowed? Pick an extreme constraint and generate ideas that only exist inside it. | craft, wild |
| **sensory collage** | You think in textures, smells, sounds, and temperatures — not plot. What does this story feel like on the skin? What does it smell like at 3am? Build ideas from pure sensory experience outward to narrative. | story, craft |
| **flash fiction** | You have 100 words and one sitting. No backstory, no setup, no explanation. What is the crudest, most essential version of this story that still lands an emotional punch? Strip to the bone. | story, general |
| **epic sprawl** | You have unlimited time, unlimited budget, and a 10-book series deal. What is the maximalist, sprawling, no-constraints version of this story? What would only be possible at that scale? | story, wild |
| **remove the obvious** | Name the thing everyone assumes this story needs — the hero, the conflict, the resolution, the setting, the genre convention. Imagine it's gone. What story exists in that absence? | story, craft, wild |
| **collage artist** | You work in collage — cutting up existing texts, images, and ideas and recombining them into something new. What if you mashed this prompt with a news headline, a scientific paper, a recipe, or a plumbing manual? Force the collision. | general, wild |
| **unreliable narrator** | You are an unreliable narrator. You lie, you omit, you misremember, you have an agenda. How does this story change when told by someone who can't be trusted? What truths emerge only through the cracks in their account? | story, craft |
| **silent film** | No dialogue. No internal monologue. Only images, actions, and objects. How does this story unfold as pure visual narrative? What does the audience infer that the characters never say? | story, craft |
| **the archaeologist** | You are an archaeologist uncovering this story layer by layer. You find fragments — a letter, a bone, a photograph, a tool — and must reconstruct the whole. What story is told through its artifacts rather than its events? | story, wild |
| **the gossip** | You are the town gossip. You know everyone's secrets, everyone's business, and you love to talk. How does this story sound when whispered over a fence, embellished with each retelling? What version of the truth survives? | story, general |
| **the translator** | You are translating this story from another language, another culture, another time. What gets lost in translation? What gains new meaning? How does the story bend when forced through a different linguistic and cultural lens? | story, craft |

### Picking the selectable frames

The goal is to **enhance and contrast** the prompt. If the prompt is interior and emotional, add structural frames (constraint box, silent film). If it's plot-heavy, add sensory and voice frames (sensory collage, unreliable narrator). If it's grounded realism, add a wild frame (dream logic, myth & ritual). If it's high-concept, add a stripping frame (flash fiction, remove the obvious).

**Always offer alternatives.** When presenting your selection, list 2-3 frames the user could swap in. Example: *"Running method-actor, genre-surgeon, dream-logic. Could swap dream-logic for unreliable-narrator (more grounded) or remove-the-obvious (more structural)."*

## Output shape

After Phase 2, render in this order. Do not collapse it into a wall of prose. The structure is the point.

1. **Brief.** One or two lines confirming the prompt and any reframe used. List the frames selected and note which were always-on vs chosen.
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
- **Skipping the always-on frames.** The critic, crayons, and inversion are non-negotiable. If you drop one to save cost, you've broken the method's backbone. Reduce the selectable pool first.

## Calibration

- **How many ideas?** Scale to stakes. Quick "name this character" = 6 frames × 4 ideas. "What should this novel be about" = 6 frames × 8 ideas. Default is 6 × 6 = 36.
- **How weird?** Read the room. Serious literary work: flag the wild cards clearly so they do not read as unserious. Open brainstorming or play: let it run loose. Absurd ideas earn their place by seeding viable ones.
- **When to stop diverging?** Stop when new candidates start repeating the shape of existing ones. The space is mapped. Do not pad to hit a number.
- **How many frames?** Minimum 6 (3 always-on + 3 selectable). For high-stakes work, run 8-10. Never drop below 6. Never drop the always-on three.

## Cost

6 diverge + 1 score + 1 cluster + 3 deepen ≈ 11 Agent calls per run. About 5 to 10x a single-shot answer. Not for every keystroke. For decision points where the cost of the obvious take is high.

## Hermes Agent execution notes

When running inside Hermes Agent (not Claude Code), the `Agent` / `Task` tool maps to two execution paths. Choose based on whether you want model diversity or simplicity.

### Path A: `delegate_task` (simple, single-model)

Use when all frames should run on the same model (your current session model).

- **Parallel isolation:** Use `delegate_task` with `role='leaf'` for each frame. Each subagent gets a fresh context — no cross-talk. Batch calls in a `tasks` array for true parallelism. Note: `max_concurrent_children` defaults to 3, so batch 6 frames as two waves of 3, or raise the limit in config.
- **No tools in divergence:** The `delegate_task` tool does not accept a `tools` parameter, so the subagent inherits the parent's toolset. Instruct the subagent explicitly in the prompt: "Do not use any tools. Generate text only."
- **JSON output:** Hermes subagents return summaries, not raw JSON. Instruct the subagent to output ONLY the JSON array, and parse it from the returned text.
- **Synthesis = you.** The score/cluster/deepen steps run in the parent context (no isolation needed). You are the critic. You read all 6 branch outputs, score them, cluster them, and deepen the top 3 yourself. This is by design — the synthesis is not an isolated branch, it's the convergent judgment that follows divergence.

### Path B: Kanban fan-out (multi-model, durable)

Use when you want different frames to run on different models. Also use when the work should survive a crash or when you want an audit trail.

**How it works:** Create one Kanban task per frame, each assigned to a different worker profile. Each profile runs its own model. The dispatcher spawns them in parallel. A synthesis task collects results when all parents complete.

**Synthesis can be you.** The synthesis task does NOT need to be a separate isolated branch. It can be assigned to `default` (the orchestrator's profile) — the orchestrator reads all parent task outputs from the board and performs score/cluster/deepen in its own context. Since synthesis runs AFTER all divergence is complete, there is no anchoring risk. The critic seeing all ideas is the whole point. Alternatively, assign synthesis to a strong judgment model if you want it automated.

**Step 0 — Discover available profiles:**

```bash
hermes profile list
```

**Step 1 — Create divergence tasks (one per frame, 6 minimum):**

Write each frame's prompt to a temp file, then create tasks via CLI:

```bash
cat > /tmp/frame-hostile-critic.md << 'EOF'
You are in DIVERGENT mode. You are a generator, not a critic.
Generate 6 short distinct ideas under the HOSTILE CRITIC frame.

FRAME — HOSTILE CRITIC:
You are a vicious critic who has read everything and hates everything. Attack the obvious take on this story/prompt. What's cliché, what's been done to death, what would make you throw the book across the room? Then invert each attack into an idea that avoids those traps.

PROBLEM:
A story about a woman who inherits a house that doesn't want her to leave.

Generate 6 ideas under this frame.
Output JSON array only: [{"text": "...", "rationale": "..."}, ...]
Do not evaluate, hedge, or rank. Just generate.
EOF

hermes kanban create \
  "adhd-writer diverge: hostile-critic" \
  --assignee worker-glm \
  --body "$(cat /tmp/frame-hostile-critic.md)" \
  --json
```

**Suggested profile mapping (updated fleet):**

| Frame | Profile | Model | Provider | Why |
|---|---|---|---|---|
| hostile critic (always) | worker-glm | z-ai/glm-5.2 | zai | Fast, direct, good at finding flaws |
| child with crayons (always) | coder-xiaomi | xiaomi/mimo-v2.5 | openrouter | Experimental, good at absurd leaps |
| inversion (always) | worker-deepseek | deepseek-v4-flash | deepseek | Fast, follows inversion logic tightly |
| method actor | newsletter-writer | anthropic/claude-sonnet-5 | openrouter | Best prose quality for character interiority |
| genre surgeon | coder-deepseek | deepseek-v4-pro | deepseek | Strong analytical deconstruction |
| dream logic | coder-minimax | MiniMax-M3 | minimax | Creative, good at surreal associative leaps |
| constraint box | worker-deepseek-2 | deepseek-v4-flash | deepseek | Fast, follows rules tightly |
| sensory collage | worker-minimax | MiniMax-M3 | minimax | Strong sensory language |
| unreliable narrator | newsletter-writer | anthropic/claude-sonnet-5 | openrouter | Best at voice and subtext |
| silent film | coder-minimax | MiniMax-M3 | minimax | Visual storytelling |
| myth & ritual | coder-deepseek | deepseek-v4-pro | deepseek | Deep knowledge retrieval |
| synthesis (you) | default | z-ai/glm-5.2 | openrouter | Orchestrator judges and converges |

**Step 2 — Synthesis (you, not a separate task):**

When all 6 divergence tasks complete, collect their outputs:

```bash
# Read each task's output
for id in t_xxx t_yyy t_zzz t_aaa t_bbb t_ccc; do
  hermes kanban show $id --json | jq -r '.runs[-1].summary'
done
```

Then run score/cluster/deepen yourself in the orchestrator context. You are the critic. You do not need a separate Kanban task for this unless you want the synthesis automated — in which case assign it to `default` with all 6 parents.

**Step 3 — Monitor:**

```bash
hermes kanban list
```

**Key adaptations for Kanban:**

- **No isolation violation:** Each Kanban task is a separate process with its own profile, model, and context. True isolation — stronger than `delegate_task` because even the model differs.
- **JSON in comments:** Workers post results as task comments. Read them via `hermes kanban show <id> --json`.
- **Durability:** If a worker crashes, the task stays in `ready` and the dispatcher respawns it.
- **Audit trail:** Every idea persists in the Kanban SQLite DB forever.
- **Model diversity:** Each frame runs on the model best suited to its cognitive style. This is the killer feature — you can't do this with `delegate_task`.
- **GLM on Z.AI direct:** GLM workers now use the Z.AI provider directly (not OpenRouter), which should be more reliable for Kanban protocol. If a GLM worker still crashes on Kanban, reassign to `worker-deepseek-2` or fall back to `delegate_task(background=true)`.
- **MiniMax on direct provider:** MiniMax workers use the MiniMax provider directly.

**When to choose which path:**

| Scenario | Path |
|---|---|
| Quick ideation, same model is fine | `delegate_task` |
| Want different models per frame | Kanban |
| Long-running, might crash | Kanban |
| Need audit trail for decisions | Kanban |
| User wants to watch/interject mid-process | Kanban |
| CI/batch pipeline | Kanban |
| One-shot creative brainstorm | `delegate_task` |

**Fallback:** If Kanban feels too heavy for a quick brainstorm, use `delegate_task` with the batch pattern. If a worker profile crashes on Kanban protocol, reassign to `default` or fall back to `delegate_task(background=true)`.

## Companion library and CLI

There is a Node/TS implementation that does the same loop with structured JSON parsing, score weighting, and a CLI. Use it when running outside an agent or in batch.

    npm install -g adhd-writer
    adhd-writer "a story about a lighthouse keeper who discovers the light is calling something"

Code, paper, evals, and contributing guide at https://github.com/josh-clarke/adhd-writer. The skill above gives you the same loop inside an agent with no install required.

## Source spec

This skill operationalises a written spec on divergent ideation. The original prose is preserved in `SOURCE-SPEC.md` for reference. The implementation choices made here (parallel isolated Agent calls, mechanical generator/critic split, frame-based branching) follow from that spec.
