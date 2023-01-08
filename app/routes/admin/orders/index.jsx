import { getOrders, countOrders } from "~/models/order.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPrintfulOrders } from "~/lib/printful";
import OrdersTable from "~/components/admin/OrdersTable";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") || 1;
  const orders = await getOrders(currentPage);
  const orderCount = await countOrders();
  const printfulOrders = await getPrintfulOrders();

  // Map over the orders, match the IDs, and combine the printful order data from printful api
  // Filter by orders that have printfulID so you dont get all the old printful orders, or outside prtinful orders
  const map = new Map(orders?.map((o) => [o.printfulId, o]));
  const combinedOrders = printfulOrders?.result
    .map((o) => ({
      ...o,
      ...(map.get(o.id) ?? []),
    }))
    .filter((p) => p.printfulId);

  return json({ combinedOrders, orderCount });
};

export default function Orders() {
  const { combinedOrders, orderCount } = useLoaderData();

  //console.log(combinedOrders);
  return (
    <>
      <div className="px-4 pb-6 sm:px-6 md:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
      </div>

      <OrdersTable orders={combinedOrders} count={orderCount} />
    </>
  );
}
