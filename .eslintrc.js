module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort", "unused-imports"],
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier"],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        quotes: ["error", "double"],
        "no-unused-vars": "off",
        "no-console": [
            "error",
            {
                allow: ["info", "error", "debug", "clear"]
            }
        ],
        //#region  //*=========== Unused Import ===========
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "warn",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_"
            }
        ],

        //#endregion  //*======== Unused Import ===========

        //#region  //*=========== Import Sort ===========
        "simple-import-sort/exports": "warn",
        "simple-import-sort/imports": [
            "warn",
            {
                groups: [
                    // ext library & side effect imports
                    ["^@?\\w", "^\\u0000"],
                    // {s}css files
                    // Lib and hooks
                    ["^@/lib"],
                    // static data
                    ["^@/data"],
                    // Other imports
                    ["^@/"],
                    // relative paths up until 3 level
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
                    // other that didnt fit in
                    ["^"]
                ]
            }
        ],
        //#endregion  //*======== Import Sort ===========
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
};
