'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../app/server');
const { basepath } = require('../../app/modules.config.json')
const db = require('../../app/db/alexaReviewDB');
const { SinonHelper } = require('../helper/sinonHelper');

experiment('Rating Statistics', { parallel: false }, () => {

    describe('GET /alexa/reviews/ratings/stats', () => {
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

        it('+Category wise total and average rating without filter', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 6,
                netRating: 20,
                averageRating: 3.3,
                category: [
                  { rating: 5, totalReview: 2, totalRating: 10 },
                  { rating: 4, totalReview: 1, totalRating: 4 },
                  { rating: 3, totalReview: 1, totalRating: 3 },
                  { rating: 2, totalReview: 1, totalRating: 2 },
                  { rating: 1, totalReview: 1, totalRating: 1 }
                ]
              };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });
        
        it('+Category wise total and average rating with filter equal by Store', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 1,
                netRating: 5,
                averageRating: 5,
                category: [ { rating: 5, totalReview: 1, totalRating: 5 } ]
              };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats?store=GooglePlayStore`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

        it('+Category wise total and average rating with filter equal by Store, Date format YYYY', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 5, 
                netRating: 15,
                averageRating: 3,
                category: [
                  { rating: 5, totalReview: 1, totalRating: 5 },
                  { rating: 4, totalReview: 1, totalRating: 4 },
                  { rating: 3, totalReview: 1, totalRating: 3 },
                  { rating: 2, totalReview: 1, totalRating: 2 },
                  { rating: 1, totalReview: 1, totalRating: 1 }
                ]
              };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats?store=itunes&date=2017`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

        it('+Category wise total and average rating with filter equal by Store, Date format YYYY-MM', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 5, 
                netRating: 15,
                averageRating: 3,
                category: [
                  { rating: 5, totalReview: 1, totalRating: 5 },
                  { rating: 4, totalReview: 1, totalRating: 4 },
                  { rating: 3, totalReview: 1, totalRating: 3 },
                  { rating: 2, totalReview: 1, totalRating: 2 },
                  { rating: 1, totalReview: 1, totalRating: 1 }
                ]
              };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats?store=itunes&date=2017-05`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

        it('+Category wise total and average rating with filter equal by Store, Date format YYYY-MM-DD', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 5, 
                netRating: 15,
                averageRating: 3,
                category: [
                  { rating: 5, totalReview: 1, totalRating: 5 },
                  { rating: 4, totalReview: 1, totalRating: 4 },
                  { rating: 3, totalReview: 1, totalRating: 3 },
                  { rating: 2, totalReview: 1, totalRating: 2 },
                  { rating: 1, totalReview: 1, totalRating: 1 }
                ]
              };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats?store=itunes&date=2017-05-27`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

        it('+Category wise total and average rating with filter equal by Store, Date format YYYY-MM', async () => {
            let [dbFirstCall, dbSecondCall, dbThirdCall, dbFourthCall, dbFifthCall] = [dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter(), dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/0'
            }]);
            dbSecondCall.returns([{
                id: 1,
                rating: 2,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/1'
            }]);
            dbThirdCall.returns([{
                id: 2,
                rating: 3,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/2'
            }]);
            dbFourthCall.returns([{
                id: 3,
                rating: 4,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/3'
            }]);
            dbFifthCall.returns([{
                id: 4,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/4'
            },
            {
                id: 5,
                rating: 5,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/alexa/reviews/5'
            }]);
            const expectedResult = {
                netReview: 1,
                netRating: 5,
                averageRating: 5,
                category: [ { rating: 5, totalReview: 1, totalRating: 5 } ]
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews/ratings/stats?store=googleplaystore&date=2017-05`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });
    });

});