function isDate(dateStr) {
    return !isNaN(new Date(dateStr).getDate());
  }

  module.exports = isDate
