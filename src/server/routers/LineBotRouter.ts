/* eslint-disable prefer-destructuring */

import {
  ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent, MessageEvent, TemplateMessage, TextMessage, MessageAPIResponseBase,
} from '@line/bot-sdk';
import { Context } from 'koa';
import RouterBase from '../core/router-base';

const clientConfig: ClientConfig = {
  channelSecret: '97164c73c2fc6a98b58f02b7e8be7dfb',
  channelAccessToken: 'PKMurV0axomY0/hARO+Spr631ScLoqQGEKE8Xa6B2cPSKbxJEb9GwPsb+6eMixEvaOvHntdlvHXTGSHweK2SaWVYzBqSXaBA/lEQ92q3J2Jy7tHcXCQYwnWyY6FoTqWnmcQj5+B4KdDF/97zKZoYRAdB04t89/1O/w1cDnyilFU=',
};

const client = new Client(clientConfig);

export default class LineBotRouter extends RouterBase {
  setupRoutes({ router }) {
    router.post('/callbacks/line/login', async (ctx: Context, next) => {
      ctx.status = 200;
      console.log('ctx.request.body :', ctx.request.body);
      return ctx.body = '';
    });


    router.get('/webhooks/line/messaging', async (ctx: Context, next) => {
      ctx.status = 200;
      return ctx.body = '';
    });

    const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
      // Process all variables here.
      if (event.type !== 'message' || event.message.type !== 'text') {
        return;
      }

      // Process all message related variables here.
      const { replyToken } = event;
      const { text } = event.message;

      if (text !== '預約' && text !== '選單') {
        return;
      }

      // Create a new message.
      const response: TextMessage = {
        type: 'text',
        text: 'https://liff.line.me/1656012301-RK2Nb5nd',
      };

      const tm : TemplateMessage = {
        type: 'template',
        altText: '開啟預約助理',
        template: {
          type: 'buttons',
          /**
           * Image URL (Max: 1000 characters)
           *
           * - HTTPS
           * - JPEG or PNG
           * - Max width: 1024px
           * - Max: 1 MB
           */
          thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/sticker/52002734/iPhone/sticker_key@2x.png',
          /**
           * Aspect ratio of the image. Specify one of the following values:
           *
           * - `rectangle`: 1.51:1
           * - `square`: 1:1
           *
           * The default value is `rectangle`
           */
          imageAspectRatio: 'rectangle', // | "square";
          /**
           * Size of the image. Specify one of the following values:
           *
           * - `cover`: The image fills the entire image area. Parts of the image that
           *   do not fit in the area are not displayed.
           * - `contain`: The entire image is displayed in the image area. A background
           *   is displayed in the unused areas to the left and right of vertical images
           *   and in the areas above and below horizontal images.
           *
           * The default value is `cover`.
           */
          imageSize: 'cover', // | "contain";
          /**
           * Background color of image. Specify a RGB color value.
           * The default value is `#FFFFFF` (white).
           */
          imageBackgroundColor: '#FFFFFF',// string;
          /**
           * Title (Max: 40 characters)
           */
          title: '設計師小助理',
          /**
           * Message text
           *
           * - Max: 160 characters (no image or title)
           * - Max: 60 characters (message with an image or title)
           */
          text: 'xxxx',
          /**
           * Action when tapped (Max: 4)
           */
          actions: [
            {
              type: 'uri',
              label: '前往預約',
              uri: 'https://liff.line.me/1656012301-RK2Nb5nd',
            },
          ],
        },
      };

      // Reply to the user.
      await client.replyMessage(replyToken, tm);
    };

    router.post('/webhooks/line', async (ctx: Context, next) => {
      ctx.status = 200;
      console.log('ctx.request.body :', ctx.request.body);

      const events: WebhookEvent[] = ctx.request.body!.events;
      events.forEach(async (event) => {
        await textEventHandler(event);
      });

      return ctx.body = '';
    });
  }
}
