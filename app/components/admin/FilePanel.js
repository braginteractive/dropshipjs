import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import CloudMedia from "~/components/CloudMedia";

// Slide-out panel for files
export default function FilePanel({
  openFilePanel,
  toggleFilePanel,
  file = [],
}) {
  const fileFetcher = useFetcher();

  useEffect(() => {
    if (openFilePanel && fileFetcher.type === "init") {
      fileFetcher.load(`/admin/media/${file.public_id.split("/")[1]}`);
    }
  }, [openFilePanel, fileFetcher]);

  //console.log(fileFetcher);

  const data = fileFetcher.data;

  return (
    <>
      <Transition.Root show={openFilePanel} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-hidden"
          onClose={toggleFilePanel}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          File Details
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={toggleFilePanel}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="space-y-6 pb-16">
                          {fileFetcher.state === "loading" && (
                            <span className="inline-flex items-center justify-center">
                              <svg
                                className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>{" "}
                              Loading
                            </span>
                          )}
                          {data && (
                            <>
                              <div>
                                <div className="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg">
                                  <CloudMedia
                                    key={file.asset_id}
                                    className="object-cover"
                                    id={file.public_id}
                                  />
                                </div>

                                <h2 className="text-lg font-medium text-gray-900">
                                  <span className="sr-only">Details for </span>
                                  {data.public_id}
                                </h2>
                                <p className="text-sm font-medium text-gray-500">
                                  {data.asset_id}
                                </p>
                                <p className="text-sm font-medium text-gray-500">
                                  {data.bytes / 1000} KB
                                </p>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  Metadata
                                </h3>
                                <div className="my-2 divide-y divide-gray-200 border-t border-b border-gray-200 py-3">
                                  <fileFetcher.Form
                                    action={
                                      "/admin/media/" +
                                      file.public_id.split("/")[1]
                                    }
                                    method="post"
                                  >
                                    <label
                                      htmlFor="title"
                                      className="block text-sm font-medium text-gray-500"
                                    >
                                      Title
                                    </label>
                                    <div className="relative w-full">
                                      <input
                                        name="title"
                                        id="title"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="title of file"
                                        type="text"
                                        defaultValue={
                                          data.context?.custom?.caption
                                        }
                                      />
                                    </div>
                                    <label
                                      htmlFor="alt"
                                      className="block pt-3 text-sm font-medium  text-gray-500 "
                                    >
                                      Alt Text
                                    </label>
                                    <div className="relative w-full">
                                      <input
                                        name="alt"
                                        id="alt"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="alt text of file"
                                        type="text"
                                        defaultValue={data.context?.custom?.alt}
                                      />
                                    </div>
                                    <input
                                      type="hidden"
                                      name="public_id"
                                      defaultValue={file.public_id}
                                    />
                                    <div className="mt-3 flex border-0">
                                      <button
                                        type="submit"
                                        disabled={
                                          fileFetcher.state === "submitting" ||
                                          fileFetcher.state === "loading"
                                        }
                                        className="flex-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                      >
                                        {fileFetcher.state === "submitting" ||
                                        fileFetcher.state === "loading" ? (
                                          <span className="inline-flex items-center justify-center">
                                            <svg
                                              className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-white"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                            >
                                              <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                              ></circle>
                                              <path
                                                className="opacity-75"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              ></path>
                                            </svg>{" "}
                                            Submitting...
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center justify-center">
                                            Save
                                          </span>
                                        )}
                                      </button>
                                    </div>
                                  </fileFetcher.Form>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  Information
                                </h3>
                                <dl className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
                                  <div className="flex justify-between py-3 text-sm font-medium">
                                    <dt className="text-gray-500">Created</dt>
                                    <dd className="text-gray-900">
                                      <time
                                        className="ml-1"
                                        dateTime={data.created_at}
                                      >
                                        {format(
                                          new Date(data.created_at),
                                          "PPP"
                                        )}
                                      </time>
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-3 text-sm font-medium">
                                    <dt className="text-gray-500">Format</dt>
                                    <dd className="text-gray-900">
                                      {data.format}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-3 text-sm font-medium">
                                    <dt className="text-gray-500">
                                      Resource Type
                                    </dt>
                                    <dd className="text-gray-900">
                                      {data.resource_type}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-3 text-sm font-medium">
                                    <dt className="text-gray-500">
                                      Dimensions
                                    </dt>
                                    <dd className="text-gray-900">
                                      {data.width} x {data.height}
                                    </dd>
                                  </div>
                                  <div className="flex justify-between py-3 text-sm font-medium">
                                    <dt className="text-gray-500">Colors</dt>
                                    <dd className="text-gray-900">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex flex-shrink-0 -space-x-1">
                                          {data?.colors?.map((c) => (
                                            <div
                                              key={c[1]}
                                              aria-hidden="true"
                                              style={{
                                                backgroundColor: c[0],
                                              }}
                                              className="h-6 w-6 max-w-none rounded-full ring-2 ring-gray-200"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
