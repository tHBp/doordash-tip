export default [
  {
    input: "index.js",
    output: {
      file: "build/content.js",
      format: "iife",
    },
    treeshake: false,
  },
];
