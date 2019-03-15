# ip-envoy-api

This is a separate prototype Envoy API for the [IP Envoy project](https://github.com/Financial-Times/ip-envoy).

## Running locally

1. Clone the repo
2. `npm i`
3. Create a .env file in the root
4. Set up in your .env file the following variables:
  * PORT = any number you want
  * ENVOY_API_KEY = the x-api-key for the headers
  * FT_GRAPHITE_KEY = for the healthchecks to work. You can get this from the ip-envoy Heroku variables.
5. `npm run dev`
