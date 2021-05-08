import { promiseReduce } from 'common/utils';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import { externalUrl } from 'config';
import { getProduct, getProducts } from './product';

export default class RouterApi {
  getProduct = getProduct;

  getProducts = getProducts;
}
