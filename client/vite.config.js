import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __API_URL__: JSON.stringify(process.env.API_URL),
    __MODE__: JSON.stringify(process.env.MODE),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // React core
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // Quill editor - separate chunk
            if (id.includes("quill") || id.includes("react-quill")) {
              return "quill-vendor";
            }
            // Lodash utilities
            if (id.includes("lodash")) {
              return "utils-vendor";
            }
            // MUI + Emotion (~150-200 KB combined)
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "ui-vendor";
            }
            // Redux
            if (id.includes("redux") || id.includes("@reduxjs")) {
              return "state-vendor";
            }
            // React Router
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // Icons
            if (id.includes("lucide-react")) {
              return "lucide-vendor";
            }
            // Remaining
            return "vendor";
          }
        },
      },
    },
  },
  mode: "production",
});
