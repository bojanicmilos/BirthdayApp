function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}

module.exports = checkIfDuplicateExists