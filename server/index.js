require('ignore-styles');

require('@babel/register')({
    ignore: [/(node_module)/],
    "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "10"
            }
          }
        ],
        "@babel/preset-react"
      ],
    plugins: ['@babel/plugin-proposal-class-properties']
});

require('./server');