# Home Highlights 2.0 Development Guide

## Build & Test Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint on all .js, .ts, .tsx files
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm test` - Run all tests
- `pnpm test path/to/file.spec.ts` - Run specific test file
- `pnpm test -- -t "test name"` - Run tests matching description

## Code Style Guidelines

- **Formatting**: Uses Prettier with single quotes, 2 space indentation
- **TypeScript**: Strict typing preferred, use proper interfaces/types
- **React**: Functional components with hooks, prefer explicit return types
- **Error Handling**: Use try/catch blocks and report errors with rollbar
- **Naming**:
  - React components: PascalCase
  - Functions/variables: camelCase
  - Files: Component files same as component name, utility files camelCase
- **Imports**: Group by external/internal, alphabetical order
- **Testing**: Each component/utility should have corresponding test file
- **CSS**: Component-specific CSS in same directory as component

## When working on new features

- **Feature Branches**: Create a new branch for each feature
- **Commits**: Use clear, descriptive commit messages
- Use TDD (Test-Driven Development) approach:
  - Write tests first
  - Implement feature to pass tests
  - Refactor as needed

