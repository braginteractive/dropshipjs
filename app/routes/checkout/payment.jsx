import { useLoaderData, Form, useSubmit, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState } from "react";
import { getCart } from "~/cookies";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export const loader = async ({ request }) => {
  const cart = await getCart(request);
  //const shipping = await getPrintfulShipping();
  //console.log(shipping)
  return json({ cart });
};

export default function Payment() {
  const { cart } = useLoaderData();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const submit = useSubmit();
  const shipping = useFetcher();

  async function handleSubmit(e) {
    // 1. Stop the form from submitting and turn the loader one
    e.preventDefault();
    setLoading(true);

    //console.log("We gotta do some work..");
    // 2. Start the page transition
    //nProgress.start();
    // 3. Create the payment method via stripe (Token comes back here if successful)
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: elements.getElement(CardElement),
    // });
    // console.log(paymentMethod);
    // 4. Handle any errors from stripe
    //  const { error } =  await stripe.confirmCardPayment( secret, {
    //     payment_method: {
    //     card: elements.getElement(CardElement),
    //     billing_details: {
    //       name: 'Jenny Rosen',
    //     },
    //   },
    // })
    //   if (error) {
    //   console.log(error)
    //   setError(error);
    //   //nProgress.done();
    //   return; // stops the checkout from happening
    // }
    // 5. Send the token from step 3 to our keystone server, via a custom mutation!
    //  const order = await checkout({
    //   variables: {
    //     token: paymentMethod.id,
    //   },
    // });
    //console.log(`Finished with the order!!`);
    //console.log(order);
    // 6. Change the page to view the order
    // router.push({
    //   pathname: `/order/[id]`,
    //   query: {
    //     id: order.data.checkout.id,
    //   },
    // });
    // 7. Close the cart
    //closeCart();

    // 8. turn the loader off
    setLoading(false);
    //nProgress.done();
  }

  function handleChange(e) {
    shipping.submit(e.currentTarget, { method: "post", action: "/shipping" });
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
      >
        <div className="mx-auto max-w-lg lg:max-w-none">
          <section
            aria-labelledby="payment-heading"
            className="bg-gray-50 px-4  sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
          >
            <h2
              id="payment-heading"
              className="text-lg font-medium text-gray-900"
            >
              Payment Methods
            </h2>

            <PaymentElement id="payment-element" className="mt-6" />
            <button disabled={loading || !stripe || !elements} id="submit">
              <span id="button-text">
                {loading ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Pay now"
                )}
              </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
          </section>

          <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
            >
              Submit Payment
            </button>
            <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
              Return to cart
            </p>
          </div>
        </div>
      </Form>
    </>
  );
}
