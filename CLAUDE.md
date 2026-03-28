# Bartender.js

Accessible off-canvas bar library for the web. Supports multiple bars on any side of the viewport. Published as `@fokke-/bartender.js` on npm.

- Homepage: https://bartender.fokke.fi
- Repository: https://github.com/Fokke-/bartender.js

## Tech stack

- TypeScript (strict mode, ESNext target)
- Vite (library mode, outputs ES + UMD to `dist/`)
- SCSS for styles
- pnpm as package manager

## Commands

- `pnpm dev` - Dev server
- `pnpm build` - Build library
- `pnpm lint` - ESLint (`src/` and `tests/`)
- `pnpm format` - Prettier (whole project)
- `pnpm test` - Build library and run tests (Vitest + Playwright browser)
- `pnpm test:watch` - Build library and run tests in watch mode

## Project structure

- `src/lib/` - Library source (Bartender, BartenderBar, events, utils, types)
- `src/index.ts` - Public API exports
- `src/main.ts` - Dev entry point
- `src/assets/` - SCSS styles

## Code style

- Prettier: no semicolons, single quotes, trailing commas, 2-space indent, 80 char width
- ESLint: Vue/TS config, `any` allowed, unused vars prefixed with `_`
- Tests: Vitest with @vitest/browser + Playwright (headless Chromium), tests in `tests/` target built `dist/`

## Conventions

- Always format code with Prettier (`pnpm format`) after making changes
- Never create git commits. `git add` is allowed when the user requests it.
- Pre-commit hook (Husky) runs `tsc --noEmit` and lint-staged (ESLint + Prettier) on commit
- Always use exact versions when installing npm packages (no `^` or `~` prefixes)

## Git workflow

- `master` is the main/release branch
- `dev` is the development branch
