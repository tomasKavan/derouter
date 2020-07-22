/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

 /**
  * Partial router configuration. With hello route
  */
 /*
module.exports = {
  'GET /hello/:name' : [
    'action.today->date',
    'action.greet:#Greetings:&.date:params.name'
  ]
}
*/

module.exports = {
    /**
     *
     */
    prefix: '/hello',
    /**
     * Middleware has to be in correct ExpressJS middleware format
     * (req, res, next) => { ... next() }
     * -> middleware will be applied for all defined routes
     */
    middleware: [
        async (req, res, next) => {
            console.log('m1')
            next()
        },
        async (req, res, next) => {
            console.log('m2')
            next()
        },
        async (req, res, next) => {
            console.log('m3')
            next()
        }
    ],
    /**
     * Routes - object, with HTTP methods {
     *     GET:
     *     POST:
     *     PUT:
     *     DELETE:
     * }
     */
    routes: {
        GET: {
            '/:name': [
                'action.today->date',
                'action.greet:#Greetings:&.date:params.name'
            ],
            '/': [
                'action.today->date',
                'action.greet:#Greetings:&.date:params.name'
            ]
        },
        POST: {
            '': [
                'action.today->date',
                'action.greet:#Greetings:&.date:params.name'
            ],
        }
    }
}