import * as express from 'express';
import * as mongoose from 'mongoose';

const app = express();
mongoose
  .connect(
    'mongodb+srv://admin:adminadmin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then((x) => console.log('connected: '))
  .catch();

app.listen(3210);
