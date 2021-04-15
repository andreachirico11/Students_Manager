"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var corsController_1 = require("./controllers/corsController");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsController_1.corsController);
app.use('/api', routes_1.router);
app.listen(3210);
//# sourceMappingURL=server.js.map