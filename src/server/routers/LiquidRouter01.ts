import {
  findUser,
  findAllUser,
  patchUser,
  createUser,

  findAllProduct,

  findOrderById,
  createOrder,
} from '~/domain-logic';
import LiquidRouterBase from './LiquidRouterBase';
import { buildQueryT1, Options } from 'common/graphQL';
import {
  productGroupsToListLiquidScope,
  productsToListLiquidScope,
} from '../services/router-manager/api/product';


export default class LiquidRouter01 extends LiquidRouterBase {
  setupRoutes({ router }) {
    const getProductListMiddlewares = (getProducts : ((ctx : any) => Promise<any[]>) | null = null) => [async (ctx, next) => {
      let products : any[] = [];
      if (getProducts) {
        products = await getProducts(ctx);
      } else {
        const {
          buildQueryString,
        } = buildQueryT1(
          'products',
          null,
          `
            id
            customId
            thumbnail
            pictures
            name
            price
            weight
            description
            data
          `,
          {
            where: [
              '{ disabled: { _eq: false } }',
              '{ group: { campaigns: { campaign: { type: { _eq: "seasonal" } } } } }',
            ],
            orderBy: '[{priority: desc}, {id: desc}]',
          }
        );
        const { data } = await this.sendGraphQLRequest(buildQueryString());
        products = data && data.products;
      }
      ctx.local = ctx.local || {};
      if (products) {
        ctx.local.products = productsToListLiquidScope(products);
      }
      return next();
    }, this.liquidFor({
      getFilename: ({ ctx }) => 'pages/index.html.liquid',
      getScopeData: async ({ ctx }) => ctx.local.products,
    })];

    router.get('/', ...getProductListMiddlewares());

    router.get('/products/newin', ...getProductListMiddlewares(async (ctx) => {
      const {
        buildQueryString,
      } = buildQueryT1(
        'campaigns',
        null,
        `
          id
          productGroups {
            productGroup {
              id
              customId
              thumbnail
              pictures
              name
              price
              weight
              description
              data
              products(where: {disabled: {_eq: false}, deleted_at: {_is_null: true}}, order_by: {priority: desc}, limit: 1) {
                id
                isLimit
              }
            }
          }
        `,
        {
          where: ['{type: {_eq: "seasonal"}}'],
          orderBy: '{start: desc_nulls_last}',
          limit: 1,
        }
      );
      const { data } = await this.sendGraphQLRequest(buildQueryString());
      return data && data.campaigns && data.campaigns[0] && data.campaigns[0].productGroups.map(pg => pg.productGroup);
    }));
    router.get('/products/actived', ...getProductListMiddlewares());
    router.get('/products/past_actived', ...getProductListMiddlewares(async (ctx) => []));
    router.get('/products/instock', ...getProductListMiddlewares(async (ctx) => {
      const {
        buildQueryString,
      } = buildQueryT1(
        'productGroups',
        null,
        `
          id
          customId
          thumbnail
          pictures
          name
          price
          weight
          description
          data
          products(where: {disabled: {_eq: false}, deleted_at: {_is_null: true}}, order_by: {priority: desc}, limit: 1) {
            id
            isLimit
          }
        `,
      );
      const { data } = await this.sendGraphQLRequest(buildQueryString());
      return data && data.productGroups && data.productGroups.filter(g => g.products.length > 0 && g.products[0].isLimit);
    }));

    const categoriesLf = this.liquidFor({
      getFilename: ({ ctx }) => 'pages/categories/index.html.liquid',
      getScopeData: async ({ ctx }) => ctx.local.products,
    });
    router.get('/categories/:categoryId', async (ctx, next) => {
      if (!parseInt(ctx.params.categoryId)) {
        return next();
      }
      const {
        buildQueryString,
      } = buildQueryT1(
        'productGroups',
        null,
        `
          id
          customId
          thumbnail
          pictures
          name
          price
          weight
          description
          data
          products(where: {disabled: {_eq: false}, deleted_at: {_is_null: true}}, order_by: {priority: desc}, limit: 1) {
            id
            isLimit
          }
        `,
        {
          where: [`{category_id: {_eq: "${ctx.params.categoryId}"}}`]
        },
      );
      const { data } = await this.sendGraphQLRequest(buildQueryString());
      ctx.local = ctx.local || {};
      if (data && data.productGroups) {
        ctx.local.products = productGroupsToListLiquidScope(data.productGroups);
      }
      return categoriesLf(ctx, next);
    });
  }
}
