module.exports = {
  "backend-transformer": {
    output: {
      mode: "tags-split",
      target: "./src/api/services.ts",
      schemas: "./src/api/models",
      client: "react-query",
      mock: true,
      override: {
        mutator: {
          path: "./src/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "./backend.yaml",
    },
  },
};
