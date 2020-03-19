/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

 /**
  * Partial router configuration. With hello route
  */
module.exports = {
  'GET /hello/:name' : [
    'action.today->date',
    'action.greet:#Greetings:&.date:params.name'
  ]
}
