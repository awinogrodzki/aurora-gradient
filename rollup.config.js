const typescript = require("@rollup/plugin-typescript");

module.exports = {
  input: "./src/browser.ts",
  output: {
    sourcemap: true,
    dir: "dist",
    format: "cjs",
  },
  plugins: [typescript({ tsconfig: "tsconfig.rollup.json" })],
};
