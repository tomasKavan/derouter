/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

 /**
  * Expose load function
  */
exports = module.exports = configObjectParser

function configObjectParser (conf){
  const partial = {}

  const prefix = (typeof conf.prefix === 'string')? conf.prefix : ''
  const middleware = (Array.isArray(conf.middleware))? conf.middleware : []
  for(const mid of middleware){
    if(typeof mid !== "function"){
      error('All middleware values must by function')
    }
  }

  let routes_method = Object.keys(conf.routes)
  for(const method of routes_method){
    let method_routes = Object.keys(conf.routes[method])
    for(const route_name of method_routes){
      partial[method + ' ' + prefix + route_name] = {
        middleware: middleware,
        queue: conf.routes[method][route_name]
      }
    }
  }

  return partial;
}

function error(text) {
  return new Error(`Config Loader: ${text}`)
}
