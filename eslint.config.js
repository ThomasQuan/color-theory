import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import simpleSort from "eslint-plugin-simple-import-sort";

export default tseslint.config({
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser
    },
    plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        "unused-imports": unusedImports,
        "simple-import-sort": simpleSort
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        quotes: ["error", "double"],
        "no-unused-vars": "off",

        "no-console": [
            "warn",
            {
                allow: ["info", "error", "debug", "clear"]
            }
        ],

        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports-ts": "warn",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_"
            }
        ],
        "simple-import-sort/exports": "warn",

        "simple-import-sort/imports": [
            "warn",
            {
                groups: [
                    ["^@?\\w", "^\\u0000"],
                    ["^@/lib"],
                    ["^@/data"],
                    ["^@/"],
                    [
                        "^\\./?$",
                        "^\\.(?!/?$)",
                        "^\\.\\./?$",
                        "^\\.\\.(?!/?$)",
                        "^\\.\\./\\.\\./?$",
                        "^\\.\\./\\.\\.(?!/?$)",
                        "^\\.\\./\\.\\./\\.\\./?$",
                        "^\\.\\./\\.\\./\\.\\.(?!/?$)"
                    ],
                    ["^@/types"],
                    ["^"]
                ]
            }
        ],

        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
});
