import express from 'express';
import * as bankCtrl from '../controllers/bank.controller';

const router = express.Router();

router.route('/').get(bankCtrl.findAllBank);

export default router;
