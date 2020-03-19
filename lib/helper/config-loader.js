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
 * Search all *.js file in given directory. Those which returning an object
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
    const keys = Object.keys(part)
    if (!keys.reduce((acc, val) => {
      return acc && typeof val === 'string'
    }, true)) {
      error(`All keys in file ${file} is not a string`)
    }

    keys.forEach(key => {
      if (!(part[key] instanceof Array)) {
        error(`All values in file ${file} is not an Array`)
      }
      config[key] = part[key]
    })
  }

  return config
}

function error(text) {
  return new Error(`Config Loader: ${text}`)
}
