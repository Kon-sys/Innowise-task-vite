import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "app.js",

                inlineDynamicImports: true,

                assetFileNames: "assets/[name][extname]"
            }
        }
    }
});