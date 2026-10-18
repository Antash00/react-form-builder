# React Form Builder MUI

Config-driven form builder for React, TypeScript, Material UI and React Hook Form.

> Early development. API is not stable yet.

## Development

```bash
pnpm install
pnpm --filter playground dev
```

## Code style

```bash
pnpm lint          # ESLint across the workspace
pnpm lint:fix
pnpm format        # Prettier across the workspace
pnpm format:check
```

## Tests

```bash
pnpm --filter @antash00/form-builder-mui test:unit
pnpm build && pnpm test:types
pnpm --filter playground exec playwright install chromium
pnpm test:e2e
pnpm check
```

Vitest and Testing Library exercise the form behavior, `tsd` checks the built
package's public types, and Playwright tests the playground in Chromium.
