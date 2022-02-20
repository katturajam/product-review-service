'use strict';
exports.register = async (server, options, next) => {
    // initialize all ping module routers
    server.route([
        {
          method: 'GET',
          path: '/',
          config: {
            description: 'Health Check API',
            notes: 'Return the Health Check Response',
            tags: ['api'], // ADD THIS TAG
            handler: (request, reply) => { return reply('Pong!...'); }
          }
          
        }
    ])
    next();
}

this.register.attributes = {
    pkg: require('./package.json')
}
