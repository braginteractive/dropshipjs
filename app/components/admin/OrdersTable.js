import formatMoney from "~/lib/formatMoney";
import { format } from "date-fns";
import { Link } from "@remix-run/react";
import { ShoppingCartIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PaginationTable from "./PaginationTable";

export default function OrdersTable({ orders, count }) {
  return (
    <>
      {orders && (
        <>
          {/* Activity list (small-medium breakpoint only) */}
          <div className="shadow lg:hidden">
            <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow lg:hidden">
              {orders?.map((order, key) => (
                <li key={key}>
                  <Link
                    to={`/admin/orders/${order.id}?printfulId=${order.printfulId}`}
                    className="block bg-white px-4 py-4 hover:bg-gray-50"
                  >
                    <span className="flex items-center space-x-4">
                      <span className="flex flex-1 space-x-2 truncate">
                        <ShoppingCartIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="flex flex-col space-y-2 truncate text-sm text-gray-500">
                          <span className="truncate font-semibold">
                            {order.user?.first_name +
                              " " +
                              order.user?.last_name}{" "}
                            -{" "}
                            <span className=" capitalize">{order.status}</span>
                          </span>

                          <time dateTime={order?.createdAt}>
                            {format(new Date(order?.createdAt), "PPP")}
                          </time>

                          <span>
                            {orders.length}{" "}
                            {orders.length > 1 ? "Products" : "Product"}
                          </span>
                          <span>
                            Customer Charged:
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                              {formatMoney(order.total)}
                            </span>
                          </span>
                          <span>
                            Net:{" "}
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                              {formatMoney(order.total - order.printfulTotal)}
                            </span>
                          </span>
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
            <PaginationTable count={count} />
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
                        Customer
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Date
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Status
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Email
                      </th>
                      <th
                        className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Products
                      </th>
                      <th
                        className=" bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Printful Cost
                      </th>
                      <th
                        className=" bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                        scope="col"
                      >
                        Customer Charged
                      </th>
                      <th
                        className=" bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 md:block"
                        scope="col"
                      >
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.map((order, key) => (
                      <tr key={key} className="bg-white">
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex">
                            <Link
                              to={`/admin/orders/${order.id}?printfulId=${order.printfulId}`}
                              className="group inline-flex space-x-2 truncate text-sm"
                            >
                              <ShoppingCartIcon
                                className="text-medium h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-900"
                                aria-hidden="true"
                              />
                              <p className="truncate text-gray-500 group-hover:text-gray-900">
                                {order.user.first_name +
                                  " " +
                                  order.user.last_name}
                              </p>
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                          <time dateTime={order.createdAt}>
                            {format(new Date(order.createdAt), "PPP")}
                          </time>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-left text-sm capitalize text-gray-500">
                          {order.status}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                          {order.user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          {order.items.length}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                            {formatMoney(order.printfulTotal)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                            {formatMoney(order.total)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-800">
                            {formatMoney(order.total - order.printfulTotal)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationTable count={count} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
