if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import bodyParser = require('body-parser');
import * as express from 'express';
import * as mongoose from 'mongoose';
import { corsController } from './controllers/corsController';
import { createAdminUser } from './controllers/userController';
import { TeacherModelBuilder } from './models/teacherModel';
import { router } from './routes';
import checkForAutoPing from './utils/autoPingFn';

checkForAutoPing();

const app = express();

const connStr = process.env.MONGO_CONNECTION_STRING;
let testUser: { password: string; email: string } | null = null;
if (process.env.TEST_USER) {
  const [email, password] = process.env.TEST_USER.split(',');
  testUser = { email, password };
}

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

if (testUser) {
  createAdminUser({
    email: testUser.email,
    name: 'admin',
    password: testUser.password,
  });
}

app.listen(process.env.PORT ?? 3210, () => {
  console.log('listening');
});
