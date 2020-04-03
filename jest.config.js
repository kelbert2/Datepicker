module.exports = {
  setupFiles: [
    "<rootDir>/test-shim.js",
    "<rootDir>/test-setup.js"
  ],

  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ["<rootDir>/src"],

  preset: 'ts-jest',
  // snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',

  // Jest transformations -- this adds support for TypeScript
  // using ts-jest to compile tsx to JavaScript
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },

  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    // "@testing-library/react/cleanup-after-each",
    './jest.setup.ts',
    // "@testing-library/jest-dom/extend-expect"
  ],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  // Module file extensions for importing
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // https://stackoverflow.com/questions/54627028/jest-unexpected-token-when-importing-css?noredirect=1&lq=1
  // How to interpret files with different extensions - don't. View them as blank.
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__tests__/styleMock.js',
  },

  // collectCoverage: true
  // TODO: turn back on when it's not mostly 0s
};