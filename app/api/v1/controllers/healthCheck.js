const HealthCheck = require("@financial-times/health-check");
const AggregateHealthCheck = require("../../../middleware/healthchecks/customHealthChecks");

// Set vars here
const envoyEventsThreshold = 10; // 10 events per 5 minutes
const envoyEventAgeThreshold = 1000; // 1 second
const timeSpan = '5days'

const health = new HealthCheck({
  checks: [
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url1: "https://graphitev2-api.ft.com/render/?from=-5mina&target=summarize(transformNull(internalproducts.heroku.ip-envoy.cron_1.fetch.topicsapi.failure),%20%225mins%22,%20%22sum%22,%20true)&format=json",
      url2: "https://graphitev2-api.ft.com/render/?from=-5mins&target=summarize(transformNull(internalproducts.heroku.ip-envoy.worker_1.fetch.topicsapi.failure),%20%225mins%22,%20%22sum%22,%20true)&format=json",
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-topicsapi-fetch-failures',
			name: 'API calls to Topics API failed',
			severity: 1,
			businessImpact: 'There have been failed API calls to the Topics API.',
			technicalSummary: 'There have been failed API calls to the Topics API.',
			panicGuide: 'Check why there have been failed API calls to the Topics API.'
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url1: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.cron_1.fetch.scs.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      url2: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.worker_1.fetch.scs.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: `aggregate-scs-fetch-failures`,
			name: `API calls to scs failed`,
			severity: 1,
			businessImpact: `There have been failed API calls to the scs API.`,
			technicalSummary: `There have been failed API calls to the scs API.`,
			panicGuide: `Check why there have been failed API calls to the scs API.`
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url1: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.cron_1.fetch.userslist.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      url2: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.worker_1.fetch.userslist.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-userslist-fetch-failures',
			name: 'API calls to Users List failed',
			severity: 1,
			businessImpact: 'There have been failed API calls to the User\'s List API.',
			technicalSummary: 'There have been failed API calls to the User\'s List API.',
			panicGuide: 'Check why there have been failed API calls to the User\'s List API.'
		}),
    {
      type: "graphite-threshold",
      url:
        "https://graphitev2-api.ft.com/render/?from=-5minutes&target=summarize(internalproducts.heroku.ip-envoy.worker_1.queue.task,%20%225minutes%22,%20%22avg%22,%20true)&format=json",
      interval: 300000,
      threshold: 10,
      direction: "below",
      graphiteKey: process.env.FT_GRAPHITE_KEY,
      id: "envoy-event-queue-check",
      name: "Envoy event queue check 💯 👀",
      severity: 3,
      businessImpact: `The number of events in the Envoy queue has dropped below the specified threshold of ${envoyEventsThreshold}.`,
      technicalSummary: `The number of events in the Envoy queue has dropped below the specified threshold of ${envoyEventsThreshold}. This might indicate an issue and should be monitored.`,
      panicGuide: "Inspect RabbitMQ and Spoor API to see if anything is amiss."
    },
    {
      type: "graphite-threshold",
      url:
        "https://graphitev2-api.ft.com/render/?from=-5minutes&target=summarize(internalproducts.heroku.ip-envoy.worker_1.queue.age.median,%20%225minutes%22,%20%22avg%22,%20true)&format=json",
      interval: 300000,
      threshold: 1000,
      direction: "above",
      graphiteKey: process.env.FT_GRAPHITE_KEY,
      id: "envoy-event-age-check",
      name: "Envoy event age check 👵 👀",
      severity: 3,
      businessImpact: `The age of events in the queue has risen above the specified threshold of ${envoyEventAgeThreshold}.`,
      technicalSummary: `The age of events in the queue has risen above the specified threshold of ${envoyEventAgeThreshold}. This might indicate an issue and should be monitored.`,
      panicGuide: "Inspect RabbitMQ and Spoor API to see if anything is amiss."
    },
    // {
    //   type: "graphite-threshold",
    //   url:
    //     "https://graphitev2-api.ft.com/render/?from=-5minutes&target=summarize(transformNull(internalproducts.heroku.ip-envoy.cron-anon_1.cron.treeshake.count),%20%225minutes%22,%20%22max%22,%20true)&format=json",
    //   interval: 300000,
    //   threshold: 0,
    //   direction: "above",
    //   graphiteKey: process.env.FT_GRAPHITE_KEY,
    //   id: "envoy-cron-treeshake",
    //   name: "Envoy stuck entities treeshake count 🌲🥤",
    //   severity: 3,
    //   businessImpact: `There are entities stuck in an Envoy journey, meaning they may not receive all communications from us.`,
    //   technicalSummary: `The cron treeshake function has been triggered. This means that there could be something wrong with the way the journey is running.`,
    //   panicGuide: "Please check Envoy to see why entitites are getting stuck."
    // },
    // {
    //   type: "graphite-threshold",
    //   url:
    //     "https://graphitev2-api.ft.com/render/?from=-1minutes&target=summarize(transformNull(internalproducts.heroku.ip-envoy.cron_1.cron.moveentities.run%2C0)%2C%221minutes%22%2C%20%22min%22%2C%20true)&format=json",
    //   interval: 300000,
    //   threshold: 1,
    //   direction: "below",
    //   graphiteKey: process.env.FT_GRAPHITE_KEY,
    //   id: "envoy-cron-move-entities",
    //   name: "Envoy moving entities 🔜 🐢",
    //   severity: 3,
    //   businessImpact: `If entitites are not moving through an Envoy journey, they may not receive all communications from us.`,
    //   technicalSummary: `The cron entity-moving function has stopped running, meaning entities could be getting stuck in an Envoy journey.`,
    //   panicGuide: "Please check Envoy to see if entitites are getting stuck."
    // }
  ]
});

async function healthCheck(req, res, next) {
  try {
    const checks = await health.toJSON();
    const result = res.json({
      schemaVersion: 1,
      systemCode: 'ip-envoy-api',
      name: 'IP Envoy API',
      description: 'Experimental Envoy API with Swagger',
      checks: checks
    });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
}

module.exports = { healthCheck };