/**
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 * 
 * @type { import("@types/eslint").Linter.Config }
 */
module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    globals: {
        wx: true,
        App: true,
        Page: true,
        getCurrentPages: true,
        getApp: true,
        Component: true,
        requirePlugin: true,
        requireMiniProgram: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "indent": ["error", 4],
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": ["off"],
        "@typescript-eslint/triple-slash-reference": ["error", {
            "path": "always",
        }],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["off"],
        "@typescript-eslint/no-this-alias": ["error", {
            // Disallow `const { props, state } = this`; true by default
            "allowDestructuring": false,
            // Allow `const self = this`; `[]` by default
            "allowedNames": ["self"]
        }],
        "@typescript-eslint/no-empty-interface": ["off"],
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/ban-types": [
            "error", {
                "types": {
                },
                "extendDefaults": false,
            }
        ]
    },
};
