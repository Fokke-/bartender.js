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

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) and GitHub Actions for automated publishing.

### Creating a changeset

After making changes, create a changeset to document them:

```bash
pnpm changeset
```

Select the affected packages, bump type (patch/minor/major), and provide a description.

### Stable releases

Stable releases are automated via GitHub Actions:

1. Push changes with changesets to `master` (e.g. by merging a PR)
2. The release workflow automatically creates/updates a "Version Packages" PR that bumps versions and updates changelogs
3. Merge the "Version Packages" PR to publish the new versions to npm

### Beta releases

Beta releases are published automatically from the `beta` branch:

1. Create the `beta` branch from `dev`
2. Push changes with changesets to the `beta` branch
3. The beta release workflow automatically enters pre-release mode, versions packages, and publishes them to npm with the `beta` dist-tag

To install a beta version:

```bash
pnpm add @fokke-/bartender.js@beta
```
