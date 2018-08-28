/* eslint-disable no-console, no-underscore-dangle */
import AzMailer from 'az-mail-kit';
import appRootPath from 'app-root-path';
import {
  mailerConfig,
} from 'config';
import GmailSender from './GmailSender';
import ServiceBase from '../ServiceBase';

const appRoot = appRootPath.resolve('./');

const {
  senderName,
  serviceName = 'Az Service',
  domainName = 'az-authn.io',
  supportEmail = 'support@az-authn.io',
  credentialsFile = 'credentials.json',
  tokenFile = 'token.json',
} = mailerConfig;

export default class Mailer extends ServiceBase {
  static $name = 'mailer';

  static $type = 'service';

  static $inject = [];

  constructor() {
    super();
    this.azMailer = new AzMailer(`${appRoot}/ejs-mjml`);
    this.gmailSender = new GmailSender({
      credentialsFile,
      tokenFile,
    });
  }

  renderMail(templateName, ejsParams = {}, mjmlOprions = {}) {
    return this.azMailer.renderMail(`template/${templateName}.mjml`, ejsParams/* , { filePath: __dirname } */);
  }

  _sendEtherealMail(target, resetLink, resetCode) {
    let targets = target;
    if (Array.isArray(target)) {
      targets = target.join(', ');
    }
    return this.azMailer.createTransporter('test')
    .then((transporter) => {
      const result = this.renderMail('reset-password', {
        serviceName,
        resetPasswordUrl: resetLink,
        resetPasswordCode: resetCode,
        domainName,
        supportEmail,
      });

      if (result.error) {
        return Promise.reject(result.error);
      }

      // setup email data with unicode symbols
      const mailOptions = {
        from: senderName, // sender address
        to: targets, // list of receivers
        subject: 'Reset your password', // Subject line
        text: `Reset link: ${resetLink}`, // plain text body
        // HTML body
        html: result.mailHtml, // fs.readFileSync(path.join(__dirname, 'assets/template.html'), 'utf8'),
      };

      // send mail with defined transport object
      return transporter.sendMail(mailOptions);
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', this.azMailer.nodemailer.getTestMessageUrl(info));
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  }

  _sendGMail(target, resetLink, resetCode) {
    let targets = target;
    if (Array.isArray(target)) {
      targets = target.join(', ');
    }

    const result = this.renderMail('reset-password', {
      serviceName,
      resetPasswordUrl: resetLink,
      resetPasswordCode: resetCode,
      domainName,
      supportEmail,
    });

    if (result.error) {
      return Promise.reject(result.error);
    }

    // setup email data with unicode symbols
    const mailOptions = {
      from: senderName, // sender address
      to: targets, // list of receivers
      subject: 'Reset your password', // Subject line
      text: `Reset link: ${resetLink}`, // plain text body
      // HTML body
      html: result.mailHtml, // fs.readFileSync(path.join(__dirname, 'assets/template.html'), 'utf8'),
    };

    return this.gmailSender.sendMail(mailOptions);
  }

  sendResetPasswordMail(target, resetLink, resetCode) {
    if (mailerConfig.type === 'ethereal') {
      return this._sendEtherealMail(target, resetLink, resetCode);
    } else if (mailerConfig.type === 'gmail') {
      return this._sendGMail(target, resetLink, resetCode);
    }
    return Promise.reject(new Error('Unkown mail'));
  }

  onStart() {
    // return this.sendResetPasswordMail('xyz@foo.bar', 'https://localhost:8443/', '123456');
  }

  onDestroy() {
  }
}
