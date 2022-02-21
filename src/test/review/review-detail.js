'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../app/server');
const { basepath } = require('../../app/modules.config.json')
const db = require('../../app/db/alexaReviewDB');
const { SinonHelper } = require('../helper/sinonHelper');

experiment('Review', { parallel: false }, () => {

    describe('GET /api/reviews/{review_id}', () => {
        let server, dbMock;
        
        beforeEach(async () => {
            dbMock = new SinonHelper();
            dbMock.initStub(db, 'readRecord');
            server = await init();
        });

        afterEach(async () => {
            // Reseting the stub and counter
            dbMock.restore();
            // await server.stop();
        });

        it('+Fetch review Details by Review Id', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            const review_id = 1;
            dbFirstCall.returns([{
                "id": review_id,
                "review": "Pero deberia de poder cambiarle el idioma a alexa",
                "author": "WarcryxD",
                "rating": 5,
                "title": "Excelente",
                "product_name": "Amazon Alexa",
                "review_source": "iTunes",
                "reviewed_date": '2017-05-27T00:00:00.000Z'
            }]);

            const expectedResult = [{
                "id": 1,
                "review": "Pero deberia de poder cambiarle el idioma a alexa",
                "author": "WarcryxD",
                "rating": 5,
                "title": "Excelente",
                "product_name": "Amazon Alexa",
                "review_source": "iTunes",
                "reviewed_date": '2017-05-27T00:00:00.000Z'
            }];
            let reqURL = `${basepath}/reviews/${review_id}`;
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${reqURL}`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });
        
        it('-Fetch review Details by Review Id - Record Not Found', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            const review_id = 1;
            dbFirstCall.returns();

            const expectedResult = { statusCode: 404, message: 'Resource not found!' };
            let reqURL = `${basepath}/reviews/${review_id}`;
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${reqURL}`
            });
            expect(statusCode).to.equal(404);
            expect(result).to.equal(expectedResult, { prototype: false });
        });
    });

});