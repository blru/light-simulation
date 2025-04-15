/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
    test: {},
    base: "/light-simulation/",
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
    resolve: {
        alias: {
            src: "/src",
        },
    },
    build: {
        minify: false,
    },
});
