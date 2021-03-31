import * as express from 'express';
import * as mongoose from 'mongoose';
import { UserModelBuilder, UserModel } from './models/userModel';

const app = express();

// app.use((req, res, next) => {
//   console.log('middle');

//   UserModel.findOne().then((users) => {
//     console.log(users);
//     next();
//   });
// });

mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true&w=majority"',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log('connected');

    // UserModelBuilder({ email: 'adfasfs', password: 'gianni', name: 'paolo' })
    //   .save()
    //   .then((boh) => console.log(boh));
  })
  .catch((e) => console.log('error in connection:', e));

app.listen(3210);
