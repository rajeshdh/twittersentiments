const Joi = require("joi");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require("dotenv").config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(["development", "production", "test", "provision"])
    .default("development"),
  PORT: Joi.number().default(1337),
  MONGOOSE_DEBUG: Joi.boolean().when("NODE_ENV", {
    is: Joi.string().equal("development"),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  TWITTER_CONSUMER_KEY: Joi.string()
    .required()
    .description("TWITTER_CONSUMER_KEY is required"),
  TWITTER_CONSUMER_SECRET: Joi.string()
    .required()
    .description("TWITTER_CONSUMER_SECRET is required"),
  TWITTER_ACCESS_TOKEN: Joi.string()
    .required()
    .description("TWITTER_ACCESS_TOKEN is required"),
  TWITTER_ACCESS_TOKEN_SECRET: Joi.string()
    .required()
    .description("TWITTER_ACCESS_TOKEN_SECRET is required"),
  MONGO_HOST: Joi.string()
    .required()
    .description("Mongo DB host url is required"),
  MONGO_PORT: Joi.number().default(27017)
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  TWITTER_CONSUMER_KEY: envVars.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET: envVars.TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN: envVars.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET: envVars.TWITTER_ACCESS_TOKEN_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  }
};

export default config;
