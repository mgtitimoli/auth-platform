const getPackageConfigs = packageName => ({
  [`workspaces/${packageName}/**/*.{cjs,js}`]: [
    `yarn workspace @mgtitimoli/${packageName} run lint --fix`
  ]
});

const lintStagedConfig = {
  ...getPackageConfigs("eslint-config")
};

export default lintStagedConfig;
