import Twitter from "twitter";
const Sentiment = require("sentiment");
const colors = require("colors/safe");
import config from "../../config/config";

function get_text(tweet) {
  // console.log(tweet);
  let txt = tweet.retweeted_status ? tweet.retweeted_status.text : tweet.text;
  return txt
    .split(/ |\n/)
    .filter(v => !v.startsWith("http"))
    .join(" ");
}

async function getTweets(hashtag = "himachal") {
  // console.log(config);
  const client = new Twitter({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.TWITTER_ACCESS_TOKEN,
    access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
  });
  // console.log(client);
  const tweetList = await client.get("search/tweets", {
    q: hashtag,
    count: 30
  });
  return tweetList.statuses.map(get_text);
}


const getTweetSentiments = async () => {
  const tweets = await getTweets("BribeForVotes");
  var sentiment = new Sentiment();
  for (let tweet of tweets) {
    let score = sentiment.analyze(tweet).comparative;
    tweet = `${tweet}\n`;
    if (score > 0) {
      tweet = colors.green(tweet);
    } else if (score < 0) {
      tweet = colors.red(tweet);
    } else {
      tweet = colors.blue(tweet);
    }
    console.log(tweet);
  }
};

export default getTweetSentiments;
