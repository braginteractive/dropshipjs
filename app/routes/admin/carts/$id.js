import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import formatMoney from "~/lib/formatMoney";
import { getCartDetails } from "~/models/cart.server";
import CloudMedia from "~/components/CloudMedia";
import calculateTotal from "~/lib/calculateTotal";
import { format } from "date-fns";

export const loader = async ({ request, params }) => {
  invariant(params.id, "Device ID not found");

  const userCart = await getCartDetails(params.id);
  if (!userCart) {
    throw new Response("Not Found", { status: 404 });
  }

  return userCart;
};

export default function AbandonedCartDetails() {
  const userCart = useLoaderData();

  return (
    <main>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900">
            Cart Details
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Date: {format(new Date(userCart[0].addedAt), "PPP")}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-sm capitalize text-red-900">
                {formatMoney(calculateTotal(userCart))}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Items</dt>
              <dd className="mt-1 text-sm text-gray-900">{userCart.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section aria-labelledby="order-heading" className="mt-10 ">
        <h2 id="order-heading" className="sr-only">
          Cart items
        </h2>

        <h3 className="sr-only">Items</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {userCart?.map((item) => (
            <div
              key={item.id}
              className="mb-5 flex space-x-6 border border-gray-200 bg-white py-10 shadow-sm sm:rounded-lg sm:border"
            >
              <CloudMedia
                alt={item.product.name}
                id={item.product.featured_img}
                className="mx-5 h-20 w-20 flex-none rounded-lg bg-gray-200 object-cover object-center xl:h-40 xl:w-40"
              />

              <div className="flex flex-auto flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                </div>
                <div className="mt-6 flex flex-col  ">
                  <dl className="flex flex-col flex-wrap gap-2 text-sm xl:flex-row xl:gap-6 ">
                    <div className="flex gap-2">
                      <dt className="font-medium text-gray-900">Quantity:</dt>
                      <dd className=" text-gray-700">{item.quantity}</dd>
                    </div>
                    {item.size && (
                      <div className="flex gap-2">
                        <dt className="font-medium text-gray-900 ">Size:</dt>
                        <dd className=" text-gray-700">{item.size}</dd>
                      </div>
                    )}
                    {item.color && (
                      <div className="flex gap-2">
                        <dt className="font-medium text-gray-900 ">Color:</dt>
                        <dd className=" text-gray-700">{item.color}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="font-medium text-gray-900 ">Price:</dt>
                      <dd className=" text-gray-700">
                        {formatMoney(item.product.price)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
