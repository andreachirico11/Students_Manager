"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var app = express();
mongoose
    .connect('mongodb+srv://admin:adminadmin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(function (x) { return console.log('connected: '); })
    .catch();
app.listen(3210);
//# sourceMappingURL=server.js.map