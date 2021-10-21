import express from 'express';
import * as bankCtrl from '../controllers/bank.controller';
import isAuthenticated from '../middlewares/authenticate';
import validate from '../config/joi.validate';
import userSchema from '../validators/user.validator';

const router = express.Router();

router.route('/').get(bankCtrl.findAllBank);

export default router;
