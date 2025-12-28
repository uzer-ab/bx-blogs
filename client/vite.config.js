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
      __MODE__: JSON.stringify(mode),
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("quill") || id.includes("react-quill")) {
                return "quill-vendor";
              }
              if (id.includes("lodash")) {
                return "utils-vendor";
              }
              if (id.includes("@mui") || id.includes("@emotion")) {
                return "ui-vendor";
              }
              if (id.includes("redux") || id.includes("@reduxjs")) {
                return "state-vendor";
              }
              if (id.includes("react-router")) {
                return "router-vendor";
              }
              if (id.includes("lucide-react")) {
                return "lucide-vendor";
              }
              return "vendor";
            }
          },
        },
      },
    },
  };
});
