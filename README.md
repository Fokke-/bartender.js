# Bartender.js - Accessible off-canvas bars

Bartender is a library for creating accessible off-canvas bars. Any number of bars is supported, and they can be located on any side of the viewport.

[Click here for the documentation](https://bartender.fokke.fi).

## Packages

| Package                                    | Description  |
| ------------------------------------------ | ------------ |
| [`@fokke-/bartender.js`](packages/core)    | Core library |
| [`@fokke-/vue-bartender.js`](packages/vue) | Vue 3 plugin |

## Developing

Install dependencies:

```bash
pnpm install
pnpm exec playwright install chromium
```

Available commands:

- `pnpm dev:core` - Core dev server
- `pnpm dev:vue` - Vue dev server
- `pnpm build` - Build all packages
- `pnpm lint` - Lint source code
- `pnpm format` - Format code
- `pnpm test` - Build and run tests

## Publishing with changesets

1. Document changes: `pnpm changeset` (select packages, bump type, description)
2. Update versions: `pnpm changeset version` (updates package.json files and changelogs)
3. Publish to npm: `pnpm changeset publish` (publishes changed packages, creates git tags)
