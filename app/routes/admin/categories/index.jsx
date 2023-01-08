import { getCategories, createCategory } from "~/models/category.server";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import FileModal from "~/components/admin/FileModal";
import { requireUserId } from "~/session.server";
import slugify from "~/lib/slugify";
import { useState } from "react";
import CloudMedia from "~/components/CloudMedia";
import CategoryList from "~/components/admin/CategoryList";

export const loader = async ({ request }) => {
  const cats = await getCategories();
  return cats;
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { name, slug, description, image } = values;

  // const name = formData.get("name");
  // const slug = formData.get("slug");
  // const description = formData.get("description");
  // const image = formData.get("image");

  if (typeof name !== "string" || name.length === 0) {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { description: "Body is required" } },
      { status: 400 }
    );
  }

  const category = await createCategory({
    name,
    slug,
    description,
    image,
  });
  //return json({ category });
  return redirect(`/admin/categories/update?slug=${category.slug}`);
};

export default function Categories() {
  const cats = useLoaderData();
  const actionData = useActionData();
  const [catName, setCatName] = useState();
  const [featuredImg, setFeaturedImg] = useState();
  const [openFileModal, setOpenFileModal] = useState(false);
  const [modalType, setModalType] = useState();

  //console.log(featuredImg)

  function toggleFileModal(e) {
    setModalType(e.target.dataset.modal);
    setOpenFileModal(!openFileModal);
  }

  return (
    <>
      <div className="px-4 pb-6 sm:px-6 md:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900">Categories</h1>
      </div>

      <div className="space-y-8 divide-y divide-gray-200">
        <div className="mt-2 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
          <div className="order-last col-span-6 lg:col-span-2">
            <Form method="post" className="space-y-8 divide-y divide-gray-200">
              <div className="overflow-hidden bg-white md:rounded md:shadow">
                <div className="border-grey-200 w-full border-b bg-white  px-4 py-5 text-sm font-medium text-gray-700 hover:text-gray-500">
                  Add New Category
                </div>
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
                    className="mb-4 h-48 w-full rounded-tl-md rounded-tr-md object-cover hover:opacity-75"
                    onClick={toggleFileModal}
                  />
                ) : (
                  <div className="mt-1 sm:col-span-2 sm:mt-0 ">
                    <div className="m-6 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 group-hover:bg-slate-300">
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

                <div className="p-8 pt-2">
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
                        onChange={(e) => setCatName(e.target.value)}
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
                        defaultValue={slugify(catName || "")}
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
                </div>
                <div className="mt-2 flex justify-end bg-gray-50 px-8 py-4">
                  <button
                    type="submit"
                    className="ml-3 rounded bg-blue-600  py-2 px-4 text-white hover:bg-blue-700 focus:bg-blue-400"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </Form>
          </div>

          <div className="col-span-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10  lg:gap-x-8 xl:grid-cols-4">
              <CategoryList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
