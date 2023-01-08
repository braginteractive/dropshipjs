import { useLoaderData, Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getFile, updateFile } from "~/lib/cloudinary";
import { requireUserId } from "~/session.server";
import { format } from "date-fns";
import CloudMedia from "~/components/CloudMedia";

export const loader = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.fileId, "fileId not found");

  const file = await getFile(params.fileId);
  if (!file) {
    throw new Response("Not Found", { status: 404 });
  }
  return file;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  // update file metadata
  // sending title and alt text from the FilePanel.js
  const updatedFile = await updateFile(values);
  // The return data from the updateFile doesn't include everything needed in the FilePanel
  // Gotta hit the single file endpoint after updating to get colors for panel.
  const file = await getFile(updatedFile.public_id.split("/")[1]);
  return file;
};

export default function FileDetailsPage() {
  const file = useLoaderData();

  return (
    <main>
      <div className="px-3 md:flex md:items-center md:justify-between md:space-x-5 md:px-0">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                <span className="text-xl font-medium leading-none text-white">
                  File Name
                </span>
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {file.context.custom.alt || "No Alt Text"}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Created on
              <time className="ml-1" dateTime={file.created_at}>
                {format(new Date(file.created_at), "PPP")}
              </time>
            </p>
          </div>
        </div>
        {/* <div className="justify-stretch mt-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <Link
            to={`/admin/products/update?slug=${product.slug}`}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            Edit
          </Link>
          <Form method="post" className="inline-flex items-center justify-center">
            <button
              type="submit"
              className="w-full rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Delete
            </button>
          </Form>
        </div> */}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
        <div className="col-span-6 lg:col-span-2 lg:col-start-5">
          <CloudMedia key={file.asset_id} id={file.public_id} />
        </div>

        <div className="col-span-6 space-y-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
          <Form method="post" className="">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-500"
            >
              Title
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <input
                name="title"
                id="title"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Title"
                type="text"
                defaultValue={file.context?.custom?.caption}
              />
            </div>
            <label
              htmlFor="alt"
              className="block pt-3 text-sm font-medium  text-gray-500 "
            >
              Alt Text
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <input
                name="alt"
                id="alt"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Alt text"
                type="text"
                defaultValue={file.context?.custom?.alt}
              />
            </div>
            <div className="mt-3 flex border-0">
              <button
                type="submit"
                className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </Form>
          {/* <div className="overflow-hidden bg-white md:rounded md:shadow">
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
              <time className="ml-1" dateTime={product.updatedAt}>{format(new Date(product.createdAt), "PPP")}</time>
            </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {product.published ? "Live" : "Not Published"}
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
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {product.description}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div> */}

          {/* <section aria-labelledby="printful-details">
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
          </section> */}
        </div>
      </div>
    </main>
  );
}
