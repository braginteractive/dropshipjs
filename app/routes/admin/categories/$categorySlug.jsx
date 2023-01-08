import { Link, useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getCategory, deleteCategory } from "~/models/category.server";
import { requireUserId } from "~/session.server";
import CloudMedia from "~/components/CloudMedia";
import CategoryProductList from "~/components/admin/CategoryProductList";

export const loader = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.categorySlug, "categorySlug not found");

  const category = await getCategory({ userId, slug: params.categorySlug });
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ category });
};

export const action = async ({ params }) => {
  invariant(params.categorySlug, "categorySlug not found");
  await deleteCategory({ slug: params.categorySlug });

  return redirect("/admin/categories");
};

export default function CategoryDetailsPage() {
  const { category } = useLoaderData();
  //console.log(category);

  return (
    <main>
      <h1 className="px-4 text-3xl font-extrabold text-gray-900 md:px-0">
        Category: {category.name}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
        <div className="order-last col-span-6 lg:col-span-2 lg:col-start-5">
          <div className="relative flex w-full flex-col items-center justify-center bg-white  md:rounded md:shadow">
            <div className="border-grey-200 w-full border-b px-4  py-5 text-sm font-medium  text-gray-700 hover:text-gray-500">
              <Link to={`/admin/products/`}>Products </Link>{" "}
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                {category.products.length}
              </span>
            </div>

            {category.products.length > 0 ? (
              <div className="grid w-full grid-cols-2 content-center items-center gap-x-10 gap-y-4 px-4 py-6">
                {category.products.map((product) => (
                  <CategoryProductList key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="my-3 text-sm">No products for this category.</p>
            )}
          </div>
        </div>

        <div className="col-span-6 space-y-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
          <div className="overflow-hidden bg-white md:rounded md:shadow">
            <section aria-labelledby="production-information-title">
              {category.image ? (
                <CloudMedia
                  alt={category.name}
                  id={category.image}
                  className="h-48 w-full rounded-tl-md rounded-tr-md object-cover"
                />
              ) : (
                <div className="mt-1 p-8 sm:col-span-2 sm:mt-0">
                  <div className="flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 group-hover:bg-slate-300">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <p className="pl-1 text-sm font-medium leading-4">
                          No Category Image
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.name}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Slug</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.slug}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.description}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Order</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.order === null ? "Not Set" : category.order}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Featured
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {category.featured ? "True" : "False"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-2 flex justify-end bg-gray-50 px-8 py-4">
                <Link
                  to={`/admin/categories/update?slug=${category.slug}`}
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
                    className="ml-3 w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
