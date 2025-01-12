/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
    test: {},
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
});
