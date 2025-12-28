import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    define: {
      __API_URL__: JSON.stringify(env.API_URL),
      __MODE__: JSON.stringify(env.MODE),
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["@mui/material", "@emotion/react", "@emotion/styled"],
            "state-vendor": ["react-redux", "@reduxjs/toolkit"],
            "quill-vendor": ["react-quill-new", "quill"],
          },
        },
      },
    },
  };
});
