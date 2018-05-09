import express from "express";
import { join } from "path";
import open from "open";
import webpack from 'webpack';
import webpackConfig from '../webpack.config.dev';
import config from "../config/config";
import getTweetSentiments from "./twitterApi";

const app = express();

const compiler = webpack(webpackConfig);


app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
// connect to mongo db
// const mongoUri = config.mongo.host;
// mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${mongoUri}`);
// });
app.get("/", function(req, res) {
  getTweetSentiments();
  res.sendFile(join(__dirname, "../src/index.html"));
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    open(`http://localhost:${config.port}`);
  }
});
