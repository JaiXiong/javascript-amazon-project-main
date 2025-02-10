import {cart} from '../../data/cart.js'
import { formatCurrency } from '../utils/money.js';
import { products, getProduct } from '../../data/products.js';  
import { getDeliveryOption } from '../../data/deliveryOptions.js';

export function renderPaymentSummary() {

    let paymentSummaryHTML = '';
    let totalCost = 0;
    let itemsCount = 0;
    let shippingCost = 0;

    cart.forEach((cartItem) => {
        const matchingProduct = getProduct(cartItem.productId);
        itemsCount+= cartItem.quantity;
        totalCost += matchingProduct.priceCents * cartItem.quantity; 

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
        shippingCost += deliveryOption.priceCents;
    });
    console.log("total: "+totalCost);
    console.log("count: "+ itemsCount);
    console.log("shipping:"+ shippingCost);
    paymentSummaryHTML +=
    `
    <div class="payment-summary-title">
            Order Summary
          </div>
    <div class="payment-summary-row">
            <div>Items (${itemsCount}):</div>
            <div class="payment-summary-money">$${formatCurrency(totalCost)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingCost)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">${formatCurrency(calculateSubTotal(totalCost, shippingCost))}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(calculateTax(calculateSubTotal(totalCost, shippingCost)))}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(calculateFinalTotal())}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

    function calculateSubTotal(totalCost, shippingCost) {
        return totalCost + shippingCost;
    }

    function calculateFinalTotal(subtotal) {
        return (totalCost + shippingCost) + calculateTax(totalCost);
    }

    function calculateTax(totalCost) {
        return totalCost * .1;
    }
}