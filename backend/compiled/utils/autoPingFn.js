"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
function checkForAutoPing() {
    if (process.env.AUTO_PING_URL) {
        console.log('autoping is ON');
        var _a = process.env.AUTO_PING_URL.split(','), autoPingUrl_1 = _a[0], autoPingtime = _a[1];
        setInterval(function () {
            http.get(autoPingUrl_1, function (res) {
                console.log('PING');
            });
        }, Number(autoPingtime));
    }
}
exports.default = checkForAutoPing;
//# sourceMappingURL=autoPingFn.js.map