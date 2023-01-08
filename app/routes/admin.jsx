import { Fragment, useState } from "react";
import { Outlet, NavLink, Link, Form, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Dialog, Transition } from "@headlessui/react";
import {
  CurrencyDollarIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  CircleStackIcon,
  PhotoIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import ImageFallback from "../lib/imageFallback";
import Logo from "../images/logo.png";
import LogoW from "../images/logo.webp";
import classNames from "../lib/classNames";
import { requireAdminRole } from "~/session.server";
import Breadcrumbs from "../components/admin/Breadcrumbs";
import SearchNavigation from "../components/admin/SearchNavigation";

const navigation = [
  { name: "Dashboard", to: "/admin", icon: HomeIcon },
  {
    name: "Products",
    to: "/admin/products",
    icon: TagIcon,
  },
  {
    name: "Categories",
    to: "/admin/categories",
    icon: CircleStackIcon,
  },
  { name: "Media", to: "/admin/media", icon: PhotoIcon },
  {
    name: "Orders",
    to: "/admin/orders",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Abandoned Carts",
    to: "/admin/carts",
    icon: DocumentMagnifyingGlassIcon,
  },
  { name: "Users", to: "/admin/users", icon: UserGroupIcon },
  { name: "Settings", to: "/admin/settings", icon: CogIcon },
];

export const loader = async ({ request }) => {
  const role = await requireAdminRole(request);
  return json(role);
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-14 p-1">
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center rounded-full focus:bg-gray-600 focus:outline-none"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Close sidebar</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <Link to="/admin">
                    <ImageFallback
                      src={LogoW}
                      fallback={Logo}
                      alt="DropshipJS"
                      width={300}
                      height={50}
                    />
                  </Link>
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="flex h-full flex-col">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            location.pathname === item.to
                              ? "border-indigo-500 bg-indigo-800 text-white hover:border-indigo-600"
                              : "border-transparent hover:border-indigo-500  hover:text-indigo-800 ",
                            "group flex items-center border-l-4 py-2 px-3 text-sm font-medium"
                          )}
                          aria-current={
                            location.pathname === item.to ? "page" : undefined
                          }
                        >
                          <item.icon
                            className={classNames(
                              location.pathname === item.to
                                ? " text-white"
                                : "group-hover:text-indigo-800 ",
                              "mr-3 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                    <div className="mt-auto space-y-1 pt-10">
                      <Form
                        action="/logout"
                        method="post"
                        className="group flex items-center border-l-4 border-transparent py-2 px-3 text-sm font-medium hover:border-indigo-600 hover:text-indigo-800"
                      >
                        <button
                          type="submit"
                          className="flex w-full items-center"
                        >
                          <CogIcon
                            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-indigo-800"
                            aria-hidden="true"
                          />
                          Logout
                        </button>
                      </Form>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <nav className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/admin">
                <ImageFallback
                  src={LogoW}
                  fallback={Logo}
                  alt="DropshipJS"
                  width={300}
                  height={50}
                />
              </Link>
            </div>
            <div className="mt-5 flex-grow">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      location.pathname === item.to
                        ? "border-indigo-500 bg-indigo-800 text-white hover:border-indigo-600"
                        : "border-transparent hover:border-indigo-500  hover:text-indigo-800 ",
                      "group flex items-center border-l-4 py-2 px-3 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        location.pathname === item.to
                          ? " text-white"
                          : "group-hover:text-indigo-800 ",
                        " mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="block w-full flex-shrink-0">
              <Form
                action="/logout"
                method="post"
                className="group flex items-center border-l-4 border-transparent py-2 px-3 text-sm font-medium hover:border-indigo-600 hover:text-indigo-800"
              >
                <button type="submit" className="flex w-full items-center">
                  <CogIcon
                    className="mr-4 h-6 w-6 text-gray-400 group-hover:text-indigo-800"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </Form>
            </div>
          </nav>
        </div>

        {/* Content area */}
        <div className="md:pl-64">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white px-8">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <SearchNavigation />
          </div>
          <Breadcrumbs />

          <div className="flex flex-col md:px-8">
            <main className="flex-1">
              <div className="relative">
                <div className="pt-10 pb-16">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
