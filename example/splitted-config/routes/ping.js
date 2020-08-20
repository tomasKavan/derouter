/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

 /**
  * Partial routes configuration. With ping route
  */
module.exports = {
  'GET /ping' : [

  ]
}

module.exports = {
    prefix: '/ping',
    middleware: [
        (req, res, next) => {
            console.log('--- ping middleware 1 ---')

            next()
        },
        (req, res, next) => {
            console.log('--- ping middleware 2 ---')

            next()
        }
    ],
    routes: {
        GET: {
            '/': [
                'actions.ping'
            ]
        }
    }
}