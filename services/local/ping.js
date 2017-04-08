module.exports = function (chat) {
    if (chat.text == "ping") {
        return "pong";
    }
    return null;
}