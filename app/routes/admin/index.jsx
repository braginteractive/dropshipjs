import { orderTotals } from "~/models/dashboard.server";
import { useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import StatCard from "~/components/admin/StatCard";
import formatMoney from "~/lib/formatMoney";
import OrdersTable from "~/components/admin/OrdersTable";
import Skeleton from "~/components/admin/Skeleton";

export const loader = async () => {
  const totals = await orderTotals();

  return json(totals);
};

export default function Admin() {
  const totals = useLoaderData();
  const ordersFetcher = useFetcher();

  useEffect(() => {
    if (ordersFetcher.type === "init") {
      ordersFetcher.load("/admin/orders?index");
    }
  }, [ordersFetcher]);

  return (
    <>
      <h1 className="px-4 text-3xl font-extrabold text-gray-900 md:px-0">
        Overview
      </h1>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Orders"
          value={totals._count.id}
          link={"/admin/orders"}
          icon={ShoppingCartIcon}
        />
        <StatCard
          title="Net"
          value={formatMoney(totals._sum.total - totals._sum.printfulTotal)}
          link={"/admin/orders"}
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Gross"
          value={formatMoney(totals._sum.total)}
          link={"/admin/orders"}
          icon={BanknotesIcon}
        />
        <StatCard
          title="Printful Cost"
          value={formatMoney(totals._sum.printfulTotal)}
          link={"/admin/orders"}
          icon={ChartPieIcon}
        />
      </dl>

      {ordersFetcher.type === "done" ? (
        <>
          <h2 className=" mt-8  px-4 text-lg font-medium leading-6 text-gray-900 md:px-0 ">
            Recent Orders
          </h2>
          <OrdersTable orders={ordersFetcher?.data?.combinedOrders} />
        </>
      ) : (
        <Skeleton />
      )}
    </>
  );
}
