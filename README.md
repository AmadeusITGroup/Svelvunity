<h1 align="center">Svelvunity - Where apps get alive</h1>

![build](https://github.com/AmadeusITGroup/Svelvunity/workflows/ci/badge.svg)
[![codecov](https://codecov.io/gh/AmadeusITGroup/Svelvunity/branch/main/graph/badge.svg)](https://codecov.io/gh/AmadeusITGroup/Svelvunity)

## Introduction

Welcome to Svelvunity, a [Svelte](https://svelte.dev/) library designed to provide developers with reusable components and utilities to accelerate the development of Svelte applications.

Svelvunity is a library of Svelte web components designed to streamline your development process. With Svelvunity, you can integrate pre-built components into your projects without starting from scratch.

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Reusable Components**: Leverage a suite of pre-built Svelte components designed for efficiency and ease of use.
- **Customizable**: Easily theme and customize components to fit the branding and style of your application.
- **Performance Optimized**: Built with performance in mind, ensuring your applications run smoothly.
- **Fully Typed**: Take advantage of [TypeScript](https://typescriptlang.org/) support for type safety and an enhanced developer experience.
- **Effortless Integration**: Seamlessly integrate components into your existing Svelte projects with minimal setup.

## Getting Started

To start using Svelvunity in your project, install Svelvunity by running the following command in your project directory:

```bash
npm install @amadeus-it-group/svelvunity
```

For comprehensive information on each component and how to use it, see the [Documentation](https://amadeusitgroup.github.io/Svelvunity/).

### Svelte Compatibility

This library supports different versions of Svelte depending on the library version:

| Library Version | Compatible Svelte Version |
| --------------- | ------------------------- |
| ≤ 0.0.3         | 4.x                       |
| ≥ 0.0.4         | 5.x                       |

## Usage

Import the components you need and start using them in your Svelte application:

```typescript
<script>
  import { Datepicker } from '@amadeus-it-group/svelvunity';
</script>

<Datepicker />
```

## Contributing

We welcome contributions! Please read our [Contribution Guidelines](./CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
