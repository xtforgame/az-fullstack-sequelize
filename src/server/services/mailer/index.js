/* eslint-disable no-console */
import AzMailer from 'az-mail-kit';
import appRootPath from 'app-root-path';
import ServiceBase from '../ServiceBase';

const appRoot = appRootPath.resolve('./');

export default class Mailer extends ServiceBase {
  static $name = 'mailer';

  static $type = 'service';

  static $inject = [];

  constructor() {
    super();
    this.azMailer = new AzMailer(`${appRoot}/ejs-mjml`);
  }

  renderMail(templateName, ejsParams = {}, mjmlOprions = {}) {
    return this.azMailer.renderMail(`template/${templateName}.mjml`, ejsParams/* , { filePath: __dirname } */);
  }

  sendResetPasswordMail(target, resetLink, resetCode) {
    let targets = target;
    if (Array.isArray(target)) {
      targets = target.join(', ');
    }
    return this.azMailer.createTransporter('test')
    .then((transporter) => {
      const result = this.renderMail('reset-password', {
        serviceName: 'Az Service',
        resetPasswordUrl: resetLink,
        resetPasswordCode: resetCode,
        domainName: 'az-authn.io',
        supportEmail: 'support@az-authn.io',
      });

      if (result.error) {
        return Promise.reject(result.error);
      }

      // setup email data with unicode symbols
      const mailOptions = {
        from: '"Az Service" <no-reply@az-authn.io', // sender address
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

  onStart() {
    // return this.sendResetPasswordMail('xyz@foo.bar', 'https://localhost:8443/', '123456');
  }

  onDestroy() {
  }
}
