import Joi from '@hapi/joi';

export default {
  store: Joi.object({
    first_name: Joi.string().required(),
    middle_name: Joi.string(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
    phone: Joi.string().min(10).required(),
    address: Joi.string(),
    dob: Joi.string().required(),
  }),

  addBank: Joi.object({
    bank_id: Joi.string().required(),
    bsb: Joi.string().min(6).max(6).required(),
    account: Joi.string().min(8).max(8).required(),
    balance: Joi.string().required(),
  }),
  transaction: Joi.object({
    amount: Joi.string().required(),
  }),
  makeRequest: Joi.object({
    amount: Joi.string().required(),
  }),
  topUp: Joi.object({
    bank_id: Joi.number().required(),
    balance: Joi.number().required(),
  }),
};
