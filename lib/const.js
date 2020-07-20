/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

'use strict'

/**
 * Supported HTTP methods
 */
const Methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}

/**
 * Route handler action param type
 */
const ParamType = {
  CONST: '#',
  REQ_REF: '',
  TMP_RES_REF: '&',
  REQ_BODY: '$'
}

/**
 * Exports constants and enums
 */
module.exports = {
  Methods,
  ParamType
}
