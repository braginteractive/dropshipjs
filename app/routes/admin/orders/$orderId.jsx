import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPrintfulOrderDetails } from "~/lib/printful";
import { requireUserId } from "~/session.server";
import { fromUnixTime, format } from "date-fns";
import { getOrder } from "~/models/order.server";
import OrderItems from "~/components/OrderItems";
import OrderSummary from "~/components/OrderSummary";

export const loader = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.orderId, "Order ID not found");

  const order = await getOrder(params.orderId);
  if (!order) {
    throw new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const printfulId = url.searchParams.get("printfulId");

  const { result } = await getPrintfulOrderDetails(printfulId);

  return json({ result, order });
};

export default function OrderDetailsPage() {
  const { result, order } = useLoaderData();
  const date = fromUnixTime(result.created).toISOString();
  console.log(result);

  return (
    <main>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">
            Order Details
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Printful Order ID:{" "}
            <a
              href={`${result.dashboard_url}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600"
            >
              {result.id}
            </a>
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {result.recipient.name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {format(new Date(date), "PPP")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {result.status}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Shipping</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {result.shipping} <br></br>
                {result.shipping_service_name}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <OrderItems order={order} />

      <OrderSummary order={order} />
    </main>
  );
}
