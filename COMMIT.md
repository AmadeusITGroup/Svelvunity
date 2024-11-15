# Commit Guidelines

To ensure clarity and consistency in our repository, all commits should adhere to the following guidelines, inspired by <a href="https://www.conventionalcommits.org/en/v1.0.0/" target="_blank">conventional commits</a>.

## Structure

Each commit message should follow this format:

> \<type\>(\<optional scope\>): \<description\>

For example:

> feat(progress): Add progress component

Refer to the <a href="https://www.conventionalcommits.org/en/v1.0.0/" target="_blank">conventional commits documentation</a> for more detailed examples.

## Commit Types

- **build**: Changes that affect the build system, external dependencies or the local environment
- **cd**: Changes to the CD configuration files and scripts
- **chore**: Updates of the dependencies without the code changes
- **ci**: Changes to the CI configuration files and scripts
- **docs**: Changes related to the documentation only
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: Changes that improve the performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **revert**: Revert previous commit
- **style**: Changes that do not affect the meaning of the code (white-space, fromatting, missing semi-colons etc.)
- **test**: Changes related to tests only
