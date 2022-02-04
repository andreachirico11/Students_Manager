if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import bodyParser = require('body-parser');
import * as express from 'express';
import * as mongoose from 'mongoose';
import { corsController } from './controllers/corsController';
import { createAdminUser } from './controllers/userController';
import { router } from './routes';
import checkForAutoPing from './utils/autoPingFn';
import { getEnvVariables } from './utils/getEnv';

checkForAutoPing();

const app = express(),
  ENV = getEnvVariables();

if (ENV.MONGO_CONNECTION_STRING) {
  mongoose
    .connect(ENV.MONGO_CONNECTION_STRING, {
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

if (ENV.TEST_USER) {
  const [email, password] = ENV.TEST_USER.split(',');
  if (email && password) {
    createAdminUser({
      email,
      name: 'admin',
      password,
    });
  }
}

app.listen(ENV.PORT ?? 3210, () => {
  console.log('listening');
});
