import { getPrintfulProduct } from "~/lib/printful";
import { useState, lazy } from "react";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createProduct } from "~/models/product.server";
import { requireUserId } from "~/session.server";
import slugify from "~/lib/slugify";
import FileModal from "~/components/admin/FileModal";
import FeaturedImage from "~/components/admin/FeaturedImage";
import Categories from "~/components/admin/Categories";
import Gallery from "~/components/admin/Gallery";
import checkImgURL from "~/lib/checkImgURL";
import { ClientOnly } from "remix-utils";
import { Switch } from "@headlessui/react";
import classNames from "~/lib/classNames";

// Quill Text Editor
let LazyEditor = lazy(() => import("~/components/admin/Editor"));
export const links = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css",
  },
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const product = await getPrintfulProduct({ id });
  return json(product.result);
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  //console.log(values);
  const { name, description } = values;

  if (_action === "add_product") {
    if (typeof name !== "string" || name.length === 0) {
      return json({ errors: { name: "Name is required" } }, { status: 400 });
    }

    if (
      typeof description !== "string" ||
      description.length === 0 ||
      description === "<p><br></p>"
    ) {
      return json(
        { errors: { description: "Description is required" } },
        { status: 400 }
      );
    }

    const product = await createProduct(values, userId);

    return redirect(`/admin/products/${product.slug}`);
  }
};

export default function ProductId() {
  const result = useLoaderData();
  const actionData = useActionData();

  const product = result.sync_product;
  const variantsData = result.sync_variants;

  // Make an arrays of objects of just the Variant data needed.
  const variants = variantsData?.map(
    ({ name, variant_id, external_id, product, retail_price }) => ({
      name,
      variant_id,
      external_id,
      product,
      retail_price,
    })
  );

  //console.log(variants);

  const [featuredImg, setFeaturedImg] = useState();
  const [gallery, setGallery] = useState([]);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");

  function editorChange(e) {
    setDescription(e);
  }

  function toggleFileModal(e) {
    setModalType(e.target.dataset.modal);
    setOpenFileModal(!openFileModal);
  }

  return (
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
        <div className="col-span-6 lg:col-span-2 lg:col-start-5 ">
          <FeaturedImage
            product={product}
            featuredImg={featuredImg}
            setFeaturedImg={setFeaturedImg}
            toggleFileModal={toggleFileModal}
            route="add"
          />
          <Gallery
            product={product}
            gallery={gallery}
            toggleFileModal={toggleFileModal}
          />
          <FileModal
            openFileModal={openFileModal}
            toggleFileModal={toggleFileModal}
            featuredImg={featuredImg}
            setFeaturedImg={setFeaturedImg}
            gallery={gallery}
            setGallery={setGallery}
            modalType={modalType}
          />
        </div>

        <div className="col-span-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
          <Form
            method="post"
            action={"/admin/products/add?id=" + product.id}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="overflow-hidden bg-white md:rounded md:shadow">
              <div className="p-8">
                <ul>
                  <li className="flex items-center justify-between py-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Publish
                      </p>
                      <p className="text-sm text-gray-500">
                        Make available to purchase.
                      </p>
                    </div>
                    <Switch
                      name="published"
                      checked={published}
                      onChange={setPublished}
                      className={classNames(
                        published ? "bg-blue-600" : "bg-gray-200",
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      )}
                    >
                      <span className="sr-only">Publish</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          published ? "translate-x-5" : "translate-x-0",
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  </li>
                </ul>

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
                      defaultValue={product?.name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      aria-invalid={actionData?.errors?.name ? true : undefined}
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
                      defaultValue={slugify(product?.name || "")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="editor mt-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <ClientOnly fallback={<div />}>
                    {() => <LazyEditor editorChange={editorChange} />}
                  </ClientOnly>

                  <input
                    name="description"
                    id="description"
                    type="hidden"
                    value={description}
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

                {/* <div className="mt-6">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="published"
                        aria-describedby="published-description"
                        name="published"
                        type="checkbox"
                        defaultChecked={false}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="published"
                        className="font-medium text-gray-700"
                      >
                        Published
                      </label>
                      <p id="published-description" className="text-gray-500">
                        Add product to site now.
                      </p>
                    </div>
                  </div>
                </div> */}

                <div className="mt-6">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    defaultValue={variants[0].retail_price}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    aria-invalid={actionData?.errors?.price ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.price ? "price-error" : undefined
                    }
                  />

                  {actionData?.errors?.price && (
                    <div className="pt-1 text-red-700" id="price=error">
                      {actionData.errors.price}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Categories
                    categories={categories}
                    setCategories={setCategories}
                  />
                  <input
                    type="hidden"
                    name="categories"
                    defaultValue={categories}
                  />
                </div>

                <input
                  type="hidden"
                  name="featured_img"
                  defaultValue={
                    featuredImg ||
                    (checkImgURL(product?.thumbnail_url)
                      ? product?.thumbnail_url
                      : null)
                  }
                />
                <input type="hidden" name="gallery" defaultValue={gallery} />

                <input
                  type="hidden"
                  name="printful_id"
                  defaultValue={product?.id}
                  className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                />

                <input
                  type="hidden"
                  name="external_id"
                  defaultValue={product?.external_id}
                  className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                />

                <input
                  type="hidden"
                  name="variants"
                  defaultValue={JSON.stringify(variants)}
                />
              </div>

              <input type="hidden" name="_action" value="add_product" />

              <div className="mt-2 flex justify-end bg-gray-50 px-8 py-4">
                <button
                  onClick={() => window.history.back()}
                  className="rounded border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Add Product
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <div>
      <h1 className="text-lg font-medium leading-6 text-gray-900">Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
