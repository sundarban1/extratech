import path from 'path';
import app from './config/express';
import routes from './routes/index.route';
import swagger from './config/swagger';
import * as errorHandler from './middlewares/errorHandler';
import joiErrorHandler from './middlewares/joiErrorHandler';
import requestLogger from './middlewares/requestLogger';
import jsonHandler from './middlewares/jsonHandler';
import multer from 'multer';
import { helpers } from 'handlebars';
import User from '../src/models/user.model';

// Swagger API documentation
app.get('/swagger.json', (req, res) => {
  res.json(swagger);
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post('/uploadPicture', upload.single('image'), function (req, res, next) {
  const photo = req.file.filename;
  const id = 1;
  let user = new User({ id })
    .save({
      image: photo,
    })
    .then((data) => {
      res
        .status(200)
        .json({ user: data, image: `http://${process.env.APP_HOST}/img/${data.get('image')}` });
    });

  try {
  } catch (error) {
    console.log(error);
  }

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there we
});

// app.post('/uploadPicture', (req, res) => {
//   // let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');
// });

// Request logger
app.use(requestLogger);

// JSON body validation
app.use(jsonHandler);

// Router
app.use('/api', routes);

// Landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Joi Error Handler Middleware
app.use(joiErrorHandler);

// Error Handler Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.notFound);
app.use(errorHandler.methodNotAllowed);

app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server running at http://${app.get('host')}:${app.get('port')}`);
});

export default app;
