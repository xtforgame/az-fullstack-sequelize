import { promiseReduce } from 'common/utils';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import { externalUrl } from 'config';
import { buildQueryT1, Options } from 'common/graphQL';

const PRODUCT_QUERY = `
  query Product($id: bigint! = 0) {
    product(id: $id){
      id
      customId
      group {
        id
        name
        description
        materials
        products(where: {disabled: { _eq: false }, deleted_at: {_is_null: true}}, order_by: {priority: desc}) {
          id
          name
          color
          colorName
          colorCode
          size
          priority
          sizeChart
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
      colorCode
      size
      thumbnail
      pictures
      name
      price
      weight
      description
      materials
      data
      priority
      sizeChart
    }
  }
`;

export const productToDetailLiquidScope = (product) => {
  const descriptionText = sanitizeHtml(product.description, {
    allowedTags: ['br'],
  }).replace(/<br \/>/g, '\n');
  const seoTitle = `${product.name} (${product.colorName}) (${product.size})`;
  const thumbnailImage = (product.thumbnail && product.thumbnail.image && product.thumbnail.image.imgUrl) || '';

  const sizeMap = {};
  const colorMap = {};

  product.group.products.forEach((p) => {
    const colorJson = JSON.parse(p.color);
    p.colorRgba = `rgba(${colorJson.r}, ${colorJson.g}, ${colorJson.b}, ${colorJson.a})`;
    if (!sizeMap[p.size]) {
      sizeMap[p.size] = {
        forOrder: p,
      };
    }
    if (sizeMap[p.size].forOrder.priority < p.priority) {
      sizeMap[p.size].forOrder = p;
    }
    if (p.colorCode === product.colorCode) {
      sizeMap[p.size].current = p;
    }

    if (!colorMap[p.colorCode]) {
      colorMap[p.colorCode] = {
        forOrder: p,
      };
    }
    if (colorMap[p.colorCode].forOrder.priority < p.priority) {
      colorMap[p.colorCode].forOrder = p;
    }
    if (p.size === product.size) {
      colorMap[p.colorCode].current = p;
    }
  });

  const sizeToView = (p, hasProduct = false) => p && ({
    title: p.size,
    url: `/products/${p.id}?ref=spec`,
    hasProduct,
    isCurrent: p.id === product.id,
  });

  const sizes = Object.values(sizeMap)
    .sort((a : any, b : any) => a.forOrder.priority - b.forOrder.priority)
    .map((p: any) => sizeToView(p.current) || sizeToView(p.forOrder, true));


  const colorToView = (p, hasProduct = false) => p && ({
    title: p.colorName,
    color: p.colorRgba,
    url: `/products/${p.id}?ref=spec`,
    hasProduct,
    isCurrent: p.id === product.id,
  });
  const colors = Object.values(colorMap)
    .sort((a : any, b : any) => a.forOrder.priority - b.forOrder.priority)
    .map((p: any) => colorToView(p.current) || colorToView(p.forOrder));

  return {
    title: `${seoTitle} | studiodoe`,
    meta: {
      description: descriptionText.replace(/<br \/>/g, ''),
      canonical: `${externalUrl}/products/${product.id}`,
      og: {
        site_name: 'studiodoe',
        title: seoTitle,
        description: descriptionText.replace(/<br \/>/g, '\n'),
        url: `${externalUrl}/products/${product.id}`,
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
      description: product.description || product.group.description,
      materials: product.materials || product.group.materials,
      sizes,
      colors,
    },
  };
};

export const getProduct = async (id) => {
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
    return productToDetailLiquidScope(data.data.product);
  }
  return null;
};

export const productsToListLiquidScope = (products) => {
  const sizeColorMap = {};
  return {
    // products: products,
    sections: products.map(p => `
      <section class="item"><a class="item-link" href="/products/${p.id}">
        <div class="item-inner lazy" data-src="${(p.thumbnail && p.thumbnail.image && p.thumbnail.image.imgUrl) || ''}"></div>
        <div class="item-title">
          <div class="name">${p.name}${p.isLimit ? '(現貨)' : ''}</div>
          <div class="price">NT$ ${p.price}</div>
        </div>
      </a></section>
    `),
  };
};

export const productGroupsToListLiquidScope = productGroups => ({
  // productGroups: productGroups.filter(p => p.products.length !== 0),
  sections: productGroups.filter(p => p.products.length !== 0).map(p => `
    <section class="item"><a class="item-link" href="/products/${p.products[0].id}">
      <div class="item-inner lazy" data-src="${(p.thumbnail && p.thumbnail.image && p.thumbnail.image.imgUrl) || ''}"></div>
      <div class="item-title">
        <div class="name">${p.name}${p.products[0].isLimit ? '(現貨)' : ''}</div>
        <div class="price">NT$ ${p.price}</div>
      </div>
    </a></section>
  `),
});

export const getProducts = async () => {
  const {
    buildQueryString,
  } = buildQueryT1(
    'products',
    'productAggregate',
    `
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
    `,
  );
  const { data } = await axios({
    url: hasuraEndpoint,
    method: 'post',
    headers: {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': 'xxxxhsr',
      'Content-Type': 'application/json',
    },
    data: {
      query: buildQueryString(),
    },
  });
  return data.data && data.data.products;
};
