import { getCarts, groupCarts } from "~/models/cart.server";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import groupByKey from "~/lib/groupByKey";
import { ShoppingCartIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import formatMoney from "~/lib/formatMoney";
import calculateTotal from "~/lib/calculateTotal";
import { format } from "date-fns";
import PaginationTable from "~/components/admin/PaginationTable";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") || 1;
  const carts = await getCarts(currentPage);
  const group = await groupCarts();
  return json({ group, carts });
};

export default function AbandonedCarts() {
  const { group, carts } = useLoaderData();
  const devices = groupByKey(carts, "deviceId");

  return (
    <>
      <div className="px-4 pb-6 sm:px-6 md:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900">Carts</h1>
      </div>

      {/* Activity list (small-medium breakpoint only) */}
      <div className="shadow lg:hidden">
        <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow lg:hidden">
          {Object.entries(devices).map(([key, subject], i) => (
            <li key={i}>
              <Link
                to="/admin/carts"
                className="block bg-white px-4 py-4 hover:bg-gray-50"
              >
                <span className="flex items-center space-x-4">
                  <span className="flex flex-1 space-x-2 truncate">
                    <ShoppingCartIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="flex flex-col truncate text-sm text-gray-500">
                      <span className="truncate"> {key}</span>
                      <span>
                        <span>
                          {subject.length}{" "}
                          {subject.length > 1 ? "Products" : "Product"}
                        </span>
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                          {formatMoney(calculateTotal(subject))}
                        </span>
                      </span>
                      <time dateTime={subject.addedAt}>
                        {format(new Date(subject[0].addedAt), "PPP")}
                      </time>
                    </span>
                  </span>
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <PaginationTable count={group.length} />
      </div>

      {/* Activity table (large breakpoint and up) */}
      <div className="hidden lg:block">
        <div className="mt-2 flex flex-col">
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 rounded border-t border-gray-100">
              <thead>
                <tr>
                  <th
                    className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    scope="col"
                  >
                    Device ID
                  </th>
                  <th
                    className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    scope="col"
                  >
                    Products
                  </th>
                  <th
                    className=" bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 md:block"
                    scope="col"
                  >
                    Amount
                  </th>
                  <th
                    className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    scope="col"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(devices).map(([key, subject], i) => (
                  <tr key={i} className="bg-white">
                    <td className=" whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <div className="flex">
                        <Link
                          to={`/admin/carts/${key}`}
                          className="group inline-flex space-x-2 truncate text-sm"
                        >
                          <ShoppingCartIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <p className="truncate text-gray-500 group-hover:text-gray-900">
                            {key}
                          </p>
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {subject.length}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                        {formatMoney(calculateTotal(subject))}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      <time dateTime={subject.addedAt}>
                        {format(new Date(subject[0].addedAt), "PPP")}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationTable count={group.length} />
          </div>
        </div>
      </div>
    </>
  );
}
