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

const c = require('../const.js')

/**
 * Module global variables
 */
 const actionCache = {}

/**
 * Expose find function
 */
exports = module.exports = find

/**
 * Search an action on given path. The action function can be nested
 * in js module eg.: module.someObj.action(). This function is searching
 * path and try to find action in top-level file. If it's not found it
 * moves on parent directory etc.
 *
 * Eg. Whe ave an action path: `model/project/create` or ``['model', 'project',
 * 'create']` the `create` function can be in `project.js` file in model
 * directory. If not it is searched in `model.js` under key path
 * `project.create`.
 *
 * When action is found is cached for future usage.
 *
 * @param {Array|String} path Array of string or slash separated string
 *                            with path to the function
 * @return Function
 * @public
 */
function find(path) {
  if (typeof path !== 'string' && !(path instanceof Array)) {
    throw error('path must be an array or dot separated string.')
  }

  let pathArr = path
  if (typeof pathArr === 'string') {
    pathArr = pathArr.split('.')
  }
  path = pathArr.join('/')

  if (pathArr.length < 1) {
    throw error('Path must have atleast 1 component.')
  }

  // Try find action in cache
  if (typeof actionCache[path] === 'function') {
    return actionCache[path]
  }

  // Not in cache - try to find it in modules
  for (let i = pathArr.length; i > 0; i--) {
    // Construct path to module and keyPath in module
    const file = p.join(
      require.main.path,
      pathArr.slice(0,i).join('/') + '.js'
    )
    const keyPath = pathArr.slice(i)

    try {
      if (!fs.existsSync(file)) {
        throw 'file not exists'
      }

      // load module
      let actionModule = require(file)

      // traverse thru keyPath
      for (let j = 0; j < keyPath.length; j++) {
        actionModule = actionModule[keyPath[j]]
        if (!actionModule) {
          throw 'action not exists'
        }
      }

      if (typeof actionModule !== 'function') {
        throw 'action is not a function'
      }

      // store action in cache
      actionCache[path] = actionModule

      return actionModule

    } catch(err) {}
  }

  throw error('Action not found')
}

/**
 * Creates new error instance with given text
 *
 * @param String text Description of error
 * @return Error
 * @private
 */
function error(text) {
  return new Error(`Action Finder: ${text}`)
}
