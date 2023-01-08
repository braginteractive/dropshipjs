import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { retrievePaymentIntent, getOrderByUserId } from "~/models/order.server";
import OrderItems from "~/components/OrderItems";
import OrderSummary from "~/components/OrderSummary";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const stripePaymentIntent = url.searchParams.get("payment_intent");

  if (stripePaymentIntent) {
    const payment = await retrievePaymentIntent(stripePaymentIntent);
    if (!payment) {
      throw new Response("Not Found", { status: 404 });
    }
    const { status } = payment;

    // Get the newly created order from the DB
    const order = await getOrderByUserId(payment.metadata.id);

    return json({ order, status });
  }

  return json({});
};

export default function Order() {
  const { order, status } = useLoaderData();
  const [message, setMessage] = useState();

  //console.log(order);

  useEffect(() => {
    switch (status) {
      // Stripe
      case "succeeded":
        setMessage("Success! Payment received.");
        break;

      case "processing":
        setMessage(
          "Payment processing. We'll update you when payment is received."
        );
        break;

      case "requires_payment_method":
        // Redirect your user back to your payment page to attempt collecting
        // payment again
        setMessage("Payment failed. Please try another payment method.");
        break;

      default:
        setMessage("Something went wrong.");
        break;
    }
  }, [status]);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl py-24 px-4 sm:py-16 sm:px-6 lg:px-8">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-green-600">
          Thank you!
        </h1>
        <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {message}
        </p>
        {order && (
          <p className="mt-6 text-base text-gray-500">Order #: {order?.id}</p>
        )}

        <p className="mt-2 text-base text-gray-500">
          Your order details will be sent to your email.
        </p>

        <div className="py-6">
          <h4 className="sr-only">Status</h4>

          <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600"
                style={{ width: "37.5%" }}
              ></div>
            </div>
            <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
              <div className="text-green-600">Order placed</div>
              <div className="text-center text-green-600">Processing</div>
              <div className="text-center ">Shipped</div>
              <div className="text-right ">Delivered</div>
            </div>
          </div>
        </div>

        <OrderItems order={order} />

        <OrderSummary order={order} />
      </div>
      <Footer />
    </>
  );
}
