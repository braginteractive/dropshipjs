import { ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Popover, Transition } from "@headlessui/react";
import formatMoney from "~/lib/formatMoney";
import calculateTotal from "~/lib/calculateTotal";
import { Fragment } from "react";
import CloudMedia from "~/components/CloudMedia";

export default function CheckoutSummary({
  cart,
  total,
  taxTotal,
  shippingName,
  shippingRate,
}) {
  // Only items in the cart that are "published" products.
  const publishedItems = cart.filter((cartItem) => cartItem.product.published);

  // Calculate subtotal of published cart items
  const cartSubTotal = calculateTotal(publishedItems);

  // calculate tax and shipping
  // const taxRate = actionData?.tax?.result.rate;
  // const shippingRate = actionData?.shipping?.result[0].rate;
  // const taxAmount = (cartSubTotal + parseFloat(shippingRate)) * taxRate;
  // const total = (cartSubTotal + parseFloat(shippingRate)) * (taxRate + 1);

  //const shippingName = actionData?.shipping?.result[0].name;

  //console.log(total > 0);

  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-gray-50 px-4 pt-16 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
    >
      <div className="mx-auto max-w-lg lg:max-w-none">
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
          Order Summary
        </h2>

        <ul className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
          {publishedItems.map((p) => (
            <li key={p.id} className="flex items-start space-x-4 py-6">
              <CloudMedia
                alt={p.product.name}
                id={p.product.featured_img}
                className="h-20 w-20 flex-none rounded-md object-cover object-center"
              />
              <div className="flex-auto space-y-1">
                <h3>
                  {p.product.name}{" "}
                  {p.quantity > 1 && (
                    <span>
                      {" "}
                      <XMarkIcon
                        className="inline-block h-3 w-3 text-gray-500"
                        aria-hidden="true"
                      />{" "}
                      {p.quantity}{" "}
                    </span>
                  )}
                </h3>
                <p className="text-gray-500">
                  {p.color} {p.size && "- " + p.size}
                </p>
              </div>
              <p className="flex-none text-base font-medium">
                {formatMoney(p.product.price * p.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd>{formatMoney(cartSubTotal)}</dd>
          </div>

          {shippingRate && (
            <>
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">
                  Shipping{" "}
                  <span className="font-normal text-gray-500">
                    - {shippingName}
                  </span>{" "}
                </dt>
                <dd>{formatMoney(shippingRate)}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>{formatMoney(taxTotal)}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">{formatMoney(total)}</dd>
              </div>
            </>
          )}
        </dl>

        <Popover className="fixed inset-x-0 bottom-0 z-40 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
          <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <Popover.Button className="flex w-full items-center py-6 font-medium">
                <span className="mr-auto text-base">Total</span>
                <span className="mr-2 text-base">
                  {total > 0
                    ? formatMoney(total)
                    : formatMoney(calculateTotal(cart))}
                </span>
                <ChevronUpIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </Popover.Button>
            </div>
          </div>

          <Transition.Root as={Fragment}>
            <div>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                  <dl className="mx-auto max-w-lg space-y-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd>{formatMoney(calculateTotal(cart))}</dd>
                    </div>
                    {shippingRate > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Shipping</dt>
                          <dd>{formatMoney(shippingRate)}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Taxes</dt>
                          <dd>{formatMoney(taxTotal)}</dd>
                        </div>
                      </>
                    )}
                  </dl>
                </Popover.Panel>
              </Transition.Child>
            </div>
          </Transition.Root>
        </Popover>
      </div>
    </section>
  );
}
