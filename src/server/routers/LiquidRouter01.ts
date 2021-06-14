import {
  findUser,
  findAllUser,
  patchUser,
  createUser,

  findAllProduct,

  findOrderById,
  createOrder,
} from '~/domain-logic';
import { Order, Campaign, Product, ShippingFee, calcOrderInfo, toShippingFeeTableMap } from 'common/domain-logic/gql-helpers';
import LiquidRouterBase from './LiquidRouterBase';
import { buildQueryT1, Options } from 'common/graphQL';
import {
  productsToListLiquidScope,
} from '../services/router-manager/api/product';


export default class LiquidRouter01 extends LiquidRouterBase {
  setupRoutes({ router }) {
    // const x = async () => {
    //   const {
    //     buildQueryString,
    //   } = buildQueryT1(
    //     'orders',
    //     null,
    //     `
    //       id
    //       logistics
    //       countryCode
    //       foreign
    //       metadata
    //       recipient
    //       campaigns {
    //         campaign {
    //           type
    //           data
    //         }
    //       }
    //       couponRecord {
    //         id
    //         price
    //       }
    //       products {
    //         quantity
    //         price
    //         fulfilled
    //         soldout
    //         product {
    //           weight
    //         }
    //       }
    //     `,
    //     {
    //       where: [
    //         '{state: {_eq: "shipped"}}',
    //         '{campaigns: {id: {_is_null: false}}}',
    //       ],
    //       orderBy: '[{created_at: desc}]',
    //       limit: 3000,
    //     },
    //   );
    //   const {
    //     buildQueryString: bqs,
    //   } = buildQueryT1(
    //     'shippingFees',
    //     null,
    //     `
    //       id
    //       price
    //       countryCode
    //       weight
    //     `,
    //   );
    //   const [{ data }, { data: d }] = await Promise.all([
    //     this.sendGraphQLRequest<{orders: Order[]}>(buildQueryString()),
    //     this.sendGraphQLRequest<{shippingFees: ShippingFee[]}>(bqs()),
    //   ]);
    //   const shippingFeeTableMap = toShippingFeeTableMap(d!.shippingFees);
    //   data!.orders.forEach((order) => {
    //     const { id, metadata } = order;
    //     const {
    //       finalPrice,
    //       couponDiscount,
    //       campaignDiscount,
    //       originalPrice, totalDiscount, shippingFee, shippingWeight,
    //     } = calcOrderInfo(order, shippingFeeTableMap);
    //     if (metadata.total !== finalPrice) {
    //       console.log('id :', id);
    //       console.log('finalPrice :', finalPrice);
    //       console.log('originalPrice :', originalPrice);
    //       console.log('totalDiscount :', totalDiscount);
    //       console.log('couponDiscount :', couponDiscount);
    //       console.log('campaignDiscount :', campaignDiscount);
    //       console.log('shippingWeight :', shippingWeight);
    //       console.log('shippingFee :', shippingFee);
    //       console.log('metadata.total :', metadata.total);
    //       console.log('metadata.total - originalPrice :', metadata.total - originalPrice);
    //       console.log('metadata.total - finalPrice :', metadata.total - finalPrice);
    //     }
    //   });
    // }
    // x();
    const getProductListMiddlewares = (getProducts : ((ctx : any) => Promise<any[]>) | null = null) => [async (ctx, next) => {
      let products : any[] | undefined = [];
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
            spec_id
            priority
            group_id
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
          },
        );
        const { data } = await this.sendGraphQLRequest<{products: Product[]}>(buildQueryString());
        products = data?.products;
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

    const getProductsFromCampaign = (campaign?: Campaign) => {
      console.log('campaign?.productGroups :', campaign?.productGroups);
      const products : Product[] = (campaign?.productGroups || []).reduce((p, pg) => p.concat(pg.productGroup.products), [] as Product[]);
      console.log('products :', products);
      products.sort((a, b) => b.priority! - a.priority!);
      return products;
    }

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
              products(where: {disabled: {_eq: false}, deleted_at: {_is_null: true}}, order_by: {priority: desc}) {
                id
                spec_id
                priority
                group_id
                customId
                thumbnail
                pictures
                name
                price
                weight
                description
                data
              }
            }
          }
        `,
        {
          where: ['{type: {_eq: "seasonal"}}'],
          orderBy: '{start: desc_nulls_last}',
          limit: 1,
        },
      );
      const { data } = await this.sendGraphQLRequest<{campaigns: Campaign[]}>(buildQueryString());
      console.log('data?.campaigns?.[0] :', data?.campaigns?.[0]);
      return getProductsFromCampaign(data?.campaigns?.[0]);
    }));
    router.get('/products/actived', ...getProductListMiddlewares());
    router.get('/products/past_actived', ...getProductListMiddlewares(async (ctx) => []));
    router.get('/products/instock', ...getProductListMiddlewares(async (ctx) => {
      const {
        buildQueryString,
      } = buildQueryT1(
        'products',
        null,
        `
          id
          spec_id
          priority
          group_id
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
          where: ['{isLimit: {_eq: true}}', '{disabled: {_eq: false}}'],
          orderBy: '[{created_at: desc}]',
        },
      );
      const { data } = await this.sendGraphQLRequest(buildQueryString());
      return data && data.products;
    }));
    router.get('/products/classic', ...getProductListMiddlewares(async (ctx) => {
      const {
        buildQueryString,
      } = buildQueryT1(
        'campaigns',
        null,
        `
          id
          productGroups(where: {deleted_at: {_is_null: true}}) {
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
                spec_id
                priority
                group_id
                customId
                thumbnail
                pictures
                name
                price
                weight
                description
                data
              }
            }
          }
        `,
        {
          where: ['{type: {_eq: "custom-made-classic"}}'],
          orderBy: '{start: desc_nulls_last}',
        }
      );
      const { data } = await this.sendGraphQLRequest<{campaigns: Campaign[]}>(buildQueryString());
      return getProductsFromCampaign(data?.campaigns?.[0]);
    }));

    router.get('/products/limited', ...getProductListMiddlewares(async (ctx) => {
      const {
        buildQueryString,
      } = buildQueryT1(
        'campaigns',
        null,
        `
          id
          productGroups(where: {deleted_at: {_is_null: true}}) {
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
                spec_id
                priority
                group_id
                customId
                thumbnail
                pictures
                name
                price
                weight
                description
                data
              }
            }
          }
        `,
        {
          where: ['{type: {_eq: "custom-made-limited"}}'],
          orderBy: '{start: desc_nulls_last}',
        }
      );
      const { data } = await this.sendGraphQLRequest<{campaigns: Campaign[]}>(buildQueryString());
      return getProductsFromCampaign(data?.campaigns?.[0]);
    }));

    const categoriesLf = this.liquidFor({
      getFilename: ({ ctx }) => 'pages/typs/index.html.liquid',
      getScopeData: async ({ ctx }) => ctx.local.products,
    });
    router.get('/typs/:categoryId', async (ctx, next) => {
      if (!parseInt(ctx.params.categoryId)) {
        return next();
      }
      const {
        buildQueryString,
      } = buildQueryT1(
        'products',
        null,
        `
          id
          spec_id
          priority
          group_id
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
          where: [`{disabled: {_eq: false}, deleted_at: {_is_null: true}, group: {category_id: {_eq: "${ctx.params.categoryId}"}}}`],
          orderBy: '[{priority: desc}, {id: desc}]',
        },
      );
      const { data } = await this.sendGraphQLRequest<{products: Product[]}>(buildQueryString());
      ctx.local.products = productsToListLiquidScope(data?.products);
      return categoriesLf(ctx, next);
    });
  }
}
