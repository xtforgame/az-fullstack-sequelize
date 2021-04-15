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
        <div class="item-inner lazy" data-src="${(p.thumbnail && p.thumbnail.image && p.thumbnail.image.imgUrl) || ''}"></div>
        <div class="item-title">
          <div class="name">${p.name}(現貨)</div>
          <div class="price">NT$ ${p.price}</div>
        </div>
      </a></section>
    `),
    };
  }

  getProductMap = async () => ({
    4677: {
      title: '後挖洞削肩BRA背心 (白) (F) | studiodoe',
      meta: {
        description: '可拆式胸墊 可單穿 也適合搭配各式透膚上衣 舒適不勒胸下圍 大胸穿著易跑位 建議C cup以下女孩穿著 *此款為貼身衣物,售出恕無退換服務*   ...',
        canonical: 'http://localhost:8080/products/4677',
        og: {
          site_name: 'studiodoe',
          title: '後挖洞削肩BRA背心 (白) (F)',
          description: `可拆式胸墊
可單穿
也適合搭配各式透膚上衣
舒適不勒胸下圍
大胸穿著易跑位
建議C cup以下女孩穿著
*此款為貼身衣物,售出恕無退換服務*
...`,
          url: 'http://localhost:8080/products/4677',
          image: 'https://d1pk1qje583qaz.cloudfront.net/uploads/product/primary_pic/000/004/677/normal_pad_4a5ce2c4-391b-4546-8e66-38eaba987bc8.jpg',
        },
      },
      body: {
        'viewed-content-event': '[4677,"tops","TWD",980]',
      },
      product: {
        title: '後挖洞削肩BRA背心',
        price: 980,
        pictures: [
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/384/large_430f8b50-3d63-4473-8554-0dd66448e1cd.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/385/large_1dfa9e43-255b-46c2-899f-3beef1e868ab.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/386/large_61e61e91-0213-44bf-ab90-2ee794f45880.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/387/large_2a0ff7dd-7e49-46ae-8473-db7c3c35322c.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/392/large_fe39a2a8-8c2b-49f2-b2f8-4836592081e0.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/393/large_f184d67d-2ea6-4746-a162-5718c80922cd.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/395/large_99f4544f-ac96-492a-9bde-bdef10eabcda.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/396/large_c6f21c01-5b48-466f-9b9a-7142f937fd48.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/397/large_aa9df94e-1cdf-42e7-abb3-1bd7baccc2fb.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/399/large_94024d01-1cb1-4d69-ba30-581e6622e175.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/403/large_af64bc8b-9384-40cf-8d25-d7825328596a.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/404/large_dd9ce0f0-5748-4c60-a7c6-21469d7666d1.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/406/large_cdf6ee87-80c7-4f27-afb8-b414e245ef5d.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/407/large_23db552b-7fde-4335-8560-7181be26a2fd.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/412/large_5d3d4c11-223c-4c84-9cd5-b915ff3bb59d.jpg',
          '//d1pk1qje583qaz.cloudfront.net/uploads/pic/file/000/063/414/large_fc4f0837-ec60-4b2d-96e9-49e19eab9100.jpg',
        ],
        description: '可拆式胸墊<br />可單穿<br />也適合搭配各式透膚上衣<br />舒適不勒胸下圍<br />大胸穿著易跑位<br />建議C cup以下女孩穿著<br /><span style="color:#e74c3c;">*此款為貼身衣物,售出恕無退換服務*</span>',
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
    },
  })
}
