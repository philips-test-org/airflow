var webpack = require("webpack");
var path = require("path");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
    }),
  ],
  entry: {
    app: ["whatwg-fetch", "babel-polyfill", "./web/app/app.js"],
  },
  output: {
    filename: "./javascripts/[name].bundle.js",
    path: path.resolve("app", "assets"),
    publicPath: "/assets/",
  },
  module: {
    loaders: [
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
  externals: {
    //"react/addons": true,
    //"react/lib/ExecutionEnvironment": true,
    //"react/lib/ReactContext": true,
  },
};
