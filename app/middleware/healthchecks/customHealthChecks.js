const HealthCheck = require("@financial-times/health-check");
const fetch = require('node-fetch');

class AggregateHealthCheck extends HealthCheck.Check {
    constructor(options) {
        super(options);
        this.url1 = options.url1
        this.url2 = options.url2
        this.graphiteKey = options.graphiteKey
        this.timeSpan = options.timeSpan
    }

    async run() {
        try {
            // make call to both graphite endpoints
            const response1 = await fetch(this.options.url1, {
                method: 'GET',
                headers: { key: this.options.graphiteKey }
            });
            const response2 = await fetch(this.options.url2, {
                method: 'GET',
                headers: { key: this.options.graphiteKey }
            });

            if (response1.status !== 200 || response2.status !== 200) {
                throw new Error('Non-200 response, check what is happening with the Graphite URL');
            }

            if (response1.status === 200 && response2.status === 200) {
                // check whether they are null or not (to do later)
                let reading1 = await response1.json();
                let reading2 = await response2.json();

                // if both null, return ok healthcheck
                if (reading1.length === 0 && reading1.length === 0) {
                    console.log('both are null')
                    this.ok = true;
                    this.checkOutput = '';
                }
                // if one is null, only return the other
                else if (reading1.length === 0 || reading2.length === 0) {
                    console.log('one is null')
                    if (reading1.length === 0) {
                        reading2 = reading2[0].datapoints[0][0]
                        console.log(reading2)
                        if (reading2 > 0) {
                            this.ok = false;
                            this.checkOutput = `${reading2} failed API calls in the last ${this.options.timeSpan}`;
                        } else {
                            this.ok = true;
                            this.checkOutput = '';
                        }
                    }
                    if (reading2.length === 0) {
                        reading1 = reading1[0].datapoints[0][0]
                        console.log(reading1)
                        if (reading1 > 0) {
                            this.ok = false;
                            this.checkOutput = `${reading1} failed API calls in the last ${this.options.timeSpan}`;
                        } else {
                            this.ok = true;
                            this.checkOutput = '';
                        }
                    }
                }
                // if neither are null, average the result
                else {
                    console.log('neither are null')
                    reading1 = reading1[0].datapoints[0][0]
                    reading2 = reading2[0].datapoints[0][0]

                    console.log(reading1, reading2)

                    function avg(data1, data2) {
                        return (data1 + data2) / 2
                    }

                    const average = avg(reading1, reading2);

                    // if the result is above one, set off the healthcheck
                    if (average > 0) {
                        this.ok = false;
                        this.checkOutput = `${average} averaged failed API calls in the last ${this.options.timeSpan}`;
                    } else {
                        this.ok = true;
                        this.checkOutput = '';
                    }
                }
            }
        }
        catch (error) {
            this.log.error({ event: 'Problem with aggregate healthcheck', error: error.toString() });
            this.ok = false;
            this.checkOutput = error.toString();
        }
        finally {
            this.lastUpdated = new Date();
        }
    }
}

module.exports = AggregateHealthCheck;