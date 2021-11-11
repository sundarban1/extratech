import HttpStatus from 'http-status-codes';
import * as userService from '../services/user.service';
import * as bankService from '../services/bank.service';
import * as imagevalidator from '../imageValidator/user.image';
import { notify } from '../config/mailer';
import * as CustomerService from '../services/customer.service';
import User from '../models/user.model';
import UserBank from '../models/user_bank.model';
import multer from 'multer';
import { compareSync } from 'bcrypt';

/**
 * Find all the users
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} nextuser.model
 */
export function findAll(req, res, next) {
  userService
    .getAllUser()
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 *  Find user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findById(req, res, next) {
  userService
    .getUser(req.params.id)
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 * Store new user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function store(req, res, next) {
  try {
    userService
      .storeUser(req.body)
      .then((data) => {
        const param = data.attributes;
        // const id = data.attributes.id;
        param.template = 'welcome';
        param.confirmationUrl = CustomerService.generateConfirmationUrl(param.token);
        notify(param);
        res.status(200).json({ data });
      })
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);
  }
}
export function makeRequest(req, res, next) {
  try {
    const req_amount = req.body.amount;
    const sender_id = req.params.sender_id;

    // res.json({ sender_id: sender_id, receiver_id: receiver_id, bank_id: bank_id });

    User.query({ where: { id: sender_id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));
        if (data == null) {
          res.status(422).json({ error: 'The user not exists' });
        } else if (data.get('status') != 1) {
          res.status(422).json({ error: 'The user is not activated' });
        } else if (amount < req_amount) {
          res.status(422).json({ error: 'The sender has not enough money to send' });
        } else {
          bankService.reduceSenderAmount(req.body, req.params);
          bankService.increaeReceiverAmount(req.body, req.params);
          res.status(200).json({ success: 'Transfer Succesfully.' });
        }
      });
  } catch (err) {
    console.log(err);
  }
}

export function transaction(req, res, next) {
  var sender_id = req.params.sender_id;
  var receiver_id = req.params.receiver_id;
  var sent_amount = parseFloat(req.body.amount);
  try {
    User.query({ where: { id: receiver_id } })
      .fetch({ require: false })
      .then((data) => {
        if (data == null) {
          res.status(422).json({ error: 'The user is not exist' });
        } else if (data.get('status') != 1) {
          res.status(422).json({ error: 'The user is not activated' });
        } else {
          User.query({ where: { id: sender_id } })
            .fetch({ require: false })
            .then((data) => {
              const amount = parseFloat(data.get('amount'));

              if (amount < 1) {
                res.status(422).json({ error: 'Please recharge your account.' });
              } else {
                if (amount < sent_amount) {
                  res
                    .status(422)
                    .json({ error: 'You do not have enough balance to make this transaction.' });
                } else {
                  bankService.reduceSenderAmount(req.body, req.params);
                  bankService.increaeReceiverAmount(req.body, req.params);
                  res.status(200).json({ success: 'Transfer Succesfully.' });
                }

                // notify(param);
              }
            });
        }
      });
  } catch (error) {
    console.log(error);
  }
}

export function addBank(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  let token = authorizationHeader.split(' ')[1];
  bankService.checkBank(req.body).then((data) => {
    if (data == null) {
      res.status(422).json({ error: 'Bank does not exist.' });
    } else {
      userService.checkExistingAccount(req.body).then((data) => {
        if (data != null) {
          res.status(422).json({ error: 'This account is already existed.' });
        } else {
          userService
            .addBank(req.body, token)
            .then((bank) => res.status(200).json({ bank }))
            .catch((err) => next(err));
        }
      });
    }
  });
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// var upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       // res.status(422).json({ error: 'Only .png, .jpg and .jpeg format allowed!' });
//       console.log('Only .png, .jpg and .jpeg format allowed!');
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   },
// }).single();

// const upload = multer().single('avatar');

export function profilePicture(req, res, next) {
  const photo = req.file.filename;
  const id = req.params.user_id;
  try {
    var upload = multer({
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
          res.status(200).json({ error: 'Only .png, .jpg and .jpeg format allowed!' });
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      },
    }).single('image');

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        //A multer errror occur when uploading
        res.status(422).json({ error: 'multer errror occur when uploading' });
      } else if (err) {
        //An unknown error occur when uplaoding
        res.status(422).json({ error: 'An unknown error occur when uplaoding' });
      }
      // everything went fine here
      let user = new User({ id })
        .save({
          image: photo,
        })
        .then((data) => {
          res.status(200).json({
            success: 'Photo is uploaded successfully',
            user: data,
            image: `http://${process.env.APP_HOST}/img/${data.get('image')}`,
          });
        });
    });
  } catch (error) {
    console.log(error);
  }
}

export function topUP(req, res, next) {
  const bank_id = req.body.bank_id;
  const sent_balance = req.body.balance;
  const user_id = req.params.user_id;

  try {
    UserBank.query({ where: { bank_id: bank_id, user_id: user_id } })
      .fetch({ require: false })
      .then((data) => {
        var balance = parseFloat(data.get('balance'));
        if (balance < sent_balance) {
          res.status(422).json({ error: 'You have insufficient balance to top up.' });
        } else {
          UserBank.query({ where: { bank_id: bank_id, user_id: user_id } })
            .fetch({ require: false })
            .then((data) => {
              const id = data.get('id');
              return new UserBank({ id }).save({
                balance: balance - sent_balance,
              });
            });
          userService.increaseUserAmount(req.body, req.params);

          res.status(422).json({ success: 'The top up is successful.' });
        }
      });
  } catch (error) {
    console.log(error);
  }
}

export function accountConfirmation(req, res, next) {
  const { token } = req.query;
  const data = req.attributes;

  userService
    .verifyAccount(token)
    .then((data) => {
      if (undefined === data) {
        res.sendFile(path.join(__dirname, '../../public/customer/link_expired.html'));
      } else {
        res.sendFile(path.join(__dirname, '../../public/customer/account_verified.html'));
      }
    })
    .catch((err) => console.log(err));
}

/**
 * Update user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function update(req, res, next) {
  userService
    .updateUser(req.params.id, req.body)
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 * Destroy user by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function destroy(req, res, next) {
  userService
    .deleteUser(req.params.id)
    .then((data) => res.status(HttpStatus.NO_CONTENT).json({ data }))
    .catch((err) => next(err));
}

export function register(req, res, next) {
  res.json({ data: req.body });
}
