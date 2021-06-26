import { toMap, leftJustify } from 'common/utils';
import crypto from 'crypto';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment';
import { hasuraEndpoint } from 'common/config';
import { externalUrl } from 'config';
import { buildQueryT1, Options } from 'common/graphQL';
import { NormalizedOrderData } from 'common/domain-logic/orderData';
import {
  findUser,
  findAllUser,
  patchUser,
  createUser,

  findAllProduct,

  findOrderById,
  createOrder,

  patchStudyGroupInvitationByUid,
} from '~/domain-logic';

import LiquidRouterBase from './LiquidRouterBase';


const fetchToMap = url => axios({
  method: 'get',
  url,
})
.then(({ data }) => data.reduce((m, res) => ({ ...m, [res.id]: res }), {}));

export default class LiquidRouterWp extends LiquidRouterBase {
  async sendWpGraphQLRequest(query: string) {
    const { data } = await axios({
      url: 'http://rick.cloud:27010/graphql',
      method: 'post',
      headers: {
        // 'X-Hasura-Role': 'admin',
        // 'X-Hasura-Admin-Secret': 'xxxxhsr',
        // 'Content-Type': 'application/json',
      },
      data: {
        query,
      },
    });
    return data;
  }

  setupRoutes({ router }) {
    // http://rick.cloud:27010/wp-json/wp/v2/posts?page=1&per_page=100
    router.get('/posts', async (ctx, next) => {
      const { data } = await this.sendWpGraphQLRequest(`
        query MyQuery {
          posts(where: {categoryIn: []}) {
            nodes {
              postId
              title
              featuredImage {
                node {
                  sourceUrl
                  mediaItemUrl
                }
              }
              excerpt
              date
              content
              categories {
                nodes {
                  name
                  id
                  categoryId
                }
              }
            }
          }
        }
      `);

      const posts = (data && data.posts.nodes) || [];
      const cols = [[], [], []];
      posts.forEach((p, i) => {
        cols[i % cols.length].push(p);
      });

      try {
        // const order = await findOrderById(this.resourceManager, ctx.params.orderId, ['user']);
        return this.liquidFor({
          getFilename: ({ ctx }) => 'pages/blog/posts/index.html.liquid',
          getScopeData: async ({ ctx }) => ({
            posts,
            cols,
          }),
        })(ctx, next);
      } catch (error) {
        console.log('error :', error);
      }
    });

    router.get('/posts/:postId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      const { data } = await this.sendWpGraphQLRequest(`
        query MyQuery {
          posts(where: {id: ${ctx.params.postId}}) {
            nodes {
              postId
              title
              featuredImage {
                node {
                  sourceUrl
                  mediaItemUrl
                }
              }
              excerpt
              date
              content
              categories {
                nodes {
                  name
                  id
                  categoryId
                }
              }
            }
          }
        }
      `);

      const posts = (data && data.posts.nodes) || [];

      try {
        // const order = await findOrderById(this.resourceManager, ctx.params.orderId, ['user']);
        return this.liquidFor({
          getFilename: ({ ctx }) => 'pages/blog/posts/post.html.liquid',
          getScopeData: async ({ ctx }) => ({
            post: posts[0],
          }),
        })(ctx, next);
      } catch (error) {
        console.log('error :', error);
      }
    });
  }
}
