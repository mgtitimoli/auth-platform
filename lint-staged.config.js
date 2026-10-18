const getPackageConfigs = packageName => ({
  [`workspaces/${packageName}/**/*.{cjs,js}`]: [
    `yarn workspace @mgtitimoli/${packageName} run lint --fix`
  ],
  [`workspaces/${packageName}/**/*.ts`]: [
    `yarn workspace @mgtitimoli/${packageName} run check-types:files`,
    `yarn workspace @mgtitimoli/${packageName} run lint --fix`
  ]
});

const lintStagedConfig = {
  ...getPackageConfigs("auth-api"),
  ...getPackageConfigs("utils"),
  ...getPackageConfigs("eslint-config")
};

export default lintStagedConfig;
