## 3.1.0 (2025-11-22)

* feat: Add AI powered translation files (#204) ([cf2a905](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/cf2a905)), closes [#204](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/204)
* feat: Add i18n and Settings (#203) ([5f93b68](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/5f93b68)), closes [#203](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/203)
* style: fix tokyo theme colours ([a8b95cf](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/a8b95cf))
* style: Remove paddings to reduce the amount of blank spaces (#197) ([78832e6](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/78832e6)), closes [#197](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/197)
* style: simplify colours  (#201) ([5bcc0f3](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/5bcc0f3)), closes [#201](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/201)
* chore(deps-dev): bump the development-patch-updates group with 11 updates (#196) ([64541b5](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/64541b5)), closes [#196](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/196)
* chore: bump to 3.1.0 ([1886c7c](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/1886c7c))
* chore: Clean Code and best practices (#198) ([4fd812c](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/4fd812c)), closes [#198](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/198)
* chore: clean fixes (#200) ([6e80766](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/6e80766)), closes [#200](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/200)
* chore: fix spacings in header ([29acdd1](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/29acdd1))
* chore: Improve tests, simplify interfaces and dnd ordering to ensure consistency ([9ba3b51](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/9ba3b51))
* chore: remove old implementation (#202) ([8d78835](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/8d78835)), closes [#202](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/202)
* fix: Address incompatibility with root folders when using other locales (#186) ([ee14a51](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/ee14a51)), closes [#186](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/186)
* fix: Implement height aware masonry (#199) ([380c107](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/380c107)), closes [#199](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/199)
* ci: Improve dependabot (#194) ([a8352a7](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/a8352a7)), closes [#194](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/194)
* ci: Improvements (#188) ([420cd25](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/420cd25)), closes [#188](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/188)
* ci: Update dependabot configuration for version updates ([1ad789b](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/1ad789b))
* ci: Update dependabot.yml to exclude security dependencies (#195) ([f9cc44a](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/f9cc44a)), closes [#195](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/195)
* Refactor Dependabot configuration for update types ([fbff43d](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/fbff43d))

## <small>3.0.1 (2025-11-14)</small>

* revert: Blank commit to trigger ci workflow on manual revert (#187) ([fe867ec](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/fe867ec)), closes [#187](https://github.com/alexbaeza/better-bookmarks-page-extension/issues/187)

## 3.0.0 (2025-11-04)

* release: 3.0.0 Update changelog ([d607fcf](https://github.com/alexbaeza/better-bookmarks-page-extension/commit/d607fcf))

## 3.0.0 (2025-11-04)

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
