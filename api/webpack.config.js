const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [
      nodeExternals({
        allowlist: [
          'better-auth',
          '@thallesp/nestjs-better-auth',
          /^better-auth\//, // This catches all better-auth/* subpaths
        ],
      }),
    ],
    resolve: {
      ...options.resolve,
      extensions: ['.ts', '.js', '.mjs'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  };
};
