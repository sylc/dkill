# Developer manual

## Commits

Commits type must be one of the following:

- build: Changes that affect the build system or external dependencies (example
  scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests

## Release

To release a new version run the below:

`deno task release`
