import formatMoney from "~/lib/formatMoney";

export default function OrderSummary({ order }) {
  return (
    <>
      {order && (
        <section aria-labelledby="summary-heading" className="mt-10">
          <h2 id="summary-heading" className="sr-only">
            Order Summary
          </h2>

          <div className="rounded-lg bg-gray-100 py-6 px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-0 lg:py-8">
            <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-5 lg:pl-8">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-3 text-gray-500">
                  <span className="block">
                    {order?.addresses[0].first_name +
                      " " +
                      order?.addresses[0].last_name}
                  </span>
                  <span className="block">{order?.addresses[0].address1}</span>
                  {order?.addresses[0].address2 && (
                    <span className="block">
                      {order?.addresses[0].address2}
                    </span>
                  )}
                  <span className="block">
                    {order?.addresses[0].city}, {order?.addresses[0].state_code}{" "}
                    {order?.addresses[0].zip}
                  </span>
                </dd>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-7 lg:mt-0 lg:pr-8">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">
                  {formatMoney(order?.total - order?.shipping - order?.tax)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">
                  {formatMoney(order?.shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">
                  {formatMoney(order?.tax)}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-gray-900">Order total</dt>
                <dd className="font-medium text-green-600">
                  {formatMoney(order?.total)}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </>
  );
}
