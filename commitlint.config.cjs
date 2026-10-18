const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", "sentence-case"]
  }
};

module.exports = commitlintConfig;
