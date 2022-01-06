import express from 'express';
import isAuthenticated from '../middlewares/authenticate';
import * as bankCtrl from '../controllers/bank.controller';

const router = express.Router();

router.route('/').get(isAuthenticated, bankCtrl.findAllBank);

export default router;
