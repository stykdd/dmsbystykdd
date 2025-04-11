
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Add SWC options to target older Node versions
      swcOptions: {
        jsc: {
          target: "es2020",
        },
      },
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  build: {
    target: "es2020", // Set target compatibility for older Node.js versions
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
