import {
  mailerConfig,
} from 'config';
import GmailSender from '../services/mailer/GmailSender';

const {
  credentialsFile = 'credentials.json',
  tokenFile = 'token.json',
} = mailerConfig;

const gmailSender = new GmailSender({
  credentialsFile,
  tokenFile,
});

gmailSender.authorize();
// gmailSender.listLabels();
// gmailSender.sendTestMail();
