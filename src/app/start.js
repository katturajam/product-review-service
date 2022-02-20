require('../../src/app/db/alexaReviewDB').connect().finally(() => {
    console.log("Starting server...");
    require('./server').start();
})
