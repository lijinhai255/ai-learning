# Repository Guidelines

## Project Structure & Module Organization

This repository is currently an empty scaffold; no source, test, asset, or build directories are present yet. As the project grows, keep the layout predictable:

- `src/` — production code, grouped by feature or domain.
- `tests/` — automated tests mirroring the `src/` structure.
- `assets/` — static files such as fixtures, images, and sample data.
- `docs/` — design notes and user-facing documentation.

Keep modules cohesive, expose public interfaces from a small entry point, and avoid committing generated output or local environment files.

## Build, Test, and Development Commands

No build system or test runner is configured yet. When adding one, document the canonical commands in this section and in the project README. Prefer a small, reproducible command set such as:

- `make build` — create production artifacts.
- `make test` — run the complete automated test suite.
- `make format` — apply the repository formatter.
- `make lint` — run static analysis and style checks.

Commands should work from the repository root and should not require undeclared global tools.

## Coding Style & Naming Conventions

Use the formatter and linter selected for the implementation language; formatting should be deterministic and enforced in CI. Use four spaces for indentation unless the language ecosystem requires another standard. Name files and directories with lowercase `kebab-case`; use `PascalCase` for types/classes and `camelCase` for variables and functions where those conventions apply. Prefer clear, intention-revealing names over abbreviations.

## Testing Guidelines

Add tests with each behavior change. Place tests under `tests/`, mirror the production path, and use names that describe the behavior (for example, `test_handles_empty_input`). Include unit tests for core logic and integration tests for external boundaries. Record the required coverage threshold once a test framework is selected.

## Commit & Pull Request Guidelines

There is no Git history yet, so no established commit convention can be inferred. Use imperative, focused messages such as `Add input validation` and keep each commit logically scoped. Pull requests should explain the change, list verification commands and results, link related issues, and include screenshots or sample output for user-visible changes.

## Security & Configuration Tips

Keep secrets in local environment configuration, never in source control. Provide safe example configuration (for example, `.env.example`) and document required variables without including real credentials.
