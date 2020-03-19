/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

/**
 * Splitted config example of derouter module usage.
 * Creates basic API server: 1 route GET /hello with 2 actions
 * And 1 route GET /ping with 1 ation. Each route is declared in
 * separate file in ./router directory.
 * To run use command: `node ./example/splitted-config/main.js`
 * Application is running on the port 8083 (can be changed with
 * `--PORT` option).
 */

// Load modules
const express = require('express')
const derouter = require('../../main.js')

const routerDir = './router'

const app = express()

app.use(derouter(routerDir))

const port = 8083
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
