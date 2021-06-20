import { Order, BrowserSession, Campaign, Product, ShippingFee, calcOrderInfo, toShippingFeeTableMap, ShippingFeeTableMap, OrderInfo } from 'common/domain-logic/gql-helpers';
import $ from "jquery";

declare const cartContents : BrowserSession['products'] | undefined;
declare const cart : BrowserSession | undefined;

declare const shippingFeeTableMap : ShippingFeeTableMap | undefined;

export const init = () => {
  // console.log('window.cartContents :', cartContents);
  // console.log('window.shippingFeeTableMap :', shippingFeeTableMap);
  // console.log('window.cart :', cart);

  function updateTotalPrice(orderInfo : OrderInfo) {
    const $cartShipping = $('#cart-shipping');
    const $subtotal = $('#cart-subtotal');

    if ($cartShipping.length) {
      $cartShipping.text(orderInfo.shippingFee); 
    }
    if ($subtotal.length) {
      $subtotal.text(orderInfo.finalPrice); 
    }
  };

  $(document).on('click.quantity__changer', '.quantity__changer', event => {
    event.preventDefault();

    const $this = $(event.currentTarget);
    const $quantity = $this.siblings('.quantity__number');
    const $product = $quantity.parents('tr');
    const $rowSubtotal = $quantity.parents('.quantity').siblings('.subtotal.price').find('.row-price');
    const $subtotal = $('#cart-subtotal');
    const price = Number(
      $this
        .parents('.product')
        .find('.product__price')
        .text()
    );
    const currentQuantity = Number($quantity.val());
    const isDecreasing = $this.data('behavior') === 'decrease';

    if (isDecreasing && currentQuantity === 1) return;


    const productId = $product.attr('data-product-id');
    console.log('productId :', productId);
    const productMn = cart?.products.find(pMn => pMn.product.id == productId);
    console.log('cart?.products :', cart?.products);
    console.log('productMn :', productMn);

    if (isDecreasing) {
      productMn!.quantity! -= 1;
    } else {
      productMn!.quantity! += 1;
    }

    const $logistics = $('#order_recipient_logistics');
    const $country = $('#order_country');
    const info = calcOrderInfo({
      isInCart: true,
      // logistics: 'outlying',
      logistics: $logistics.val() as string || '',
      countryCode: $country.val() as string || '',
      ...cart!,
    }, shippingFeeTableMap!);
    console.log('info :', info);

    $quantity.val(productMn!.quantity!);
    $rowSubtotal.text(productMn!.quantity! * productMn!.price!);
    updateTotalPrice(info);
  });
  $(document).on(
    'change.order_recipient_logistics',
    '#order_recipient_logistics',
    function(event){
      const $logistics = $('#order_recipient_logistics');
      const $country = $('#order_country');
      const info = calcOrderInfo({
        isInCart: true,
        // logistics: 'outlying',
        logistics: $logistics.val() as string || '',
        countryCode: $country.val() as string || '',
        ...cart!,
      }, shippingFeeTableMap!);
      console.log('info :', info);
  
      updateTotalPrice(info);
    }
  );

  $(document).on(
    'change.order_country',
    '#order_country',
    function(event){
      const $logistics = $('#order_recipient_logistics');
      const $country = $('#order_country');
      const info = calcOrderInfo({
        isInCart: true,
        // logistics: 'outlying',
        logistics: $logistics.val() as string || '',
        countryCode: $country.val() as string || '',
        ...cart!,
      }, shippingFeeTableMap!);
      console.log('info :', info);
  
      updateTotalPrice(info);
    }
  ); 
};
