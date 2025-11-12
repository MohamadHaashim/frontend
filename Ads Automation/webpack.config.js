module.exports = {
    module: {
      rules: [
        {
          test: /\.(xlsx)$/,
          use: 'file-loader',
        },
      ],
    },
  };