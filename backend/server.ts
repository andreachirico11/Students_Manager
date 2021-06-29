if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import bodyParser = require('body-parser');
import * as express from 'express';
import * as mongoose from 'mongoose';
import { corsController } from './controllers/corsController';
import { router } from './routes';

const app = express();
const connStr = process.env.MONGO_CONNECTION_STRING;

if (connStr) {
  mongoose
    .connect(connStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((x) => {
      console.log('connected');
    })
    .catch((e) => console.log('error in connection:', e));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(corsController);
app.use('/api', router);

// createAdminUser({
//   email: 'admin@email',
//   name: 'admin',
//   password: 'admin',
// });
// // // ACTUAL USER

app.listen(3210);
