"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var routes_1 = require("./routes");
var app = express();
mongoose
    .connect('mongodb+srv://admin:admin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true"', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(function (x) {
    console.log('connected');
})
    .catch(function (e) { return console.log('error in connection:', e); });
app.use('/api', routes_1.router);
app.listen(3210);
//# sourceMappingURL=server.js.map