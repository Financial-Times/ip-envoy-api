const HealthCheck = require("@financial-times/health-check");
const fetch = require('node-fetch');

class AggregateHealthCheck extends HealthCheck.Check {
    constructor(options) {
        super(options);
        this.url = options.url
        this.graphiteKey = options.graphiteKey
        this.timeSpan = options.timeSpan
    }

    async run() {
        try {
            // make call to both graphite endpoints
            const response = await fetch(this.options.url, {
                method: 'GET',
                headers: { key: this.options.graphiteKey }
            });

            if (response.status !== 200) {
                throw new Error('Non-200 response, check what is happening with the Graphite URL');
            }

            let data = await response.json();

            // check if response array is null

            if (data.length === 0) {
                this.ok = true;
                this.checkOutput = '';
            }

            // if not, reduce and check

            else { 
                let array = []

                data.forEach((object) => {
                    array.push(object.datapoints[0][0])
                })

                const total = array.reduce((accumulator, currentIndex) => accumulator + currentIndex);

                const average = total / data.length;

                if (average > 0) {
                    this.ok = false;
                    this.checkOutput = `${average} averaged failed API calls across ${data.length} systems in the last ${this.options.timeSpan}`;
                } else {
                    this.ok = true;
                    this.checkOutput = '';
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