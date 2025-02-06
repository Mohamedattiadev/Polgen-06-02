import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served in development or production
  base: "/",

  // Plugins
  plugins: [
    react({
      // Enable Fast Refresh in development
      fastRefresh: true,
      // Use React 17+ automatic JSX runtime
      jsxRuntime: "automatic",
    }),
  ],

  // Build configuration
  build: {
    // Generate source maps for debugging
    sourcemap: true,

    // Output directory for the build
    outDir: "dist",

    // Minify the build (enabled by default in production)
    minify: "esbuild", // Options: 'esbuild', 'terser', or false

    // Rollup options for bundling
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [],

      // Configure output for chunks
      output: {
        // Split chunks into separate files
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor"; // Bundle all node_modules into a single "vendor" chunk
          }
        },
        // Ensure consistent chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },

    // Enable/disable brotli compression for assets
    brotliSize: true,

    // Remove console.log and debugger statements in production
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Development server configuration
  server: {
    // Port to run the dev server on

    // Automatically open the app in the browser
    open: true,

    // Configure CORS for the dev server
    cors: true,
  },

  // Preview server configuration (for testing the production build locally)
  preview: {
    port: 5173,
    open: true,
  },

  // Resolve aliases for imports
  resolve: {
    alias: {
      "@": "/src", // Example: Use "@" to refer to the "src" directory
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"], // Pre-bundle these dependencies
    exclude: [], // Exclude specific dependencies from pre-bundling
  },
});
