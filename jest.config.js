module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^.+\\.(css|min.css)$': '<rootDir>/config/css_stub.js'
  },
  moduleDirectories: ["node_modules", "src"],
  unmockedModulePathPatterns: ['react'],
};
