import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Backend NestJS (tiene su propio tsconfig y build)
    "api/**",
  ]),
  {
    rules: {
      // La app carga datos del API al montar cada panel. Es un efecto de
      // sincronización con un sistema externo, así que permitimos el setState.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
