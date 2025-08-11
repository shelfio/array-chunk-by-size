export default {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  resetMocks: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
