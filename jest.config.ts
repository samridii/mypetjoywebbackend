import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/app.ts",
    "!src/config/**",
    "!src/database/**",
    "!src/shared/**",
    "!src/routes/**",
    "!src/models/**",
    "!src/dtos/**",

    "!src/controllers/adoption.controller.ts",
    "!src/controllers/auth.controller.ts",
    "!src/controllers/order.controller.ts",
    "!src/controllers/pet.controller.ts",
    "!src/controllers/product.controller.ts",
    "!src/controllers/admin/product.controller.ts",
    "!src/services/admin/order.service.ts",
    "!src/services/admin/product.service.ts",
    "!src/services/auth.service.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/__tests__/unit/controllers/order.controller.test.ts",
    "src/__tests__/unit/controllers/adoption.controller.test.ts",
    "src/__tests__/unit/controllers/pet.controller.test.ts",
    "src/__tests__/unit/controllers/product.controller.test.ts",
    "src/__tests__/integration/routes/auth.route.test.ts",
  ],
  clearMocks: true,
  verbose: true,
};

export default config;