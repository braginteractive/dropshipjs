import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Form } from "@remix-run/react";
import { XCircleIcon } from "@heroicons/react/20/solid";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

function StripePaymentForm({ frontend_url, customer }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const {
    email,
    first_name,
    last_name,
    address1: line1,
    address2: line2,
    city,
    country,
    zip: postal_code,
    state_name: state,
    b_first_name,
    b_last_name,
    b_address1,
    b_address2,
    b_city,
    b_country,
    b_zip,
    b_state_name,
  } = customer;
  const name = first_name + " " + last_name;
  const billing_name = b_first_name + " " + b_last_name;

  async function handleSubmit(e) {
    // Stop the form from submitting and turn the loader one
    e.preventDefault();
    setLoading(true);
    // submit payment details and customer information to stripe
    // NEED?: customer phone number
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${frontend_url}/order`,
        payment_method_data: {
          billing_details: {
            address: {
              city: b_city || city,
              country: b_country,
              line1: b_address1 || line1,
              line2: b_address2 || line2,
              postal_code: b_zip || postal_code,
              state: b_state_name || state,
            },
            email,
            name: billing_name || name,
          },
        },
        shipping: {
          name,
          address: {
            city,
            country,
            line1,
            line2,
            postal_code,
            state,
          },
        },
      },
    });
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setError(error.message);
    } else {
      setError("An unexpected error occured.");
    }
    setLoading(false);
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        className="px-4  pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
      >
        {/* Show any error or success messages */}
        {error && (
          <div
            id="payment-message"
            className="mt-3 border-l-4 border-red-400 bg-red-50 p-4"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <PaymentElement id="payment-element" className="mt-6" />

        <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-end">
          <button
            disabled={loading || !stripe || !elements}
            type="submit"
            className="w-full rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center">
                <svg
                  className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                  ></circle>
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>{" "}
                Processing Payment
              </span>
            ) : (
              "Pay now"
            )}
          </button>
        </div>
      </Form>
    </>
  );
}

export default function StripePayment({ env, secret, customer }) {
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret: secret,
    appearance,
  };

  const stripePromise = loadStripe(env.STRIPE_PUBLIC_KEY);

  return (
    <Elements options={options} stripe={stripePromise}>
      <StripePaymentForm frontend_url={env.FRONTEND_URL} customer={customer} />
    </Elements>
  );
}
