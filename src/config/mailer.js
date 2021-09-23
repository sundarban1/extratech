import nodemailer from 'nodemailer';

import logger from '../config/winston';
import * as emailTemplate from '../utils/email';

const senderEmail = '"Mome" <noreply@mome.com>';

/**
 * Setup config params
 *
 * @returns {Object}
 */

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Prepare payload for email.
 *
 * @param   {Object} params
 * @returns {Object}
 */
function preparePayLoad(params) {

  const subject = `Welcome to Mome`;
  const html = emailTemplate.render(params.template, {params});

  return {
    from: senderEmail,
    to: params.email,
    subject: subject,
    text: 'Hello world?',
    html: html,
  };
}

/**
 * Send email notification.
 *
 * @param   {Object} payload
 * @returns {Promise}
 */
function sendNotification(payload) {

  const transport = setup();

 return transport.sendMail(payload);
}

/**
 * Send email notification to user.
 *
 * @param   {Object} params [filename, email, subject]
 * @returns {Promise}
 */
export function notify(params) {

  let payload = preparePayLoad(params);

  try {
    const result = sendNotification(payload);
    logger.log('info', 'Email Request Payload:' + JSON.stringify(result));

    return result;
  } catch (err) {
    logger.log('error', 'Error sending notification to email.', err);
  }
}

