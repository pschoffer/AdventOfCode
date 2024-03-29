const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const mul = (arr) => arr.reduce((a, b) => a * b, 1);
function group(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

module.exports = {
    sum,
    mul,
    group
}