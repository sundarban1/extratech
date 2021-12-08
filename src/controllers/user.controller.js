import HttpStatus from 'http-status-codes';
import * as userService from '../services/user.service';
import * as bankService from '../services/bank.service';
import * as imagevalidator from '../imageValidator/user.image';
import { notify } from '../config/mailer';
import * as CustomerService from '../services/customer.service';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
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
    .then((data) => {
      const param = data.attributes;
      param.image_path = `http://${process.env.APP_HOST}:8000/img/${data.get('image')}`;
      res.json({ data });
    })
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
    userService.getUserByEmail(req.body.email).then((user) => {
      if (user !== null) {
        res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ error: true, message: req.body.email + ' already exist.' });
      } else {
        userService.getUserByPhone(req.body.phone).then((user) => {
          if (user !== null) {
            res
              .status(HttpStatus.UNPROCESSABLE_ENTITY)
              .json({ error: true, message: req.body.phone + ' already exist.' });
          } else {
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
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

//History
export function history(req, res, next) {
  userService
    .getHistory()
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

//History of the transaction
export function transactioHistory(req, res, next) {
  const id = req.params.user_id;

  User.query({ where: { id: id } })
    .fetch({ required: false })
    .then((data) => {
      const total_sent = data.get('total_sent');
      const total_recieve = data.get('total_receive');
      Transaction.query({ where: { user_id: id } })
        .fetch({ required: false })
        .then((data) => {
          const sender_id = data.get('sender_id');
          const receiver_id = data.get('receiver_id');

          User.query({ where: { id: receiver_id } })
            .fetch({ required: false })
            .then((data) => {
              const receiver_name = data.get('first_name');

              User.query({ where: { id: sender_id } })
                .fetch({ required: false })
                .then((data) => {
                  const sender_name = data.get('first_name');

                  res
                    .status(200)
                    .json({ success: `${sender_name}, send, ${receiver_name}, ${total_sent}` });
                  res
                    .status(200)
                    .json({ success: `${receiver_name}, send, ${sender_name}, ${total_recieve}` });
                });
            });
        });
    });
}

export function handleRequest(req, res, next) {
  // res.json({ name: 'ramesh' });
  const user_id = req.params.id;
  const transaction_id = req.params.transaction_id;
  const status = req.query.status;

  try {
    Transaction.query({ where: { id: transaction_id } })
      .fetch({ require: true })
      .then((data) => {
        const transaction_status = data.get('status');
        if (transaction_status != 'pending') {
          res.status(422).json({ error: 'Your transaction is already completed' });
        } else {
          if (status == 'accept') {
            var response = userService.reduceSenderAmount(transaction_id, user_id);

            if (!response) {
              res
                .status(422)
                .json({ error: 'you do not have enough balance to make the transaction.' });
            } else {
              userService.increaseReceiverAmount(transaction_id);

              //Change the status of transaction from pending to Complete
              return new Transaction({ id: transaction_id })
                .save({
                  status: 'Complete',
                })
                .then((data) => {
                  res.status(200).json({ success: 'Your transaction was successful.' });
                });
            }

            //
          } else {
            //If the user cancel the Transaction then set the Status in the Transaction table to Cancel.
            return new Transaction({ id: transaction_id }).save({
              status: 'cancel',
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
}

export function makeRequest(req, res, next) {
  try {
    const req_amount = req.body.amount;
    const sender_id = req.params.sender_id;

    // res.json({ sender_id: sender_id, receiver_id: receiver_id, bank_id: bank_id });
    // notify(params)

    User.query({ where: { id: sender_id } })
      .fetch({ require: false })
      .then((data) => {
        const amount = parseFloat(data.get('amount'));
        if (data == null) {
          res.status(422).json({ error: 'The user not exists' });
        } else if (data.get('status') != 1) {
          res.status(422).json({ error: 'The user is not activated' });
        } else {
          bankService.requestAmount(req.body, req.params);
          // bankService.reduceSenderAmount(req.body, req.params);
          // bankService.increaeReceiverAmount(req.body, req.params);
          res.status(200).json({ success: 'Your request has been sent.' });
          // res.status(200).json({ success: 'Transfer Succesfully.' });
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
                  //record transaction in transaction bank
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
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
}).single();

// const upload = multer().single('avatar');

export function profilePicture(req, res, next) {
  const photo = req.file.filename;
  const id = req.params.user_id;
  try {
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
  try {
    userService
      .updateUser(req.params.id, req.body)
      .then((data) => res.json({ data }))
      .catch((err) => next(err));
  } catch (err) {
    console.log(err, 'err');
  }
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
