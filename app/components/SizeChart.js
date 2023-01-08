import { Fragment, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "~/lib/classNames";

export default function SizeChart({ size_tables = [] }) {
  const [openSizeChart, setOpenSizeChart] = useState(false);

  //console.log(size_tables);

  return (
    <>
      {size_tables.length > 0 && (
        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => setOpenSizeChart(true)}
        >
          See sizing chart
        </button>
      )}

      <Transition.Root show={openSizeChart} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenSizeChart}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden md:inline-block md:h-screen md:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                      onClick={() => setOpenSizeChart(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <Tab.Group>
                      <Tab.List className="mb-2 flex space-x-8 border-b border-gray-200">
                        {size_tables.map((size, idx) => (
                          <Tab
                            key={size.type}
                            className={({ selected }) =>
                              classNames(
                                "border-transparent text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                selected
                                  ? "border-b-2 border-green-500 text-green-600"
                                  : "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                              )
                            }
                          >
                            {idx === 0
                              ? "Sizing Guide"
                              : "Product Measurements"}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels>
                        {size_tables.map((size, idx) => (
                          <Tab.Panel key={size.type + "-" + idx}>
                            <div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: size.description,
                                }}
                              />

                              <div className="my-3 flex items-center">
                                <img
                                  src={size.image_url}
                                  alt={size.type}
                                  className="pr-5"
                                />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: size.image_description,
                                  }}
                                />
                              </div>

                              <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                                    >
                                      Size in {size.unit}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {size.measurements.map((label) => (
                                    <tr key={label.type_label}>
                                      <td
                                        scope="col"
                                        className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                      >
                                        {label.type_label}
                                      </td>
                                      {label.values.map((v) => (
                                        <td
                                          key={v.size}
                                          className="whitespace-nowrap py-4 pr-3 text-sm text-gray-500"
                                        >
                                          {(v.value ||
                                            v.min_value + "-" + v.max_value) +
                                            " (" +
                                            v.size +
                                            ")"}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
