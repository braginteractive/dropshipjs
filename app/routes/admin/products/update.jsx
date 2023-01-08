import { getProduct, updateProduct } from "~/models/product.server";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireUserId } from "~/session.server";
import FileModal from "~/components/admin/FileModal";
import { useState, lazy } from "react";
import FeaturedImage from "~/components/admin/FeaturedImage";
import Gallery from "~/components/admin/Gallery";
import Categories from "~/components/admin/Categories";
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
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  invariant(slug, "Slug not found");

  const product = await getProduct({ userId, slug });
  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ product });
};

export const action = async ({ request }) => {
  const formData = await request.formData();

  const { _action, ...values } = Object.fromEntries(formData);
  //console.log(values);
  const { name, description } = values;

  // const id = formData.get("id");
  // const name = formData.get("name");
  // const slug = formData.get("slug");
  // const featured_img = formData.get("featured_img");
  // const galleryString = formData.get("gallery");
  // const categoriesString = formData.get("categories");
  // const description = formData.get("description");
  // const publishedString = formData.get("published");
  // const priceString = formData.get("price");

  // const gallery = !galleryString ? [] : galleryString.split(",");
  // const categories = !categoriesString ? [] : categoriesString.split(",");
  // const price = parseFloat(priceString);
  // const published = publishedString === "on" ? true : false;

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

  const product = await updateProduct(values);

  return redirect(`/admin/products/${product.slug}`);
};

export default function ProductId() {
  const { product } = useLoaderData();
  const actionData = useActionData();
  const variants = product.variants;
  const [featuredImg, setFeaturedImg] = useState(product.featured_img);
  const [gallery, setGallery] = useState(product.gallery);
  const [openFileModal, setOpenFileModal] = useState(false);
  const [modalType, setModalType] = useState();
  const [published, setPublished] = useState(product.published);

  const [categories, setCategories] = useState(
    product.categories.map((cat) => cat.id)
  );

  const [description, setDescription] = useState(product.description);

  function editorChange(e) {
    setDescription(e);
  }

  function toggleFileModal(e) {
    setModalType(e.target.dataset.modal || "");
    setOpenFileModal(!openFileModal);
  }

  //console.log(featuredImg);

  return (
    <Form
      method="post"
      action={"/admin/products/update?slug=" + product.slug}
      className="space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
          <div className="col-span-6 lg:col-span-2 lg:col-start-5">
            <FeaturedImage
              product={product}
              featuredImg={featuredImg}
              setFeaturedImg={setFeaturedImg}
              toggleFileModal={toggleFileModal}
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

            <input
              type="hidden"
              name="featured_img"
              defaultValue={featuredImg}
            />
            <input type="hidden" name="gallery" defaultValue={gallery} />
          </div>

          <div className="col-span-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
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
                      defaultValue={product.name}
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
                      defaultValue={product.slug}
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
                    {() => (
                      <LazyEditor
                        defaultValue={description}
                        editorChange={editorChange}
                      />
                    )}
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
                    defaultValue={product.price}
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
                </div>

                <input
                  type="hidden"
                  name="categories"
                  defaultValue={categories}
                />
                <input type="hidden" name="id" defaultValue={product.id} />
              </div>

              <div className="mt-2 flex justify-end bg-gray-50 px-8 py-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 rounded bg-blue-600 py-2  px-4 text-white shadow-sm hover:bg-blue-700 focus:bg-blue-400"
                >
                  Update Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
