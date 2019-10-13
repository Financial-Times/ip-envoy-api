const HealthCheck = require("@financial-times/health-check");
const AggregateHealthCheck = require("../../../middleware/healthchecks/customHealthChecks");

// Set vars here
const envoyEventsThreshold = 10; // 10 events per 5 minutes
const envoyEventAgeThreshold = 1000; // 1 second
const timeSpan = '5mins'

const health = new HealthCheck({
  checks: [
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.volt.*.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-volt-fetch-failures',
			name: 'API calls to Volt',
			severity: 1,
			businessImpact: 'There have been failed API calls to Volt DB.',
			technicalSummary: 'There have been failed API calls to Volt DB.',
			panicGuide: 'Check why there have been failed API calls to Volt DB.'
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.userrecsapi.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-userrecsapi-fetch-failures',
			name: 'API calls to User Recs API',
			severity: 1,
			businessImpact: 'There have been failed API calls to the User Recs API.',
			technicalSummary: 'There have been failed API calls to the User Recs API.',
			panicGuide: 'Check why there have been failed API calls to the User Recs API.'
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.interceptorsvchost.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-interceptorsvchost-fetch-failures',
			name: 'API calls to Interceptor SVC Host',
			severity: 1,
			businessImpact: 'There have been failed API calls to the Interceptor SVC Host.',
			technicalSummary: 'There have been failed API calls to the Interceptor SVC Host.',
			panicGuide: 'Check why there have been failed API calls to the Interceptor SVC Host.'
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.topicsapi.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-topicsapi-fetch-failures',
			name: 'API calls to Topics API',
			severity: 1,
			businessImpact: 'There have been failed API calls to the Topics API.',
			technicalSummary: 'There have been failed API calls to the Topics API.',
			panicGuide: 'Check why there have been failed API calls to the Topics API.'
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.scs.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: `aggregate-scs-fetch-failures`,
			name: `API calls to Single Consent Store`,
			severity: 1,
			businessImpact: `There have been failed API calls to the Single Consent Store.`,
			technicalSummary: `There have been failed API calls to the Single Consent Store.`,
			panicGuide: `Check why there have been failed API calls to the Single Consent Store.`
		}),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.userslist.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-userslist-fetch-failures',
			name: 'API calls to Users List',
			severity: 1,
			businessImpact: 'There have been failed API calls to the User\'s List.',
			technicalSummary: 'There have been failed API calls to the User\'s List.',
			panicGuide: 'Check why there have been failed API calls to the User\'s List.'
    }),
    new AggregateHealthCheck({
      timeSpan: `${timeSpan}`,
      url: `https://graphitev2-api.ft.com/render/?from=-${timeSpan}&target=summarize(transformNull(internalproducts.heroku.ip-envoy.*.fetch.userslistsapi.failure),%20%22${timeSpan}%22,%20%22sum%22,%20true)&format=json`,
      graphiteKey: process.env.FT_GRAPHITE_KEY,
			interval: 300000,
			id: 'aggregate-userslistsapi-fetch-failures',
			name: 'API calls to Users Lists API',
			severity: 1,
			businessImpact: 'There have been failed API calls to the User\'s Lists API.',
			technicalSummary: 'There have been failed API calls to the User\'s Lists API.',
			panicGuide: 'Check why there have been failed API calls to the User\'s Lists API.'
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
        "https://graphitev2-api.ft.com/render/?from=-1minutes&target=summarize(internalproducts.heroku.ip-envoy.worker_1.queue.age.median,%20%221minutes%22,%20%22avg%22,%20true)&format=json",
      interval: 60000,
      threshold: 1000,
      direction: "above",
      graphiteKey: process.env.FT_GRAPHITE_KEY,
      id: "envoy-event-age-check",
      name: "Envoy event age check 👵 👀",
      severity: 3,
      businessImpact: `The age of events that Envoy is processing has risen above the specified threshold of ${envoyEventAgeThreshold}.`,
      technicalSummary: `The age of events that Envoy is processing has risen above the specified threshold of ${envoyEventAgeThreshold}. This might indicate an issue and should be monitored.`,
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
