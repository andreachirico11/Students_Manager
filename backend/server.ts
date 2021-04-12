import bodyParser = require('body-parser');
import * as express from 'express';
import * as mongoose from 'mongoose';
import { verifyToken } from './controllers/webTokenController';
import { router } from './routes';

const app = express();

mongoose
  .connect(
    'mongodb+srv://admin:admin@cluster0.fpac0.mongodb.net/students-manager-db?retryWrites=true"',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log('connected');
  })
  .catch((e) => console.log('error in connection:', e));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', router);

app.listen(3210);
