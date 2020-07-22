/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

 /**
  * Partial router configuration. With ping route
  */
module.exports = {
  'GET /ping' : [

  ]
}

module.exports = {
    prefix: '/ping',
    middleware: [
        (req, res, next) => {
            console.log('mping1')
            next()
        },
        (req, res, next) => {
            console.log('mping2')
            next()
        }
    ],
    routes: {
        GET: {
            '/': [
                'ping'
            ]
        }
    }
}