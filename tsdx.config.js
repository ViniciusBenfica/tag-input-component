const postcss = require("rollup-plugin-postcss");

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [],
        modules: true,
        // modules: {
        //   scopeBehaviour: 'local',
        //   generateScopedName: '[name]__[local]___[hash:base64:5]',
        // },
        inject: true,
        extract: false,
      })
    );
    return config;
  },
};
