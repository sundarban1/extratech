import multer from 'multer';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      // res.status(422).json({ error: 'Only .png, .jpg and .jpeg format allowed!' });
      console.log('Only .png, .jpg and .jpeg format allowed!');
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});
