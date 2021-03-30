"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = require("mongoose");
var app = express();
// app.use((req, res, next) => {
//   console.log('middle');
//   UserModel.findOne().then((users) => {
//     console.log(users);
//     next();
//   });
// });
mongoose
    .connect('mongodb+srv://admin:adminadmin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(function (x) {
    // console.log('connected');
    // UserModelBuilder({ email: 'adfasfs', password: 'gianni', name: 'paolo' })
    //   .save()
    //   .then((boh) => console.log(boh));
})
    .catch(function () { return console.log('error in connection'); });
app.listen(3210);
//# sourceMappingURL=server.js.map