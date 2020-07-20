/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

const c = require('../const.js')

/**
 * Expose parse function
 */
exports = module.exports = parse

/**
 * Parse function. Create a dictionary with all actions for each router
 * in format suitable for compilation.
 *
 * @param Object config
 * @return Array
 * @protected
 */
function parse(config) {
  if (!config || typeof config !== 'object') {
    throw error('config is not an object')
  }

  const parsed = []

  const keys = Object.keys(config)
  keys.forEach(key => {
    if (typeof key !== 'string') {
      throw error(`all keys needs to be strings. Found ${typeof key} (${key})`)
    }

    const res = parseRoute(key)
    res.handler = parseHandler(config[key])

    parsed.push(res)
  })

  return parsed
}

/**
 * Parse route and HTTP method from givven string
 *
 * @param String route White char separated string with method and route.
 * @return Object
 * @private
 */
function parseRoute(route) {
  const parts = route.split(' ');
  const res = {
    method: '',
    route: ''
  }
  switch(parts.length) {
    case 2:
      res.method = c.Methods[parts[0]]
      res.route = parts[1]
      break
    case 1:
      res.method = c.Methods.GET
      res.route = parts[0]
      break
    default:
    case 0:
      throw error('')
  }

  if (typeof res.method !== 'string') {
    throw error(`Unknown route method (route ${route})`)
  }

  if (typeof res.route !== 'string' || !res.route.length) {
    throw error(`Route is not string or is empty (route ${route})`)
  }

  return res
}

/**
 * Parse list of actions (handler) for one route
 *
 * @param {Array|String} handler
 * @return Array
 * @private
 */
function parseHandler(handler) {
  if (typeof handler === 'string') {
    handler = [handler]
  }

  if (!handler || !(handler instanceof Array)) {
    throw error('Handlers must be an array of strings')
  }

  // Assembly subhandler for each action
  return handler.map(def =>  {
    if (typeof def !== 'string') {
      throw error(`Handlers must be a string. Got ${typeof def}`)
    }

    return parseAction(def)
  })
}

/**
 * Parse action from string
 *
 * @param String def
 * @return Object
 * @private
 */
function parseAction(def) {
  const res = {
    path: '',
    params: [],
    returnKey: null
  }

  // Has return key?
  let split = def.split('->')
  if (split.length > 1) {
    res.returnKey = split[1]
    def = split[0]
  }

  // Parse params
  split = def.split(':')
  res.path = split[0]
  if (split.length > 1) {
    split.splice(0,1)
    res.params = split
  }

  // Parse each of params
  res.params = res.params.map(pDef => {
    const parsed = {
      type: c.ParamType.REQ_REF,
      addr: pDef
    }
    switch(pDef[0]) {
      case c.ParamType.CONST:
        parsed.addr = pDef.substring(1)
        parsed.type = pDef[0]
        break
      case c.ParamType.TMP_RES_REF:
        parsed.addr = pDef.substring(2)
        parsed.type = pDef[0]
        break
      case c.ParamType.REQ_BODY:
        parsed.addr = pDef.substring(1)
        parsed.type = pDef[0]
        break
    }

    if (parsed.type !== c.ParamType.CONST) {
      parsed.addr = parsed.addr.split('.')
    }

    return parsed
  })

  return res
}

/**
 * Creates new error instance with given text
 *
 * @param String text Description of error
 * @return Error
 * @private
 */
function error(text) {
  return new Error(`Router config default-parser error: ${text}`)
}
