import { getPrintfulProducts } from "~/lib/printful";
import {
  getProducts,
  getProductCount,
  getProductPrintfulIds,
} from "~/models/product.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Tab } from "@headlessui/react";
import Product from "~/components/admin/Product";
import classNames from "~/lib/classNames";
import { useState } from "react";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid";
import Pagination from "~/components/Pagination";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") || 1;
  const printfulPage = url.searchParams.get("printfulpage") || 1;
  const query = url.searchParams.get("query") || undefined;

  const printful = await getPrintfulProducts(printfulPage);
  const products = await getProducts(query, currentPage, false);
  const productCount = await getProductCount(query, false);
  const printfulIds = await getProductPrintfulIds();

  return json({ printful, products, productCount, query, printfulIds });
};

export default function Products() {
  const { printful, products, productCount, query, printfulIds } =
    useLoaderData();

  // Get all the products that have been saved in the DB. Use this for:
  //  1. UI for Printful tab to visually see if a product has already been added
  const addedProducts = printfulIds
    .filter((x) => x.external_id)
    .map((x) => x.external_id);

  const [externalIds, setexternalIds] = useState(addedProducts);

  const tabs = [
    { name: "Products", data: products },
    { name: "Printful", data: printful?.result, type: "api" },
  ];

  //console.log(printful.paging);

  return (
    <>
      <div className="px-4 pb-6 sm:px-6 md:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {!query ? (
            "Products"
          ) : (
            <>
              Search for <span className="bg-yellow-200 px-2">{query}</span>
            </>
          )}
        </h1>
        {query && (
          <Link
            to="/admin/products"
            className="group inline-flex space-x-3 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowSmallLeftIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600"
              aria-hidden="true"
            />
            <span>All Products</span>
          </Link>
        )}
      </div>

      <Tab.Group>
        <Tab.List className="border-b border-gray-200 px-4 md:px-0">
          <div className="-mb-px flex space-x-8">
            {!query &&
              tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "border-indigo-500 text-indigo-600 focus-visible:outline-none"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                    )
                  }
                >
                  {tab.name}
                  <span className="ml-2 inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                    {!tab.type ? productCount : printful?.paging?.total}
                  </span>
                </Tab>
              ))}
          </div>
        </Tab.List>
        <Tab.Panels className="my-10">
          {tabs.map((panel, idx) => (
            <Tab.Panel key={idx}>
              {panel?.data?.length > 0 ? (
                <>
                  <div className=" grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-4">
                    {panel.data.map((product) => (
                      <Product
                        key={product.id}
                        product={product}
                        externalIds={externalIds}
                        type={panel.type}
                      />
                    ))}
                  </div>
                  {/* {panel.type != "api" && <Pagination count={productCount} />} */}
                  <Pagination
                    count={!panel.type ? productCount : printful?.paging?.total}
                    type={panel.type}
                  />
                </>
              ) : (
                <div className="mt-12 flex -rotate-6 justify-center">
                  <h1 className="inline-block rounded-lg border-2 border-red-600 bg-red-600 p-6 text-9xl font-extrabold uppercase text-white">
                    None
                  </h1>
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
