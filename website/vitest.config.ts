import { defineConfig } from 'vitest/config';

// Unit tests only — `tests/` holds Playwright specs, which vitest must not pick up.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
