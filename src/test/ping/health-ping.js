'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../../app/server');
const { basepath } = require('../../app/modules.config.json');

experiment('Ping', { parallel: false }, () => {

    describe('GET /api/ping', () => {
        let server;

        beforeEach(async () => {
            server = await init();
        });

        afterEach(async () => {
            // await server.stop();
        });

        it('+Healthcheck', async () => {
            const res = await server.inject({
                method: 'get',
                url: `${basepath}/ping`
            });
            expect(res.statusCode).to.equal(200);
        });
    });

});