/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
exports.sendEmailConfirmation = functions.database.ref('/users/{uid}').onWrite((event) => {
  let body = '';
  const snapshot = event.data;
  const val = snapshot.val();
  const mailOptions = {
    from: '"PX CLI" <noreply@firebase.com>',
    to: 'cla@ge.com',
  };

  // Building Email message.
  mailOptions.subject = 'Predix UI CLA form submission';
  let recordKeys = Object.keys(val)
  recordKeys.forEach( aKey => body = body.concat(`${aKey} : ${val[aKey]}\n`))
  mailOptions.text = body;

  return mailTransport.sendMail(mailOptions)
    .then(() => console.log(`New CLA sign up:`))
    .catch((error) => console.error('There was an error while sending the email:', error));
});
