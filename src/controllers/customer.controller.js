import HttpStatus from 'http-status-codes';

import * as CustomerService from '../services/customer.service';
import {notify} from '../config/mailer';
import Address from "../models/address.model";

/**
 * Find all the customers
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findAll(req, res, next) {
  CustomerService.getAllCustomer()
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 *  Find customer by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function findById(req, res, next) {
  CustomerService.getCustomer(req.params.id)
    .then((data) =>
      {
        Address.getAddressById(data.attributes.id)
          .then(customer=>{
               data.attributes.address = customer;
               res.json({data});
          });
      }
    )
    .catch((err) => next(err));
}

/**
 * Store new customer
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function store(req, res, next) {

  CustomerService.getCustomerByEmail(req.body.email)
    .then(user => {
      if (user !== null) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ 'error':true, message: req.body.email + ' already exist.' });
      } else {
        CustomerService.getCustomerByPhone(req.body.phone)
          .then(user => {
            if (user !== null) {
              res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ 'error':true, message: req.body.phone + ' already exist.' });
            } else {
              CustomerService
                .storeCustomer(req.body)
                .then(data => {

                  const param = data.attributes;
                  param.template = 'welcome';
                  param.confirmationUrl = CustomerService.generateConfirmationUrl(param.remember_token);

                  notify(param);

                  res.status(HttpStatus.CREATED).json({ data });
                });
            }
          });
      }
    })
    .catch((err) => next(err));
}

/**
 * Update customer by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function update(req, res, next) {
  CustomerService.updateCustomer(req.params.id, req.body)
    .then((data) => res.json({ data }))
    .catch((err) => next(err));
}

/**
 * Destroy customer by id
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export function destroy(req, res, next) {
  CustomerService.deleteCustomer(req.params.id)
    .then((data) => res.status(HttpStatus.NO_CONTENT).json({ data }))
    .catch((err) => next(err));
}
