import { promiseReduce } from 'common/utils';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';

const PRODUCT_QUERY = `
  query Product($id: bigint! = 0) {
    product(id: $id){
      id
      customId
      group {
        id
        name
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
            id
            name
            type
            durationType
            state
            start
            end
            data
            created_at
            updated_at
            deleted_at
          }
        }
      }
      color
      colorName
      size
      thumbnail
      pictures
      name
      price
      weight
      description
      data
    }
  }
`;


const PRODUCT_LIST_QUERY = `
  query ProductList {
    products {
      id
      customId
      group {
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
            id
            name
            type
            durationType
            state
            start
            end
            data
            created_at
            updated_at
            deleted_at
          }
        }
      }
      color
      colorName
      size
      thumbnail
      pictures
      name
      price
      weight
      description
      data
    }
    productAggregate(where: {deleted_at: {_is_null: true}}) {
      aggregate {
        count
      }
    }
  }
`;
export default class RouterApi {
  getProduct = async (id) => {
    const { data } = await axios({
      url: hasuraEndpoint,
      method: 'post',
      headers: {
        'X-Hasura-Role': 'admin',
        'X-Hasura-Admin-Secret': 'xxxxhsr',
        'Content-Type': 'application/json',
      },
      data: {
        query: PRODUCT_QUERY,
        variables: { id },
      },
    });
    if (data.data && data.data.product) {
      return this.productToDetailLiquidScope(data.data.product);
    }
    return null;
  }

  productToDetailLiquidScope = (product) => {
    const descriptionText = sanitizeHtml(product.description, {
      allowedTags: ['br'],
    }).replace(/<br \/>/g, '\n');
    const seoTitle = `${product.name} (${product.colorName}) (${product.size})`;
    const thumbnailImage = (product.thumbnail && product.thumbnail.image && product.thumbnail.image.imgUrl) || '';
    return {
      title: `${seoTitle} | studiodoe`,
      meta: {
        description: descriptionText.replace(/<br \/>/g, ''),
        canonical: `http://localhost:8080/products/${product.id}`,
        og: {
          site_name: 'studiodoe',
          title: seoTitle,
          description: descriptionText.replace(/<br \/>/g, '\n'),
          url: `http://localhost:8080/products/${product.id}`,
          image: thumbnailImage,
        },
      },
      body: {
        'viewed-content-event': `[${product.id},"tops","TWD",980]`,
      },
      product: {
        id: product.id,
        title: product.name,
        price: product.price,
        pictures: product.pictures.map(p => p.image.imgUrl),
        description: product.description,
        sizes: [
          {
            title: 'F',
            url: '/products/4677?ref=spec',
            isCurrent: true,
          },
          {
            title: 'M',
            url: '/products/4677?ref=spec',
            isCurrent: false,
          },
        ],
        colors: [
          {
            title: '灰',
            color: 'rgb(195, 194, 194)',
            url: '/products/4676?ref=spec',
            isCurrent: false,
          },
          {
            title: '白',
            color: 'rgb(240, 239, 237)',
            url: '/products/4677?ref=spec',
            isCurrent: true,
          },
        ],
      },
    };
  }

  getProducts = async () => {
    const { data } = await axios({
      url: hasuraEndpoint,
      method: 'post',
      headers: {
        'X-Hasura-Role': 'admin',
        'X-Hasura-Admin-Secret': 'xxxxhsr',
        'Content-Type': 'application/json',
      },
      data: {
        query: PRODUCT_LIST_QUERY,
      },
    });
    if (data.data && data.data.products) {
      return this.productsToListLiquidScope(data.data.products);
    }
    return null;
  }

  productsToListLiquidScope = (products) => {
    const x = 1;
    return {
      sections: products.map(p => `
      <section class="item"><a class="item-link" href="/products/${p.id}">
        <div class="name">${p.name}(現貨)</div>
        <div class="price">NT$ ${p.price}</div>
      </a></section>
    `),
    };
  }
}
