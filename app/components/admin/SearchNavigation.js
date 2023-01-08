import { UserIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, Fragment } from "react";
import { Form, useTransition, Link } from "@remix-run/react";
import { Menu, Transition } from "@headlessui/react";
import classNames from "~/lib/classNames";

const userNavigation = [
  { name: "Your Profile", to: "#" },
  { name: "Settings", to: "#" },
];

export default function SearchNavigation() {
  const transition = useTransition();
  const querySubmitted = transition.state === "submitting";
  const searchRef = useRef();

  useEffect(() => {
    if (!querySubmitted) {
      searchRef.current?.reset();
    }
  }, [querySubmitted]);

  return (
    <div className="flex flex-1 justify-between px-4 md:px-0">
      <div className="flex flex-1">
        <Form
          className="flex w-full md:ml-0"
          action="/admin/products"
          method="GET"
          ref={searchRef}
        >
          <label htmlFor="query" className="sr-only">
            Search Products
          </label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <MagnifyingGlassIcon
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            </div>
            <input
              name="query"
              id="query"
              className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 "
              placeholder="Search products"
              type="search"
            />
          </div>
        </Form>
      </div>
      <div className="ml-4 flex items-center md:ml-6">
        <Menu as="div" className="relative ml-3 flex-shrink-0">
          <div>
            <Menu.Button className="flex rounded-full bg-gray-50 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              <span className="sr-only">Open user menu</span>

              <UserIcon className="h-6 w-6" aria-hidden="true" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      to={item.to}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block py-2 px-4 text-sm text-gray-700"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
