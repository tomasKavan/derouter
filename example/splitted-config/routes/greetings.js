/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

 /**
  * Partial routes configuration. With hello route
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
            console.log('--- greetings middleware 1 ---')

            next()
        }
    ],
    /**
     * Routes - object, with HTTP methods {
     *     GET: {
     *         '/route_name/:params': [
     *             'action1',
     *             'action2'
     *         ]
     *     }
     *     POST:
     *     PUT:
     *     DELETE:
     * }
     */
    routes: {
        GET: {
            '/:name': [
                'actions.greetings.today->date',
                'actions.greetings.greet:#Greetings:&.date:params.name'
            ]
        },
        POST: {
            '': [
                'actions.greetings.today->date',
                'actions.greetings.greet:#Greetings:&.date:params.name'
            ],
        }
    }
}