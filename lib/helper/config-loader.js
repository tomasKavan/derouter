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
const parseConfigObject = require('./config-object-parser.js')

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

    let partial = parseConfigObject(_part)

    // add function to config
    Object.assign(config, partial)
  }

  return config
}


function error(text) {
  return new Error(`Config Loader: ${text}`)
}
