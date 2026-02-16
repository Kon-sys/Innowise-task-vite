import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["dist/**", "node_modules/**"]
    },

    js.configs.recommended,

    {
        files: ["src/**/*.js", "vite.config.js", "eslint.config.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser, // document, window, localStorage, etc.
                ...globals.es2021   // URL, AbortController (частично), etc.
            }
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-console": "off"
        }
    }
];