import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    optimizeDeps: {
      include: ["metar-taf-parser", "gsl-parser"],
    },
    build: {
      outDir: "build",
      sourcemap: true,
    },
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"],
        },
      }),
      svgr(),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "service-worker.ts",
        registerType: "autoUpdate",
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "https://ppg.report",
          changeOrigin: true,
          secure: true,
        },
      },
    },
    test: {
      environment: "happy-dom",
      include: ["**/*.test.tsx", "**/*.test.ts"],
      globals: true,
    },
  };
});
