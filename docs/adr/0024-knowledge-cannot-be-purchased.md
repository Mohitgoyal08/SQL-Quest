# ADR-0024: Knowledge Cannot Be Purchased

## Status
Accepted

## Context
Educational items (such as SQL scrolls, syntactic reference guides, and syntax cheat sheets) represent the primary reward vector for player learning milestones. Allowing players to purchase these knowledge assets with gold would devalue the progression loops of challenge completion and bypass key learning moments.

## Decision
We establish a rule that **Knowledge Cannot Be Purchased**. All items that directly explain, index, or teach SQL syntax must be unlocked exclusively as challenge rewards or story progression milestones. 

Shops will be restricted to selling utility tools (e.g., calculators, lens attachments), cosmetic upgrades (e.g., ship colors, icons), keys, or lore consumables.

## Consequences
- **Short Term**: The `sql_scroll` (SQL Scroll) is removed from the Merchant Isles shop registry and is obtainable only as a reward.
- **Long Term**: Preserves the core educational value of the game. Keeps the SQL challenges as the singular gate for technical progression.
