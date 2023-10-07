export default {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "node_modules",
    "dist",
    "src/controllers/AppController",
  ],
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
