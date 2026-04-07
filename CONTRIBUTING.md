# Contributing to simplicity-logging

Thanks for your interest. This library is intentionally tiny — nine lines of runtime code that wrap `console` with `LOG_LEVEL` support. Contributions should preserve that simplicity.

## Guiding principles

- **Zero runtime dependencies.** The published package must not pull anything into a consumer's `node_modules`.
- **Don't grow the API.** If a change adds a new export, configuration option, or import path, open an issue first to discuss whether it belongs here or in a separate package.
- **Behavioral tests only.** Tests spawn a real Node process, import the real module, and assert on real stdout/stderr. No mocks, no stubs, no globals.
- **Simplicity over cleverness.** The best change is usually the one that removes code.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm

### Setup

```sh
git clone https://github.com/mabulu-inc/simplicity-logging.git
cd simplicity-logging
pnpm install
```

### Running the test suite

```sh
pnpm test    # runs node --test against test/log-level.mjs
pnpm lint    # eslint
```

Both must pass before submitting a PR.

## Making a change

1. **Fork** the repo and create a branch off `main`.
2. **Write a failing test** in `test/log-level.mjs` that describes the behavior you want.
3. **Make the smallest change** to `index.mjs` that turns the test green.
4. **Run `pnpm test` and `pnpm lint`** — both must pass.
5. **Open a pull request** with a clear description of what changed and why.

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`. This keeps release notes readable.

## Release process (maintainers only)

Releases are automated via GitHub Actions + npm trusted publishing:

```sh
pnpm release:patch   # bug fixes
pnpm release:minor   # new backward-compatible features
pnpm release:major   # breaking changes
```

Each script bumps the version, tags the commit, pushes, and creates a GitHub release. The `publish.yml` workflow then publishes to npm via OIDC — no tokens required.

## Reporting issues

Open an issue at https://github.com/mabulu-inc/simplicity-logging/issues with:

- What you expected to happen
- What actually happened
- A minimal reproduction (Node version, `LOG_LEVEL` value, code snippet)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
