'use strict';
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const pkg = require('../../package.json');
const {basepath, routers} = require("./modules.config.json");
const Hapi = require('hapi');
let server;

exports.init = async () => {
    if(!server) {
        server = new Hapi.Server({
            // debug: { log: ['*'], request: ['*'] },
        });

        server.connection({
            port: 3000,
            host: 'localhost'
        })

        server.on('log', (event, tags) => {
            if (tags.error) {
                console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
            }
        });
        // Register External Plugin
        await server.register([
            {
                'register': Inert,
                'options': {}
            },
            {
                'register': Vision,
                'options': {}
            }, 
            {
                'register': HapiSwagger,
                'options': {
                    info: {
                        'title': 'Alexa Reviews Rating API Documentation',
                        'version': pkg.version,
                    },
                    documentationPage: true,
                    documentationPath: `${basepath}/docs`,
                    jsonPath: `${basepath}/docs/swagger.json`,
                }
            }
        ]);
        // Register Internal Module as Plugin
        await loadPlugin(server, routers);
        server.table()[0].table.forEach((route) => console.log(`${route.method}\t${route.path}`));
        await server.initialize();
    } 
    return server;
};

async function loadPlugin(server, routers) {
    try {
        for(let plugin of routers) {
            if(plugin.active) {
                // route prefix suffix with basepath
                plugin.routes.prefix = basepath + plugin.routes.prefix; 
                await server.register({
                    register: require(`./modules/${plugin.name}`),
                    routes: plugin.routes,
                    options: plugin.options
                })
            }
        }
    } catch(e) {
        console.log("Unable to register internal module as plugin", e);
    }
}

exports.start = async () => {
    await this.init();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});