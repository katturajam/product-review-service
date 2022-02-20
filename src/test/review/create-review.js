'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../app/server');
const { basepath } = require('../../app/modules.config.json')
const db = require('../../app/db/alexaReviewDB');
const { SinonHelper } = require('../helper/sinonHelper');

experiment('Review', { parallel: false }, () => {

    describe('POST /alexa/reviews', () => {
        let server, dbMock;
        
        beforeEach(async () => {
            dbMock = new SinonHelper();
            dbMock.initStub(db, 'saveRecord');
            server = await init();
        });

        afterEach(async () => {
            // Reseting the stub and counter
            dbMock.restore();
            // await server.stop();
        });

        it('+Create review', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                "id": 1,
                "review": "Pero deberia de poder cambiarle el idioma a alexa",
                "author": "WarcryxD",
                "rating": 5,
                "title": "Excelente",
                "product_name": "Amazon Alexa",
                "review_source": "iTunes",
                "reviewed_date": '2017-05-27T00:00:00.000Z'
            }]);

            const reqPayload = {
                "review": "Pero deberia de poder cambiarle el idioma a alexa",
                "author": "WarcryxD",
                "store": "iTunes",
                "rating": 5,
                "title": "Excelente",
                "product_name": "Amazon Alexa"
            };

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

            const { result, statusCode } = await server.inject({
                method: 'post',
                url: `${basepath}/reviews`,
                payload: reqPayload
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });
        
        it('-Create review error - rating out of range', async () => {
            
            const reqPayload = {
                "review": "Pero deberia de poder cambiarle el idioma a alexa",
                "author": "WarcryxD",
                "store": "iTunes",
                "rating": 6,
                "title": "Excelente",
                "product_name": "Amazon Alexa"
            };

            const expectedResult = {
                statusCode: 400,
                error: 'Bad Request',
                message: 'child "rating" fails because ["rating" must be less than 6]',
                validation: { source: 'payload', keys: [ 'rating' ] }
              };

            const { result, statusCode } = await server.inject({
                method: 'post',
                url: `${basepath}/reviews`,
                payload: reqPayload
            });
            expect(statusCode).to.equal(400);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

    });

});