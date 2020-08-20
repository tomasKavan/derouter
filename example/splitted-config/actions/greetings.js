/*!
 * derouter
 * Copyright(c) 2020 Tomas Kavan
 * BSD 2-Clause Licensed
 */

module.exports = {
  today,
  greet
}

function today() {
  return new Date()
}

function greet(salutation, date, name) {
  return `${salutation}, ${name}! Today is ${date}`
}
