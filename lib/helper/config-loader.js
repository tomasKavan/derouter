/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

/**
 * Load 3rd party and core modules
 */

const p = require('path')
const fs = require('fs')

 /**
  * Expose load function
  */
exports = module.exports = load

/**
 * Search all *.js file in given directory. Those which returning an object. If file is es6 module, then default export
 * combine together with others.
 * TODO: search all subdirectories as well.
 *
 * @param String path
 * @return Object
 * @private
 */
function load(path) {
  const dir = p.join(require.main.path, path)

  const files = fs.readdirSync(dir).filter(item => item.match(/^.*\.js$/))

  const config = {}
  for (let i = 0; i < files.length; i++) {
    const file = p.join(dir, files[i])
    const part = require(file)
    if (!part || typeof part !== Object) {
      error(`File ${file} don't exports an object`)
    }

    // if es6 module -> then get object from part.default
    let _part = part
    if(_part.__esModule === true) {
      _part = _part.default
    }

    let prefix = (typeof _part.prefix === 'string')? _part.prefix : ''
    let middleware = (Array.isArray(_part.middleware))? _part.middleware : []
    for(const mid of middleware){
      if(typeof mid !== "function"){
        error('All middleware values must by function')
      }
    }

    let routes_method = Object.keys(_part.routes)
    for(const method of routes_method){
      let method_routes = Object.keys(_part.routes[method])
      for(const route_name of method_routes){
        config[method + ' ' + prefix + route_name] = {
          middleware: middleware,
          queue: _part.routes[method][route_name]
        }
      }
    }
    /*
    const keys = Object.keys(_part)
    if (!keys.reduce((acc, val) => {
      return acc && typeof val === 'string'
    }, true)) {
      error(`All keys in file ${file} is not a string`)
    }

    keys.forEach(key => {
      if (!(_part[key] instanceof Array)) {
        error(`All values in file ${file} is not an Array`)
      }
      config[key] = {
        middleware: [],
        queue: _part[key]
      }
    })
     */
  }

  return config
}

function _parseConfigObject(config){
  let prefix = (typeof config.prefix === 'string')? config.prefix : ''
  let middleware = (Array.isArray(config.middleware))? config.middleware : ''
  for(const mid of middleware){
    if(typeof mid !== "function"){
      error('All middleware values must by function')
    }
  }

  const out = {}
  let routes_method = Object.keys(config.routes)
  for(const method of routes_method){
    let method_routes = Object.keys(config.routes[method])
    for(const route_name of method_routes){
      out[method + ' ' + prefix + route_name] = {
        middleware: middleware,
        queue: config.routes[method][route_name]
      }
    }
  }
  return out
}

function error(text) {
  return new Error(`Config Loader: ${text}`)
}
