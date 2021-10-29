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

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },

//   // By default, multer removes file extensions so let's add them back
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `/${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'jpg') {
    cb(null, true);
  } else {
    cb(new Error('Not a Jpg File!!'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

app.post('/uploadPicture', upload.single('image'), function (req, res, next) {
  const photo = req.file.filename;

  try {
    let id = 1;
    const newFile = new User({ id }).save({
      image: req.file.filename,
    });
    res.status(200).json({
      status: 'success',
      message: 'File created successfully!!',
    });
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
