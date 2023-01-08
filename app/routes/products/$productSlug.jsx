import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProduct } from "~/models/product.server";
import {
  getPrintfulProductStatus,
  getPrintfulProductSizeChart,
} from "~/lib/printful";
import formatMoney from "~/lib/formatMoney";
import { useOptionalUser } from "~/lib/user";
import AddToCart from "~/components/AddToCart";
import { useState, useEffect } from "react";
import { Disclosure, RadioGroup, Tab } from "@headlessui/react";
import classNames from "~/lib/classNames";
import {
  PlusSmallIcon,
  MinusSmallIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import SizeChart from "~/components/SizeChart";
import RelatedProduct from "~/components/RelatedProducts";
import CloudMedia from "~/components/CloudMedia";

export function meta({ data }) {
  const meta = {
    title: `${data.product.name} | DropshipJS.com `,
    description: data.product.description,
  };
  return {
    title: meta.title,
    description: meta.description,
    image: data.product.featured_img,
    "og:url": "https://dropshipjs.com",
    "og:image": data.product.featured_img,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": data.product.featured_img,
  };
}

export const loader = async ({ request, params }) => {
  invariant(params.productSlug, "productSlug not found");

  // get product from db
  const product = await getProduct({ slug: params.productSlug });
  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  // get the product_id from the first variant to see if there is a size chart from Printful API
  const { size_tables } =
    (await getPrintfulProductSizeChart(
      product.variants[0].product.product_id
    )) || [];

  // get all the data for each variant of this product from printful api to make sure it is in stock at Printful.
  const printfulData = await getPrintfulProductStatus(product);

  // Map over the product variants, match the IDs, and combine the variant data from printful api
  const mapProducts = new Map(product.variants.map((o) => [o.variant_id, o]));
  const combinedData = printfulData.map((o) => ({
    ...o,
    ...(mapProducts.get(o.result.variant.id) ?? []),
  }));

  // Get the data from each nested variant
  const variants = combinedData.map((r) => r.result).map((v) => v.variant);

  // create an object of unique colors
  const colors = variants.filter(
    (value, index, self) =>
      index === self.findIndex((c) => c.color === value.color)
  );

  return json({ product, combinedData, colors, size_tables });
};

export default function ProductDetailsPage() {
  const user = useOptionalUser();
  const { product, combinedData, colors, size_tables } = useLoaderData();
  const id = combinedData[0].external_id;
  const size = combinedData[0].result.variant.size;
  const color = colors[0].color;
  const [selectedVariant, setSelectedVariant] = useState({ id, size });
  const [selectedColor, setSelectedColor] = useState(color);

  useEffect(() => {
    setSelectedVariant((state) => ({ ...state, id, size }));
  }, [id, size]);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  return (
    <main>
      <div className="mx-auto max-w-2xl lg:max-w-none">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6  w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {product.gallery.map((image, idx) => (
                  <Tab
                    key={image}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">
                          {product.name + "-" + idx}
                        </span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <CloudMedia
                            alt={product.name + "-" + idx}
                            className="h-full w-full object-cover object-center"
                            id={image}
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? "ring-green-500" : "ring-transparent",
                            "pointer-events-none absolute inset-0 rounded-md ring-2  ring-offset-2"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-w-1 aspect-h-1 h-full w-full ">
              {product.gallery.map((image, idx) => (
                <Tab.Panel key={image}>
                  <CloudMedia
                    alt={product.name + "-" + idx}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                    id={image}
                  />
                </Tab.Panel>
              ))}

              {product.gallery.length < 1 && (
                <CloudMedia
                  alt={product.name}
                  className="h-full w-full object-cover object-center sm:rounded-lg"
                  id={product.featured_img}
                />
              )}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <span className="font-medium text-gray-600">DropshipJS</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}

              {user?.role === "ADMIN" && (
                <Link
                  to={`/admin/products/update?slug=${product.slug}`}
                  target="_blank"
                >
                  <PencilIcon
                    className="ml-2 inline-flex h-6 w-6 items-center rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    aria-hidden="true"
                  />
                </Link>
              )}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">
                {formatMoney(product.price)}
              </p>
            </div>
            {/* Color picker - No sizes */}
            {colors.length > 1 && (
              <div className="mt-8">
                <h2 className="text-sm font-medium text-gray-900">
                  <span className="font-bold">Color:</span> {selectedColor}
                </h2>

                <RadioGroup
                  value={selectedColor}
                  onChange={setSelectedColor}
                  className="mt-2"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a color
                  </RadioGroup.Label>
                  <div className="flex items-center space-x-3">
                    {colors.map((c) => (
                      <RadioGroup.Option
                        key={c.name}
                        value={c.color}
                        className={({ active, checked }) =>
                          classNames(
                            c.selectedColor,
                            active && checked
                              ? "ring ring-indigo-500 ring-offset-1"
                              : "",
                            !active && checked
                              ? "ring  ring-indigo-500 ring-offset-1"
                              : "",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                          )
                        }
                      >
                        <RadioGroup.Label as="p" className="sr-only">
                          {c.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          style={{ backgroundColor: c.color_code }}
                          className={classNames(
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}
            {/* size picker */}
            {size && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">
                    <span className="font-bold">Size:</span>{" "}
                    {selectedVariant.size}
                  </h2>
                  <SizeChart size_tables={size_tables} />
                </div>

                {product.variants.length > 1 && (
                  <RadioGroup
                    value={selectedVariant}
                    onChange={setSelectedVariant}
                    className="mt-2"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {!selectedColor
                        ? combinedData.map((v) => (
                            <RadioGroup.Option
                              key={v.external_id}
                              value={{
                                id: v.external_id,
                                size: v.result.variant.size,
                              }}
                              className={({ active, checked }) =>
                                classNames(
                                  v.result.variant.in_stock
                                    ? "cursor-pointer focus:outline-none"
                                    : "cursor-not-allowed opacity-25",
                                  active || v.external_id === selectedVariant.id
                                    ? "ring-2 ring-indigo-500 ring-offset-2"
                                    : "",
                                  checked
                                    ? "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 "
                                    : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                                  "flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1"
                                )
                              }
                              disabled={!v.result.variant.in_stock}
                            >
                              <RadioGroup.Label as="p">
                                {v.result.variant.size}
                              </RadioGroup.Label>
                            </RadioGroup.Option>
                          ))
                        : combinedData.map(
                            (v) =>
                              v.result?.variant?.color?.includes(
                                selectedColor
                              ) && (
                                <RadioGroup.Option
                                  key={v.external_id}
                                  value={{
                                    id: v.external_id,
                                    size: v.result.variant.size,
                                  }}
                                  className={({ active, checked }) =>
                                    classNames(
                                      v.result.variant.in_stock
                                        ? "cursor-pointer focus:outline-none"
                                        : "cursor-not-allowed opacity-25",
                                      active ||
                                        v.external_id === selectedVariant.id
                                        ? "ring-2 ring-indigo-500 ring-offset-2"
                                        : "",
                                      checked
                                        ? "border-transparent bg-indigo-600 text-white hover:bg-indigo-700 "
                                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50",
                                      "flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1"
                                    )
                                  }
                                  disabled={!v.result.variant.in_stock}
                                >
                                  <RadioGroup.Label as="p">
                                    {v.result.variant.size}
                                  </RadioGroup.Label>
                                </RadioGroup.Option>
                              )
                          )}
                    </div>
                  </RadioGroup>
                )}
              </div>
            )}
            {/* Additional details panels */}
            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? "text-indigo-600" : "text-gray-900",
                              "text-sm font-medium"
                            )}
                          >
                            Description
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="block h-6 w-6 text-indigo-600 group-hover:text-indigo-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel
                        as="div"
                        className="prose prose-sm pb-6"
                      >
                        <div
                          className="space-y-6 text-base text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </section>
            <div className=" mt-10 ">
              <AddToCart
                productId={product.id}
                variant={selectedVariant}
                color={selectedColor}
                className="flex w-full flex-1 items-center justify-center rounded-md border border-transparent bg-green-700 py-3 px-8 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <RelatedProduct product={product} />
      </div>
    </main>
  );
}
