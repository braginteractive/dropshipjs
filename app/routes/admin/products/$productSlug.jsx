import { Link, useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProduct, deleteProduct } from "~/models/product.server";
import { requireUserId } from "~/session.server";
import formatMoney from "~/lib/formatMoney";
import { format } from "date-fns";
import { variantSize } from "~/lib/variantSize";
import { EyeIcon } from "@heroicons/react/24/outline";
import FeaturedImage from "~/components/admin/FeaturedImage";
import Gallery from "~/components/admin/Gallery";

export const loader = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.productSlug, "productSlug not found");

  const product = await getProduct({ userId, slug: params.productSlug });
  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ product });
};

export const action = async ({ params }) => {
  invariant(params.productSlug, "productSlug not found");
  await deleteProduct({ slug: params.productSlug });

  return redirect("/admin/products");
};

export default function ProductDetailsPage() {
  const { product } = useLoaderData();
  //console.log(product);
  const categories = product.categories.map((cat) => cat.name).join(", ");

  return (
    <main>
      <div className="px-3 md:flex md:items-center md:justify-between md:space-x-5 md:px-0">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500">
                <span className="text-xl font-medium leading-none text-white">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product.name}
              <Link to={`/products/${product.slug}`} target="_blank">
                <EyeIcon
                  className="ml-2 inline-flex h-6 w-6 items-center rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-hidden="true"
                />
              </Link>
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Last updated on
              <time className="ml-1" dateTime={product.updatedAt}>
                {format(new Date(product.updatedAt), "PPP")}
              </time>
            </p>
          </div>
        </div>
        <div className="justify-stretch mt-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <Link
            to={`/admin/products/update?slug=${product.slug}`}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            Edit
          </Link>
          <Form
            method="post"
            className="inline-flex items-center justify-center"
          >
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
        <div className="col-span-6 lg:col-span-2 lg:col-start-5">
          <FeaturedImage
            product={product}
            featuredImg={product.featured_img}
            route="view"
          />

          <Gallery product={product} gallery={product.gallery} route="view" />
        </div>

        <div className="col-span-6 space-y-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
          <div className="overflow-hidden bg-white md:rounded md:shadow">
            <section aria-labelledby="production-information-title">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="production-information-title"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Product Information
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Created on
                  <time className="ml-1" dateTime={product.updatedAt}>
                    {format(new Date(product.createdAt), "PPP")}
                  </time>
                </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {product.published ? "Live" : "Draft"}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatMoney(product.price)}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      {product.categories.length > 1
                        ? "Categories"
                        : "Category"}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{categories}</dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd
                      className="prose mt-1 inline text-sm text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    ></dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>

          <section aria-labelledby="printful-details">
            <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
              <div className="divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="printful-details"
                    className="text-lg font-medium text-gray-900"
                  >
                    Printful Data
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    ID: {product.printful_id}
                  </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-10">
                    <div className="sm:col-span-5">
                      <dt className="text-sm font-medium text-gray-500">
                        Variants
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {product.variants.length}
                      </dd>
                    </div>
                  </dl>

                  <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-10">
                    <div className="sm:col-span-10">
                      <p className="mt-8 text-sm font-medium text-gray-500">
                        Sizes
                      </p>
                      {product.variants.map((p) => (
                        <span
                          key={p.variant_id}
                          className="mt-1 mr-3 text-sm text-gray-900"
                        >
                          {variantSize(p.name)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
