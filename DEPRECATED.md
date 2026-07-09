# DEPRECATED — orchestra

**This repo is deprecated as of 2026-07-08.**

## Reason

Orchestra was an **LLM orchestration platform** — "coordinate multiple LLMs like a symphony conductor," positioned as "Kubernetes for LLMs" with consensus building, structured debates, provider-agnostic support (OpenAI + Claude + Gemini), and automatic failover. Its multi-LLM orchestration intent was subsumed by the agent-orchestration work now living in **`caia`** (Conductor engine, `@caia/architect-kit`, `@caia/chain-runner`, `@caia/claude-spawner`, `@caia/critic`, etc.).

While Orchestra was pitched as multi-provider (Anthropic + OpenAI + Google), CAIA is Claude-first — a deliberate narrowing. If a public/multi-provider positioning matters again in the future, the reference implementation to look at is `caia`'s primitives, not this repo's older code.

## Superseded by

- **`prakashgbid/caia`** — the multi-agent AI software-development platform (private, Claude-first).
- Sibling repos in the same space also being archived/paused: `sats-agents-system` (multi-LLM alliance, MIT), `omnimind` (OSA autonomous AI experiment), `app-development-platform` (6-day sprint framework).

## Historical value

Left archived read-only for reference. The consensus-building + structured-debate framing may be interesting reading; the code is not something to build from today.

---

*Deprecated 2026-07-08 as part of the non-Stolution pause pass.*
