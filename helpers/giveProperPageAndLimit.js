const paginationDefaults = require('./paginationDefaults')

function giveProperPageAndLimit(page, limit) {
    page = parseInt(page);
    limit = parseInt(limit);

    if (!page || page < 0) {
        page = paginationDefaults.page
    }
    if (!limit || limit < 0) {
        limit = paginationDefaults.limit
    }

    return { page: page, limit: limit }
}

module.exports = giveProperPageAndLimit