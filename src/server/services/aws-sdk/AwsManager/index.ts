import AWS from 'aws-sdk';

// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/global-config-object.html
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html
// https://aws.amazon.com/releasenotes/SDK/JavaScript
// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property

// http://docs.aws.amazon.com/general/latest/gr/rande.html

// Amazon API Gateway
// Region Name Region  Endpoint  Protocol
// US East (N. Virginia) us-east-1 apigateway.us-east-1.amazonaws.com  HTTPS
// US East (Ohio)  us-east-2 apigateway.us-east-2.amazonaws.com  HTTPS
// US West (Oregon)  us-west-2 apigateway.us-west-2.amazonaws.com  HTTPS
// Asia Pacific (Seoul)  ap-northeast-2  apigateway.ap-northeast-2.amazonaws.com HTTPS
// Asia Pacific (Singapore)  ap-southeast-1  apigateway.ap-southeast-1.amazonaws.com HTTPS
// Asia Pacific (Sydney) ap-southeast-2  apigateway.ap-southeast-2.amazonaws.com HTTPS
// Asia Pacific (Tokyo)  ap-northeast-1  apigateway.ap-northeast-1.amazonaws.com HTTPS
// EU (Frankfurt)  eu-central-1  apigateway.eu-central-1.amazonaws.com HTTPS
// EU (Ireland)  eu-west-1 apigateway.eu-west-1.amazonaws.com  HTTPS


export type Config = {
  loadFromPath?: string;
}

export default class AwsSdkWrapper {
  config: Config;
  s3: AWS.S3;
  ses: AWS.SES;

  constructor(config : Config = {}) {
    this.config = config;
    if (this.config.loadFromPath) {
      AWS.config.loadFromPath(this.config.loadFromPath);
    }

    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    this.ses = new AWS.SES({ apiVersion: '2010-12-01', region: 'us-east-1' });
  }

  async sendTest() {
    return this.ses.sendEmail({
      Destination: {
      //  BccAddresses: [
      //  ], 
      //  CcAddresses: [
      //     "xtforgame@gmail.com"
      //  ], 
       ToAddresses: [
         "xtforgame@gmail.com"
       ]
      }, 
      Message: {
       Body: {
        Html: {
         Charset: "UTF-8", 
         Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
        }, 
        Text: {
         Charset: "UTF-8", 
         Data: "This is the message body in text format."
        }
       }, 
       Subject: {
        Charset: "UTF-8", 
        Data: "Test email"
       }
      }, 
      // ReplyToAddresses: [
      // ], 
      // ReturnPath: "", 
      // ReturnPathArn: "", 
      Source: "no-reply@vaxal.io", 
      // SourceArn: ""
     }).promise();
  }

  async sendMail(data: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    html: string;
  }) {
    if (!this.config.loadFromPath) {
      return;
    }
    return this.ses.sendEmail({
      Destination: {
      //  BccAddresses: [
      //  ], 
      //  CcAddresses: [
      //     "xtforgame@gmail.com"
      //  ], 
       ToAddresses: data.to,
      }, 
      Message: {
       Body: {
        Html: {
         Charset: "UTF-8", 
         Data: data.html
        }, 
        Text: {
         Charset: "UTF-8", 
         Data: data.text
        }
       }, 
       Subject: {
        Charset: "UTF-8", 
        Data: data.subject
       }
      }, 
      // ReplyToAddresses: [
      // ], 
      // ReturnPath: "", 
      // ReturnPathArn: "", 
      Source: data.from, 
      // SourceArn: ""
     }).promise();
  }
}
