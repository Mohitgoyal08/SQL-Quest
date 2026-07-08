# ADR-0023: Testing Strategy

## Status
Accepted

## Context
Google Antigravity provides automated browser verification via the `browser_subagent`. However, the subagent's headless Chromium runner is optimized for Linux, resulting in platform environment constraints when running local browser tests on macOS and Windows hosts.

To bypass this and enable automated testing on all developer platforms, a local end-to-end testing library (such as Playwright or Puppeteer) would need to be installed and configured in the project's dependencies.

However, the core gameplay loop, navigation mechanics, and UI layouts are undergoing rapid iterations with each active design sprint. Implementing automated E2E tests at this stage would introduce high test-maintenance overhead and code churn, slowing down feature delivery.

## Decision
We will postpone the installation of Playwright and the creation of automated browser regression tests. 

Once the core gameplay loop reaches Alpha stability, we will execute a dedicated **Engineering Sprint** to establish a robust testing pipeline. This sprint will cover:
- **Playwright Setup**: Installing and configuring Playwright as a project dependency.
- **End-to-End Tests**: Creating test suites for core user flows (starting game, dialogs, challenges, and navigation).
- **Visual Regression Tests**: Implementing screenshot comparisons to catch visual regressions.
- **Verification Pipeline**: Creating an `npm run verify` script to automate pre-commit and post-sprint validation.

Until the Alpha milestone is reached, sprint verification will rely on production build checks (`npm run build`) and local manual playtesting.

## Consequences
- **Short Term**: Developers must perform manual validation of UI flows on their local dev servers.
- **Long Term**: Saves significant engineering resources by avoiding test code churn during gameplay prototyping. Guarantees a stable, high-value regression suite when the core mechanics stabilize.
