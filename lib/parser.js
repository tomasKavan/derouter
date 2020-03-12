/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

/**
 * Import 3rd party module dependencies
 */

import express from 'express'

/**
 * Import local dependencies
 */

import const from './const.js'
import defaultParser from './parser/default-parser.js'
import actionFinder from './helper/action-finder.js'

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
  const expressRouter = express.Router()

  if (!config || typeof config !== 'object') {
    throw error('config is not an object')
  }

  // Parse input, select parser base on input format
  // TODO choose parse. For now only default parser is available
  const assembly = defaultParser(config)

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
      case const.ParamType.CONST:
        val = defParam.addr
        break
      case const.ParamType.REQ_REF:
        val = valueAtKeyPath(req, defParam.addr, true)
        break
      case const.ParamType.TMP_RES_REF:
        val = valueAtKeyPath(res, defParam.addr, true)
        break
    }
    return val
  })
}

/**
 *
 *
 * @param Array def Array of parametr definition
 * @param Object req Request object from HTTP request (from Express)
 * @param Object res Temporary results object
 * @return Array
 * @private
 */
function saveActionResult(key, res, tmpRes) {
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
