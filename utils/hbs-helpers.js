module.exports = {
    ifEquals(a ,b, options) {
        if (a.toString() === b.toString()) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
}
