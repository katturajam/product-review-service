module.exports = {
    "debug": true,
    "lint": false,
    "lint-fix": false,
    "leaks": false,
    "verbose": true,
    "parallel": false,
    "coverage": true,
    "coverage-path": "src/app",
    "coverage-exclude": [
      "node_modules",
      "/src/test",
      "reports"
    ],
    "reporter": [
      "console",
      "html"
    ],
    "output": [
      "stdout",
      "reports/coverage.html"
    ],
    timeout: 15000,
    ids: []
  }
