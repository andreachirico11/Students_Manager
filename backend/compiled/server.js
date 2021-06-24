"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var corsController_1 = require("./controllers/corsController");
var routes_1 = require("./routes");
var app = express();
var connStr = process.env.MONGO_CONNECTION_STRING;
if (connStr) {
    mongoose
        .connect(connStr, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(function (x) {
        console.log('connected');
    })
        .catch(function (e) { return console.log('error in connection:', e); });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsController_1.corsController);
app.use('/api', routes_1.router);
// createAdminUser({
//   email: 'admin@email',
//   name: 'admin',
//   password: 'admin',
// });
// // ACTUAL USER
app.listen(3210);
//# sourceMappingURL=server.js.map