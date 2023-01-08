import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

/* 
    PayPal Button reference: https://developer.paypal.com/sdk/js/reference/ 
    PayPal React package: https://www.npmjs.com/package/@paypal/react-paypal-js
    Purchase unit breakdowns: https://developer.paypal.com/docs/api/orders/v2/#definition-amount_breakdown
    Handle errors: https://developer.paypal.com/docs/checkout/standard/customize/handle-errors/
*/

export default function PayPalPayment({
  env,
  cartItems,
  total,
  cartSubTotal,
  shippingRate,
  taxTotal,
  customer,
}) {
  // make an array of just the data that PayPal needs
  const items = cartItems.map(({ product, quantity }) => ({
    name: product.name,
    unit_amount: { currency_code: "USD", value: product.price },
    quantity,
  }));

  async function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          custom_id: customer.id,
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: cartSubTotal.toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: parseFloat(shippingRate),
              },
              tax_total: {
                currency_code: "USD",
                value: taxTotal.toFixed(2),
              },
            },
          },
          items,
        },
      ],
    });
  }

  async function onApprove(data, actions) {
    return actions.order.capture().then((details) => {
      console.log(details);
      const name = details.payer.name.given_name;
      actions.redirect(`${env.FRONTEND_URL}/order?paypal=${details.id}`);
      //alert(`Transaction completed by ${name}`);
    });
  }

  const options = {
    "client-id": env.PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    //"data-client-token": "abc123xyz==",
  };

  const button = {
    layout: "horizontal",
    tagline: false,
  };

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        className="my-5"
        style={button}
        createOrder={createOrder}
        onApprove={onApprove}
        //onCancel={ }
        //onError={ }
      />
    </PayPalScriptProvider>
  );
}
