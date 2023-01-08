import { Fragment, useState } from "react";
import { Link, Form, useMatches } from "@remix-run/react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ImageFallback from "~/lib/imageFallback";
import Cart from "~/components/Cart";
import { useOptionalUser } from "~/lib/user";
import Logo from "~/images/logo.png";
import LogoW from "~/images/logo.webp";

const navigation = {
  pages: [
    { name: "Tops", to: "/categories/tops" },
    { name: "Bottoms", to: "/categories/bottoms" },
    { name: "Hats", to: "/categories/hats" },
    { name: "Shoes", to: "/categories/shoes" },
    { name: "Accessories", to: "/categories/accessories" },
    { name: "Shop All", to: "/products" },
  ],
};

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const user = useOptionalUser();
  const match = useMatches();
  const cart = match[0].data.cart;
  const orderRoute = match[1].pathname === "/order" ? true : false;

  function toggleCart() {
    setOpenCart(!openCart);
  }

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={openMenu} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex lg:hidden"
          onClose={setOpenMenu}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex px-4 pt-5 pb-2">
                <button
                  type="button"
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setOpenMenu(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                {navigation.pages.map((page) => (
                  <div key={page.name} className="flow-root">
                    <Link
                      to={page.to}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      {page.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                {user ? (
                  <Form action="/logout" method="post">
                    <div className="flow-root">
                      <button
                        type="submit"
                        className=" font-medium text-gray-900 hover:text-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <div className="flow-root">
                      <Link
                        to="/login"
                        className=" font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </Link>
                    </div>
                    <div className="flow-root">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        to="/join"
                        className="font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <header className="relative overflow-hidden">
        {/* Top navigation */}
        <nav aria-label="Top" className="relative z-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpenMenu(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">DropshipJS</span>
                  <ImageFallback
                    src={LogoW}
                    fallback={Logo}
                    alt="DropshipJS"
                    width={200}
                    height={30}
                    className="h-8 w-full lg:-mt-4"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.to}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? (
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Logout
                      </button>
                    </Form>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        to="/join"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>
                {/* Cart */}
                {!orderRoute && (
                  <div className="ml-4 flow-root lg:ml-6">
                    <button
                      onClick={toggleCart}
                      className="group relative -m-2 flex items-center p-2"
                    >
                      <ShoppingCartIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />

                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-green-700 text-xs text-white">
                        {cart?.reduce(
                          (tally, cartItem) => tally + cartItem.quantity,
                          0
                        )}
                      </span>

                      <span className="sr-only">items in cart, view bag</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <Cart openCart={openCart} toggleCart={toggleCart} cart={cart} />
    </>
  );
}
