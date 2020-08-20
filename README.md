![npm](https://img.shields.io/npm/v/derouter)

# derouter
Declaratory router for express js

#Run
```json

```

## index.js file of app
```javascript
import express from 'express' // import express
import derouter from 'derouter' // import derouter
import bodyParser from 'body-parser' // import body-parser

const app = express() // setup express app

/**
 * Set body parsers
 */
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

/**
 * Load routes
 */
const routerDir = './src/routes/routes'

/**
 * 
 */
app.use(derouter(routerDir))
```