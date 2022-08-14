const moment = require('moment')

function isDate(date) {
    return moment(date, moment.ISO_8601, true).isValid();
  }

  module.exports = isDate
