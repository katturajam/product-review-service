'use strict';
const {handleFailAction} = require('../../util/handleFailAction');
const { reviewController } = require('./review-controller');
const rc = new reviewController();
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const joi = BaseJoi.extend(Extension);


exports.register = async (server, options, next)  => {
    // initialize all ping module routers
    server.route([
        {
          method: 'GET',
          path: '/',
          handler: rc.listReview,
          config: {
            description: 'List review, Filter by store, rating, date',
            notes: 'Returns the short detail of reviw with resource location to get full details.',
            tags: ['api'], // ADD THIS TAG
            validate: {
                failAction: handleFailAction,
                query: joi.object({
                    "date": joi.date().format(['YYYY', 'YYYY-MM', 'YYYY-MM-DD']).raw().max('now'),
                    "store": joi.string().valid(['iTunes', 'GooglePlayStore']).insensitive(),
                    "rating": joi.number().min(1).max(5)
                }).unknown(false)
            }
          }
        },
        {
            method: 'POST',
            path: '/',
            handler: rc.createReview,
            config: {
                description: 'Create review into the system',
                notes: 'Save review into the system and return created review details.',
                tags: ['api'], // ADD THIS TAG
                validate: {
                    failAction: handleFailAction,
                    payload: joi.object({
                        "review": joi.string().allow('').trim().min(9).max(160),
                        "author": joi.string().trim().min(3).max(25),
                        "store": joi.string().trim().valid('iTunes', 'GooglePlayStore'),
                        "rating": joi.number().integer().greater(0).less(6),
                        "title": joi.string().trim().min(9).max(60),
                        "product_name": joi.string().trim().valid('Amazon Alexa'),
                        "date": joi.date().iso().max('now')
                    })
                }
            }
        },
        {
            method: 'GET',
            path: '/{review_id}',
            handler: rc.getReviewDetail,
            config: {
                description: 'Get review detail',
                notes: 'Retrive review  details using review id',
                tags: ['api'], // ADD THIS TAG
                validate: {
                    failAction: handleFailAction,
                    params: joi.object({
                        "review_id": joi.number().required()
                    })
                }
            }
        },
        {
            method: 'GET',
            path: '/ratings/stats',
            handler: rc.getRatingStats,
            config: {
                description: 'Get review statistics category of each rating, Filter by store, date',
                notes: 'Retrive review statistics category of each rating with Average rating',
                tags: ['api'], // ADD THIS TAG
                validate: {
                    failAction: handleFailAction,
                    query: joi.object({
                        "store": joi.string().valid(['iTunes', 'GooglePlayStore']).insensitive(),
                        "date": joi.date().format(['YYYY', 'YYYY-MM', 'YYYY-MM-DD']).raw().max('now')
                    }).unknown(false)
                }
            }
        }
    ]);
    next()
}



this.register.attributes = {
    pkg: require('./package.json')
}