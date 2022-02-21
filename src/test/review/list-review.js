'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../app/server');
const { basepath } = require('../../app/modules.config.json')
const db = require('../../app/db/alexaReviewDB');
const { SinonHelper } = require('../helper/sinonHelper');

experiment('Review', { parallel: false }, () => {

    describe('GET /api/reviews', () => {
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

        it('+List empty review', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([]);
            const expectedResult = {
                totalResults: 0,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: []
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false });
        });

        it('+List review without filter', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            }]);
            const expectedResult = {
                totalResults: 1,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: [
                    {
                        id: 0,
                        rating: 1,
                        store: 'GooglePlayStore',
                        date: '2017-05-27T00:00:00.000Z',
                        location: 'http://localhost:3000/api/reviews/0'
                    }
                ]
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List review with filter equal by store', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            }]);
            const expectedResult = {
                totalResults: 1,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: [
                    {
                        id: 0,
                        rating: 1,
                        store: 'iTunes',
                        date: '2017-05-27T00:00:00.000Z',
                        location: 'http://localhost:3000/api/reviews/0'
                    }
                ]
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List empty review with filter equal by store', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'GooglePlayStore',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            }]);

            const expectedResult = {
                totalResults: 0,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: []
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List review with filter equal by store, date', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            },
            {
                id: 1,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2022-01-15T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/1'
            }]);
            const expectedResult = {
                totalResults: 1,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: [
                    {
                        id: 1,
                        rating: 1,
                        store: 'iTunes',
                        date: '2022-01-15T00:00:00.000Z',
                        location: 'http://localhost:3000/api/reviews/1'
                    }
                ]
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes&date=2022-01-15`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List review with filter equal by store, date, rating', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            },
            {
                id: 1,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2022-01-15T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/1'
            },
            {
                id: 2,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2022-01-30T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/2'
            }]);
            const expectedResult = {
                totalResults: 1,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: [
                    {
                        id: 2,
                        rating: 5,
                        store: 'iTunes',
                        date: '2022-01-30T00:00:00.000Z',
                        location: 'http://localhost:3000/api/reviews/2'
                    }
                ]
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes&date=2022-01-30&rating=5`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List empty review with filter equal by store, date', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            },
            {
                id: 1,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2022-01-15T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/1'
            },
            {
                id: 2,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2022-01-30T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/2'
            }]);
            const expectedResult = {
                totalResults: 0,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: []
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes&date=2022-01-29`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });

        it('+List empty review with filter equal by store, date, rating', async () => {
            let [dbFirstCall] = [dbMock.makeCallableCounter()]
            dbFirstCall.returns([{
                id: 0,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2017-05-27T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/0'
            },
            {
                id: 1,
                rating: 1,
                review_source: 'iTunes',
                reviewed_date: '2022-01-15T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/1'
            },
            {
                id: 2,
                rating: 5,
                review_source: 'iTunes',
                reviewed_date: '2022-01-30T00:00:00.000Z',
                location: 'http://localhost:3000/api/reviews/2'
            }]);
            const expectedResult = {
                totalResults: 0,
                itemsPerPage: 25,
                startIndex: 1,
                Resources: []
            };
            const { result, statusCode } = await server.inject({
                method: 'get',
                url: `${basepath}/reviews?store=itunes&date=2022-01-30&rating=4`
            });
            expect(statusCode).to.equal(200);
            expect(result).to.equal(expectedResult, { prototype: false })
        });
        
    });

});