import {
  useLoaderData,
  useActionData,
  useMatches,
  Link,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { getCart } from "~/cookies";
import { createPaymentIntent } from "~/models/checkout.server";
import CheckoutForm from "~/components/CheckoutForm";
import CheckoutSummary from "~/components/CheckoutSummary";
import calculateTotal from "~/lib/calculateTotal";
import StripePayment from "~/components/StripePayment";
import {
  createOrUpdateUser,
  createOrUpdateUserAddresses,
} from "~/models/user.server";
import {
  getPrintfulTax,
  getPrintfulCountries,
  getPrintfulShipping,
} from "~/lib/printful";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
};

const validateFirstName = (first_name) => {
  if (!first_name) {
    return "First name is required";
  } else if (typeof first_name !== "string" || first_name.length < 2) {
    return `Name must be at least 2 characters long`;
  }
};

const validateAddress = (address1) => {
  if (!address1) {
    return "Address is required";
  } else if (typeof address1 !== "string" || address1.length < 2) {
    return `Address required`;
  }
};

const validateCity = (city) => {
  if (!city) {
    return "City is required";
  }
};

const validateZip = (zip) => {
  if (!zip) {
    return "Zip code is required";
  }
};

export const loader = async ({ request }) => {
  // Get countries from Printful API for shipping/tax calculations
  const countries = await getPrintfulCountries();
  return json({
    countries,
    ENV: {
      FRONTEND_URL: process.env.FRONTEND_URL,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    },
  });
};

export const action = async ({ request }) => {
  // Get all cart items
  const cart = await getCart(request);

  // Get formData from any form that submits to /checkout (Currently: CheckoutForm.js)
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  //console.log(values);

  // submit action from CheckoutForm.js
  if (_action === "continue_to_payment") {
    //validate form fields
    const formErrors = {
      email: validateEmail(values.email),
      first_name: validateFirstName(values.first_name),
      address1: validateAddress(values.address1),
      city: validateCity(values.city),
      zip: validateZip(values.zip),
    };

    // if there are any error return them
    if (Object.values(formErrors).some(Boolean)) return { formErrors };

    // make object of just cart item Ids to use when creating/updating a user
    const ids = cart.map(({ id }) => ({ id }));

    // Create/Update user in db - add this user to the carts items
    // Until this point cart items have been handled by a deviceId cookie to allow guest carts
    const user = await createOrUpdateUser(values, ids);

    // create/update user addresses in db
    // Add shipping and billing address to user
    const address = await createOrUpdateUserAddresses(values, user);

    // Get published cart items
    const cartItems = cart.filter((cartItem) => cartItem.product.published);

    // make object of just quantity and external variant IDs to use with Printful API
    const items = cartItems.map(({ id, quantity, external_variant_id }) => ({
      id,
      quantity,
      external_variant_id,
    }));

    //send CheckoutForm.js form values and cart items to Printful API to get shipping total
    const shipping = await getPrintfulShipping(values, items);

    // send CheckoutForm.js form values to get printful API tax rate
    const tax = await getPrintfulTax(values);

    // Calculate subtotal of published cart items
    const cartSubTotal = calculateTotal(cartItems);

    // Get tax rate
    const taxRate = tax?.result.rate;

    // Get first tax rate
    // TODO: Multiple shipping rate
    const shippingRate = shipping?.result[0].rate;
    const shippingName = shipping?.result[0].name;

    //calculate the tax total
    const taxTotal = (cartSubTotal + parseFloat(shippingRate)) * taxRate;

    // Calculate total amount
    const total = (cartSubTotal + parseFloat(shippingRate)) * (taxRate + 1);

    // create Stripe PaymentIntent with cart total and stripe customer with user information submitted in CheckoutForm.js
    const secret = await createPaymentIntent(
      total,
      shippingRate,
      taxTotal,
      user
    );

    return json({
      taxTotal,
      shippingRate,
      shippingName,
      secret,
      values,
      cartSubTotal,
      total,
      cartItems,
      user,
    });
  }
};

export default function CheckoutLayout() {
  const { countries, ENV } = useLoaderData();
  const match = useMatches();
  const cart = match[0].data.cart;
  const data = useActionData();

  return (
    <>
      <Header />
      {cart.length === 0 ? (
        <>
          <main className="relative mx-auto grid max-w-7xl  px-8">
            <div className="my-16 rounded-lg bg-red-600 p-2 shadow-lg sm:p-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex w-0 flex-1 items-center">
                  <span className="flex rounded-lg bg-red-800 p-2">
                    <ShoppingCartIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="ml-3 truncate font-medium text-white">
                    <span>Your cart is empty.</span>
                  </p>
                </div>
                <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
                  <Link
                    to="/products"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          <div
            className="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block"
            aria-hidden="true"
          />
          <div
            className="fixed top-0 right-0 hidden h-full w-1/2 bg-gray-50 lg:block"
            aria-hidden="true"
          />

          <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
            <>
              <h1 className="sr-only">Order Information</h1>

              <CheckoutSummary
                cart={cart}
                taxTotal={data?.taxTotal}
                shippingRate={data?.shippingRate}
                shippingName={data?.shippingName}
                total={data?.total}
              />

              {!data || data?.formErrors ? (
                <>
                  <CheckoutForm countries={countries} validation={data} />
                </>
              ) : (
                <div className="pt-16">
                  <section
                    aria-labelledby="payment-heading"
                    className="bg-gray-50 px-4  sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
                  >
                    <h2
                      id="payment-heading"
                      className="mb-5 text-lg font-medium text-gray-900"
                    >
                      Submit Payment Details
                    </h2>

                    <StripePayment
                      env={ENV}
                      secret={data.secret}
                      customer={data.values}
                    />
                  </section>
                </div>
              )}
            </>
          </main>
        </>
      )}
      <Footer />
    </>
  );
}
