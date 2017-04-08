var WikichatLogger = {
    log: [],
}

WikichatLogger.add = function (chat) {
    this.log.push(chat);
    this.log = this.keepLastElements(this.log, 300);
}
WikichatLogger.keepLastElements = function (arr, n) {
    if (arr.length > n) arr.splice(0, arr.length - n);
    return arr;
}

module.exports = WikichatLogger;
