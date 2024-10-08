import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  banner: {
    js: `"use client"`,
  },
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react", "react-dom"],
});
