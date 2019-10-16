const webpack = require("webpack");
const path = require("path");

module.exports = {
  plugins: [
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  entry: {
    app: ["whatwg-fetch", "./web/app/app.js"],
  },
  output: {
    filename: "./[name].bundle.js",
    path: path.resolve("public", "assets", "packs"),
    publicPath: "http://localhost:3000/assets/",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
            cacheDirectory: true,
            plugins: ['react-hot-loader/babel']
          }
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          "css-loader",
          "sass?includePaths[]=./node_modules/foundation-sites/scss/" +
          "&includePaths[]=./node_modules/motion-ui/src",
        ],
      },
      {
        test: /.html$/,
        loader: "file-loader"
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
    ],
  },
};
