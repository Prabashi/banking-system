export default {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["node_modules", "dist"],
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
