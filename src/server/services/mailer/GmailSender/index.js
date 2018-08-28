/* eslint-disable no-console, no-underscore-dangle */
// https://developers.google.com/gmail/api/quickstart/nodejs?refresh=1
// https://stackoverflow.com/questions/34546142/gmail-api-for-sending-mails-in-node-js
// https://stackoverflow.com/questions/50540051/gmail-api-send-text-and-html-in-one-mail
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://mail.google.com/',
  // 'https://www.googleapis.com/auth/gmail.modify',
  // 'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
];

export default class GmailSender {
  constructor(config) {
    this.config = config;
    ({
      credentialsFile: this.credentialsFile,
      tokenFile: this.tokenFile,
    } = this.config);
    this.loadFilePromises = {};
  }

  _loadJson(type, filepath) {
    if (this.loadFilePromises[type]) {
      return this.loadFilePromises[type];
    }
    this.loadFilePromises[type] = new Promise((resolve, reject) => {
      fs.readFile(filepath, (err, content) => {
        if (err) {
          this.loadFilePromises[type] = null;
          return reject(new Error(`Error loading client secret file: ${err}`));
        }
        try {
          return resolve(JSON.parse(content));
        } catch (e) {
          this.loadFilePromises[type] = null;
          return reject(e);
        }
      });
    });
    return this.loadFilePromises[type];
  }

  loadCredentials() {
    return this._loadJson('credentials', this.credentialsFile);
  }

  loadToken() {
    return this._loadJson('token', this.tokenFile);
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   */
  authorize() {
    return this.loadCredentials()
    .then((credentials) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
      );

      return this.loadToken()
      .then((token) => {
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
      })
      .catch(() => this.getNewToken(oAuth2Client));
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   */
  getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    return new Promise((resolve, reject) => {
      console.log('Authorize this app by visiting this url:', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return reject(new Error(`Error retrieving access token: ${err}`));
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(this.tokenFile, JSON.stringify(token), (e) => {
            if (e) return reject(e);
            console.log('Token stored to', token);
            return resolve(oAuth2Client);
          });
          return null;
        });
      });
    });
  }

  /**
   * Lists the labels in the user's account.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listLabels() {
    return this.authorize()
    .then((auth) => {
      const gmail = google.gmail({ version: 'v1', auth });
      gmail.users.labels.list({
        userId: 'me',
      }, (err, res) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
        }
        const { labels } = res.data;
        if (labels.length) {
          console.log('Labels:');
          labels.forEach((label) => {
            console.log(`- ${label.name}`);
          });
        } else {
          console.log('No labels found.');
        }
      });
    });
  }

  makeBody({
    from,
    to,
    subject,
    text,
    html,
  }) {
    const htmlPart = html ? [
      '--012boundary02\n',
      'Content-type: text/html; charset=UTF-8\n',
      // 'Content-Transfer-Encoding: quoted-printable\n\n',
      html,
      '\n',
    ] : [];
    const str = [
      'MIME-Version: 1.0\n',
      'Content-Transfer-Encoding: 7bit\n',
      `To: ${to}\n`,
      `From: ${from}\n`,
      `Subject: ${subject}\n`,
      'Content-Type: multipart/mixed; boundary=012boundary01\n\n',
      '--012boundary01\n',
      'Content-Type: multipart/alternative; boundary=012boundary02\n\n',
      '--012boundary02\n',
      'Content-type: text/plain; charset=UTF-8\n\n',
      text || '',
      '\n',
      ...htmlPart,
      '--012boundary02--\n',
      // '--012boundary01\n',
      // 'Content-type: text/html; charset=UTF-8\n',
      // 'Content-Disposition: attachment; filename="sample.html"\n',
      // 'Content-Transfer-Encoding: quoted-printable\n\n',
      // '<b>HTML sample attachment file</b>\n',
      // '--012boundary01\n',
      // 'Content-type: text/html; charset=UTF-8\n',
      // 'Content-Disposition: attachment; filename="sample1.html"\n',
      // 'Content-Transfer-Encoding: quoted-printable\n\n',
      // '<b>HTML sample attachment file</b>\n',
      '--012boundary01--\n',
    ].join('');

    const encodedMail = Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
  }

  sendMail(options) {
    return this.authorize()
    .then((auth) => {
      const gmail = google.gmail({ version: 'v1', auth });
      const raw = this.makeBody(options);
      gmail.users.messages.send({
        auth,
        userId: 'me',
        resource: {
          raw,
        },
      }, (err, response) => {
        if (err) {
          console.error('sendMail Error :', err);
        }
        // console.log('err, response :', err, response);
        // res.send(err || response);
      });
    });
  }

  sendTestMail() {
    return this.sendMail({
      from: 'XXX Team <rick.chen@d8ai.com>',
      subject: 'Subject',
      to: 'xtforgame@gmail.com',
      text: 'Hello plain text!',
      // html: '<b>Hello html</b>',
    });
  }
}
