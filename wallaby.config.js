module.exports = () => {
  process.env.NODE_ENV = 'test';

  return {
    testFramework: 'jest',
    files: [
      'package.json',
      'index.js'
    ],
    tests: [
      'index.test.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    setup(wallaby) {
      wallaby.testFramework.configure(require('./package.json').jest);
    }
  };
};
