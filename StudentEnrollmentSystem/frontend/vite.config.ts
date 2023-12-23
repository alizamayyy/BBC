import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import Checker from "vite-plugin-checker";

export default defineConfig({
    base: "", // Set your desired base path
    plugins: [Checker({ typescript: true }), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
