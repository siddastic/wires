// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    test: {
        include: ["src/tests/**/*.test.ts"],
        environment: "jsdom",
        setupFiles: [resolve(__dirname, "src/tests/mock.ts")],
        reporters: "dot",
    },
    build: {
        minify: false,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "src/main.ts"),
            name: "WireGraph",
            // the proper extensions will be added
            fileName: "wiregraph",
        },
        // rollupOptions: {
        //   output: {
        //     // Provide global variables to use in the UMD build
        //     // for externalized deps
        //     globals: {
        //       // vue: 'WireGraph'
        //     }
        //   }
        // },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
    ],
});
