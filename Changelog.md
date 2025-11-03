## v3.0.0 - 2025-10-18

v3.0.0 is a complete rewrite focused on new functionality, performance, and a clearer architecture. We migrated to a feature-based structure that cleanly separates app composition, domain features, and shared building blocks. UI has been modernized to introduce new features a powerful Search bar, and personalization is now first-class with a drag and drop funtionality to re-order items toggleable features and flexible theme system. 

The bookmarks domain was refactored into functional APIs with a cross‑browser factory, and drag‑and‑drop ordering is more predictable. Across the board, we consolidated styling with Tailwind, simplified imports, and adopted Biome for consistent linting/formatting. This release lays a strong foundation for future features while keeping the codebase maintainable and testable.

### Features
- New Search functionality in the header, with the ability to enable/disable it via settings.
- Deterministic drag‑and‑drop ordering and improved bookmark rendering in list/grid modes.
- Greeting personalization overhaul: toggle visibility and enablement; cleaner UI states.
- Expanded theme system with multiple presets and a "build your own" theme option.
- Feature‑based architecture under `src/` (`app/`, `features/`, `shared/`, `styles/`).
- Reworked settings from modal to right‑aligned flyout menu for faster, non‑blocking configuration.
- Refactored Bookmarks into function‑based APIs (`getBookmarksData`, `create`, `update`, `remove`, `move`, `get`, `search`, `getFaviconUrl`, ordering helpers).
- Browser API factory (`createBookmarkAPI`) for Chrome/Firefox/mock parity.

### Fixes
- Improvements to displaying long names and placement

### Other
- Migrated build/test stack to Vite, Vitest, Testing Library, and MSW.
- Migrated linting/formatting to Biome; removed ESLint/Prettier configs and dependencies.
