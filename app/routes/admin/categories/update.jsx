import { getCategory, updateCategory } from "~/models/category.server";
import { useLoaderData, useActionData, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import FileModal from "~/components/admin/FileModal";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { useState } from "react";
import CloudMedia from "~/components/CloudMedia";
import CategoryProductList from "~/components/admin/CategoryProductList";
import { Switch } from "@headlessui/react";
import classNames from "~/lib/classNames";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  invariant(slug, "Slug not found");

  const category = await getCategory({ slug });
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ category });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { name, description } = values;

  if (typeof name !== "string" || name.length === 0) {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Category description required." } },
      { status: 400 }
    );
  }

  const category = await updateCategory(values);

  return redirect(`/admin/categories/`);
};

export default function CategoryId() {
  const { category } = useLoaderData();
  const actionData = useActionData();
  const [featuredImg, setFeaturedImg] = useState(category.image);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [featured, setFeatured] = useState(category.featured);

  function toggleFileModal(e) {
    setModalType(e.target.dataset.modal);
    setOpenFileModal(!openFileModal);
  }

  console.log(category);

  return (
    <>
      <h1 className="text-3xl font-extrabold text-gray-900">
        Update: {category.name}
      </h1>

      <div className="space-y-8 divide-y divide-gray-200">
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
          <div className="order-last col-span-6 lg:col-span-2 lg:col-start-5">
            {/* Product count/items for category item   */}
            <div className="relative flex w-full flex-col items-center justify-center bg-white  md:rounded md:shadow">
              <div className="border-grey-200 w-full border-b px-4  py-5 text-sm font-medium  text-gray-700 hover:text-gray-500">
                <Link to={`/admin/products/`}>Products </Link>
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

          <div className="col-span-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
            <Form
              method="post"
              action={"/admin/categories/update?slug=" + category.slug}
              className="space-y-8 divide-y divide-gray-200"
            >
              <div className="overflow-hidden bg-white md:rounded md:shadow">
                <FileModal
                  openFileModal={openFileModal}
                  toggleFileModal={toggleFileModal}
                  modalType={modalType}
                  featuredImg={featuredImg}
                  setFeaturedImg={setFeaturedImg}
                />
                <input
                  type="hidden"
                  name="image"
                  id="image"
                  defaultValue={featuredImg}
                />
                {featuredImg ? (
                  <CloudMedia
                    id={featuredImg}
                    data-modal="category"
                    className="h-48 w-full rounded-tl-md rounded-tr-md object-cover hover:opacity-75"
                    onClick={toggleFileModal}
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
                          <p className="pl-1">
                            <button
                              type="button"
                              onClick={toggleFileModal}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Add Category Image
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={category.name}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        aria-invalid={
                          actionData?.errors?.name ? true : undefined
                        }
                        aria-errormessage={
                          actionData?.errors?.name ? "name-error" : undefined
                        }
                      />
                    </div>

                    {actionData?.errors?.name && (
                      <div className="pt-1 text-red-700" id="name=error">
                        {actionData.errors.name}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Slug
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        defaultValue={category.slug}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={8}
                      defaultValue={category.description}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      aria-invalid={
                        actionData?.errors?.description ? true : undefined
                      }
                      aria-errormessage={
                        actionData?.errors?.description
                          ? "description-error"
                          : undefined
                      }
                    />

                    {actionData?.errors?.description && (
                      <div className="pt-1 text-red-700" id="description=error">
                        {actionData.errors.description}
                      </div>
                    )}
                  </div>

                  {/* settings section */}
                  <div className="mt-10 divide-y divide-gray-200 pt-6">
                    <div>
                      <h2 className="text-lg font-medium leading-6 text-gray-900">
                        Settings
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage how this category is displayed in your store.
                      </p>
                    </div>
                    <ul className="mt-2 divide-y divide-gray-200">
                      <li className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">
                            Featured
                          </p>
                          <p className="text-sm text-gray-500">
                            Use this category as one of the featured categories
                            on the homepage.
                          </p>
                        </div>
                        <Switch
                          name="featured"
                          checked={featured}
                          onChange={setFeatured}
                          className={classNames(
                            featured ? "bg-blue-600" : "bg-gray-200",
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                          )}
                        >
                          <span className="sr-only">Featured</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              featured ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </li>
                      <li className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">
                            Order
                          </p>
                          <p className="text-sm text-gray-500">
                            Set the order of this category.
                          </p>
                        </div>
                        <input
                          type="number"
                          name="order"
                          id="order"
                          defaultValue={category.order}
                          className="block w-16  rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        />
                      </li>
                    </ul>
                  </div>

                  <input type="hidden" name="id" defaultValue={category.id} />
                </div>
                <div className="mt-2 flex justify-end bg-gray-50 px-8 py-4">
                  <button
                    onClick={() => window.history.back()}
                    className="rounded border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 rounded bg-blue-600  py-2 px-4 text-white hover:bg-blue-700 focus:bg-blue-400"
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
