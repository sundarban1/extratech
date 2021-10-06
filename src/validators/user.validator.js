import Joi from '@hapi/joi';

export default {
  store: Joi.object({
    first_name: Joi.string().required(),
    middle_name: Joi.string(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().min(6).required(),
  }),

  signup: Joi.object({
    first_name: Joi.string().required(),
    middle_name: Joi.string(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().min(6).required(),
  }),

  update: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    status: Joi.number().integer().required(),
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
