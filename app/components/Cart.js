import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link, useFetcher } from "@remix-run/react";
import formatMoney from "~/lib/formatMoney";
import calculateTotal from "~/lib/calculateTotal";
import CloudMedia from "~/components/CloudMedia";

// Slide-out panel for cart items
// Send delete/remove action to /cart path
export default function Cart({ openCart, toggleCart, cart = [] }) {
  const cartFetcher = useFetcher();

  //console.log(cartFetcher)

  // useEffect(() => {
  //   if (cartFetcher.type === "init") {
  //     cartFetcher.load(`/cart`);
  //   }
  // }, [cartFetcher]);

  // console.log(cartFetcher.data, cartFetcher.state);

  return (
    <>
      <Transition.Root show={openCart} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-hidden"
          onClose={toggleCart}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          {cartFetcher.state === "loading" ? (
                            <span className="inline-flex items-center justify-center">
                              <svg
                                className="stroke-4 ml-2 mr-3 h-5 w-5 animate-spin fill-current text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={toggleCart}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
                            {cart?.map((p) => (
                              <li key={p.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <CloudMedia
                                    id={p.product.featured_img}
                                    alt={p.product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link
                                          to={`/products/${p.product.slug}`}
                                        >
                                          {p.product.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">
                                        {formatMoney(
                                          p.product.price * p.quantity
                                        )}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {p.color} {p.size && p.color && "- "}
                                      {p.size}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {p.quantity}
                                    </p>

                                    <div className="flex">
                                      <cartFetcher.Form
                                        method="post"
                                        action="/cart"
                                      >
                                        <input
                                          type="hidden"
                                          name="cartItem"
                                          defaultValue={p.id}
                                          className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                                        />
                                        <button
                                          type="submit"
                                          className="font-medium text-red-600 hover:text-red-500"
                                        >
                                          Remove
                                        </button>
                                        <input
                                          type="hidden"
                                          name="_action"
                                          value="delete_cart_item"
                                        />
                                      </cartFetcher.Form>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          {cart.length === 0 && (
                            <>
                              <div className="mt-5 rounded-lg bg-red-600 p-2 shadow-lg sm:p-3">
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
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatMoney(calculateTotal(cart))}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      {cart.length > 0 && (
                        <div className="mt-6">
                          <Link
                            to="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700"
                          >
                            Checkout
                          </Link>
                        </div>
                      )}
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          <button
                            type="button"
                            className="font-medium text-gray-600 hover:text-gray-500"
                            onClick={toggleCart}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
