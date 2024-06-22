import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import vueEslintParser from "vue-eslint-parser";

import typescriptEslintParser from "@typescript-eslint/parser";

const electronToolkit = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es6,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
        ecmaVersion: 2021,
      },
    },
  },
];

const electronToolkitEslintRecommended = [
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["*.js"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];

//https://github.com/vuejs/eslint-config-typescript/blob/main/index.js
const vueEslintConfigTypescript = [
  tseslint.configs.eslintRecommended,
  {
    //plugins: {
    //  "@typescript-eslint": tseslint, //already defined
    //},

    // Prerequisite `eslint-plugin-vue`, being extended, sets
    // root property `parser` to `'vue-eslint-parser'`, which, for code parsing,
    // in turn delegates to the parser, specified in `parserOptions.parser`:
    // https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error
    languageOptions: {
      parserOptions: {
        parser: {
          js: "espree",
          jsx: "espree",
          cjs: "espree",
          mjs: "espree",

          ts: typescriptEslintParser,
          tsx: typescriptEslintParser,
          cts: typescriptEslintParser,
          mts: typescriptEslintParser,

          // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
        },
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["*.ts", "*.cts", "*.mts", "*.tsx", "*.vue"],
    rules: {
      // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
      // does not work with type definitions
      "no-unused-vars": "off",
      // TS already checks for that, and Typescript-Eslint recommends to disable it
      // https://typescript-eslint.io/linting/troubleshooting#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
//https://github.com/vuejs/eslint-config-typescript/blob/main/recommended.js
const vueEslintConfigTypescriptRecommended = [
  ...vueEslintConfigTypescript,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: vueEslintParser,
    },
    rules: {
      // this rule, if on, would require explicit return type on the `render` function
      "@typescript-eslint/explicit-function-return-type": "off",

      // The following rules are enabled in an `overrides` field in the
      // `@typescript-eslint/recommended` ruleset, only turned on for TypeScript source modules
      // <https://github.com/typescript-eslint/typescript-eslint/blob/cb2d44650d27d8b917e8ce19423245b834db29d2/packages/eslint-plugin/src/configs/eslint-recommended.ts#L27-L30>

      // But as ESLint cannot precisely target `<script lang="ts">` blocks and skip normal `<script>`s,
      // no TypeScript code in `.vue` files would be checked against these rules.

      // So we now enable them globally.
      // That would also check plain JavaScript files, which diverges a little from
      // the original intention of the `@typescript-eslint/recommended` rulset.
      // But it should be mostly fine.
      "no-var": "error", // ts transpiles let/const to var, so no need for vars any more
      "prefer-const": "error", // ts provides better types with const
      "prefer-rest-params": "error", // ts provides better types with rest args over arguments
      "prefer-spread": "error", // ts transpiles spread to apply, so no need for manual apply
    },
  },
  {
    files: ["shims-tsx.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["*.js", "*.cjs"],
    rules: {
      // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];

const vueEslintConfigPrettier = [
  eslintPluginPrettierRecommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

function getConfig() {
  return [
    eslint.configs.recommended,
    ...eslintPluginVue.configs["flat/recommended"],
    ...tseslint.configs.recommended,
    ...electronToolkit,
    ...electronToolkitEslintRecommended,
    ...vueEslintConfigTypescriptRecommended,
    ...vueEslintConfigPrettier,
    {
      rules: {
        "vue/require-default-prop": "off",
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "prettier/prettier": [
          "warn",
          {
            printWidth: 100,
            tabWidth: 2,
          },
        ],
      },
    },
    {
      files: ["volar.config.js"],
      languageOptions: {
        parserOptions: {
          sourceType: "commonjs",
        },
      },
      rules: {
        "@typescript-eslint/no-require-imports": "off",
      },
    },
    { ignores: ["node_modules", "dist", "out", ".gitignore"] },
  ];
}
const config = getConfig();
export default config;
