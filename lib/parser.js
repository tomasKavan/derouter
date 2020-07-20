/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

/**
 * Import 3rd party module dependencies
 */

const express = require('express')

/**
 * Import local dependencies
 */

const c = require('./const.js')
const defaultParser = require('./parser/default-parser.js')
const actionFinder = require('./helper/action-finder.js')
const configLoader = require('./helper/config-loader.js')

/**
 * Expose config parsing
 */
exports = module.exports = parse

/**
 * Parse router configuration on input, creates and returns express js
 * router instance.
 *
 * @param Object config Router configuration. See TODO to find out how to
 *                      assembly the configuration object.
 * @param {String} formatHint
 * @return Object
 * @api public
 */
function parse(config, formatHint) {
  // if config is string it's path to file or directory. We need to
  // load real configuration first
  if (typeof config === 'string') {
    config = configLoader(config)
  }

  if (!config || typeof config !== 'object') {
    throw error('config is not an object')
  }

  // Parse input, select parser base on input format
  // TODO choose parse. For now only default parser is available
  const assembly = defaultParser(config)

  const expressRouter = express.Router()

  // Create routes for each assembly
  assembly.forEach(route => {
    // compile route handler
    const fn = compileHandler(route.handler)
    expressRouter[route.method](route.route, fn)
  })

  return expressRouter
}

/**
 * Compile handler for Express router
 *
 * @param Array handler Array of parsed actions
 * @return Function
 * @private
 */
function compileHandler(handler) {
  // wrapper - express router handler
  return async (req, res) => {

    // Result objects
    const tmpRes = {}
    let finalRes = null

    try {
      // For each action in handler find function, compile params and run
      for (let i = 0; i < handler.length; i++) {
        const action = handler[i]
        const fn = actionFinder(action.path)
        const params = compileParams(action.params, req, tmpRes)

        finalRes = await fn(...params)

        saveActionResult(action.returnKey, finalRes, tmpRes)
      }
    } catch (e) {
      processHandlerException(e, res)
      return
    }

    res.json(finalRes)
  }
}

/**
 * Compile parameters for an action. Returns an array of resolved params
 * values
 *
 * @param Array def Array of parametr definition
 * @param Object req Request object from HTTP request (from Express)
 * @param Object res Temporary results object
 * @return Array
 * @private
 */
function compileParams(def, req, res) {
  return def.map(defParam => {
    let val = null
    switch(defParam.type) {
      case c.ParamType.CONST:
        val = defParam.addr
        break
      case c.ParamType.REQ_REF:
        val = valueAtKeyPath(req, defParam.addr, true)
        break
      case c.ParamType.TMP_RES_REF:
        val = valueAtKeyPath(res, defParam.addr, true)
        break
      case c.ParamType.REQ_BODY:
        val = (req.body)? req.body[defParam.addr]: undefined
        break
    }
    return val
  })
}

/**
 *
 *
 * @param {Array|String} key Array of parametr definition
 * @param any res Value to store in temporary result obj
 * @param Object tmpRes Object for storing the value
 * @return Array
 * @private
 */
function saveActionResult(key, res, tmpRes) {
  if (typeof key === 'string') {
    key = key.split('.')
  }

  if (!key || !key.length) {
    return
  }

  let tmpObj = tmpRes
  for (let i = 0; i < key.length; i++) {
    if (i >= key.length - 2) {
      tmpObj[key] = res
      break;
    }

    if (!tmpObj[key]) {
      tmpObj[key] = {}
    }
    tmpObj = tmpObj[key]
  }
}

/**
 * Returns value in dictionary for given key path.
 *
 * @param Object def Array of parametr definition
 * @param {String|Array} req Request object from HTTP request (from Express)
 * @param Object res Temporary results object
 * @return Array
 * @private
 */
function valueAtKeyPath(dictionary, keyPath, tolerant) {
  if (typeof keyPath === 'string') {
    keyPath = keyPath.split('.')
  }

  if (!keyPath || !keyPath.length) {
    return
  }

  let tmpObj = dictionary
  for (let i = 0; i < keyPath.length; i++) {
    tmpObj = tmpObj[keyPath[i]]
    if (!tmpObj && i < keyPath.length - 1) {
      if (tolerant) {
        return undefined
      }
      throw error(`Unable to find value at keyPath ${keyPath}`)
    }
  }
  return tmpObj
}

/**
 * Compile handler for Express router
 *
 * @param Exception def Exception object to process
 * @param Object res Express response object
 */
function processHandlerException(e, res) {
  if (e.code < 500 && e.code > 399) {
    res.status(e.code).json({
      error: {
        code: e.code,
        text: e.toStr()
      }
    })
  } else {
    res.status(500).json({
      error: {
        code: e.code,
        text: 'Internal Server Error'
      }
    })
  }

  console.error(e)
}

/**
 * Creates new error instance with given text
 *
 * @param String text Description of error
 * @return Error
 * @private
 */
function error(text) {
  return new Error('Router config error:', text)
}
