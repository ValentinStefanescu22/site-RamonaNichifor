import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Architecture rule (ADR 0003): components never read content files directly.
    // Only the local data layer and build scripts may import from `content/`.
    ignores: ['src/lib/data/local/**', 'scripts/**', 'content/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@content/*', '**/content/*'],
              message: 'Read content through `@/lib/data` (ADR 0003).',
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'reference/**',
    'src/generated/**',
  ]),
]);

export default eslintConfig;
