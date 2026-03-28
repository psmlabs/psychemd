# Contributing to PSYCHE

Thank you for considering contributing to PSYCHE! Every contribution helps make AI personality specification better for everyone.

## How to Contribute

### Reporting Bugs

- Use the [bug report template](/.github/ISSUE_TEMPLATE/bug_report.md)
- Include your PSYCHE config (sanitized) and the observed vs expected behavior

### Suggesting Features

- Use the [feature request template](/.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the use case, not just the solution

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run validation: `npm run validate`
5. Commit with a clear message: `git commit -m "feat: add new trait range"`
6. Push and open a PR

### Spec Changes

Changes to `spec/PSYCHE.md` require:
- A clear rationale in the PR description
- Backward compatibility analysis
- Updated examples if fields change
- Updated CHANGELOG entry

## Code Style

- Use ES module patterns where possible
- No semicolons (StandardJS style — just kidding, use them)
- Clear variable names over comments
- Functions should do one thing

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `spec:` specification changes
- `refactor:` code refactoring
- `test:` adding or updating tests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

PSM Labs
