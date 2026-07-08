# ADR-0025: Every Town Has A Specialty

## Status
Accepted

## Context
To build a compelling economy and prepare for future trading features (such as merchant shipping routes, arbitrage, and commodity markets), it is crucial that the game's hubs do not sell identical inventories. If every shop sold the same items, player progression would flatten, and there would be no mechanical incentive to return to previous islands.

## Decision
We decide that **Every Town Has A Specialty**. Shops will be fully data-driven, reading localized item arrays, stock limits, and price values from a central configuration manifest. 

- **Merchant Isles**: Focuses on commercial tools, ledgers, and standard shipping commodities.
- **Smuggler's Cove**: Focuses on keys, lockpicks, and illicit rare cosmetics.
- **Jungle of Queries**: Focuses on survival tools, flora, and ancient artifacts.

## Consequences
- **Short Term**: We implement a generic, data-driven `<Shop>` component that renders custom inventory based on the active port configurations.
- **Long Term**: Lays the foundation for a dynamic merchant trading economy, price fluctuation dynamics, and reputation-based shop discounts without requiring code updates.
