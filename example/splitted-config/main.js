/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

/**
 * Basic example of derouter module usage.
 * Creates basic API server: 1 route GET /hello with 2 actions
 * To run use command: `node ./example/basic/main.js`
 * Application is running on the port 8083 (can be changed with
 * `--PORT` option).
 */

// Load modules
const express = require('express')
const derouter = require('../../main.js')

/**
 * Use relative path from main nodejs script file to routes
 * @type {string}
 */
const routerDeclarationPath = './routes'

const app = express()
app.use(derouter(routerDeclarationPath))

const port = 8083
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
