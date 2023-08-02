import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  root: resolve(__dirname, "src"),
  // base: "/dist/",
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login.html"),
        registry: resolve(__dirname, "src/registry.html"),
        notFound: resolve(__dirname, "src/404.html"),
        error: resolve(__dirname, "src/500.html"),
        messages: resolve(__dirname, "src/messages.html"),
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
  ],
});
