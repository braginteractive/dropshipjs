import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CloudMedia from "~/components/CloudMedia";
import FileUpload from "./FileUpload";
import LoadMore from "./FileLoadMore";

// modal for files
export default function FileModal({
  openFileModal,
  toggleFileModal,
  featuredImg,
  setFeaturedImg,
  gallery,
  setGallery,
  modalType,
}) {
  // state for cloudinary images. used to append files with load more button
  const [files, setFiles] = useState([]);
  // get all the cloudinary images for modal window from admin/media?index route
  const fileFetcher = useFetcher();
  // used for the cloudinary pagination
  const [next, setNext] = useState();

  function handleGallery(e) {
    if (e.target.checked) {
      setGallery([...gallery, e.target.value]);
    } else {
      // remove from list
      setGallery(gallery.filter((check) => check !== e.target.value));
    }
  }

  useEffect(() => {
    // get the resources from cloudinary when the modal opens and drop file state when modal closed
    // this makes sure the state doesnt have duplicates if the modal is opened and closed several times
    openFileModal ? fileFetcher.load(`/admin/media?index`) : setFiles([]);
  }, [openFileModal]);

  useEffect(() => {
    // setState to play friendly with loadmore button for modal open and closing
    if (fileFetcher.data) {
      setFiles((prevFiles) => [...prevFiles, ...fileFetcher.data.resources]);
      setNext(fileFetcher.data.next_cursor);
    }
  }, [fileFetcher.data]);

  //console.log(featuredImg);
  //console.log(gallery);
  //console.log(files);

  return (
    <>
      <Transition.Root show={openFileModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toggleFileModal}>
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
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-7xl">
                  <div className="relative w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                      onClick={toggleFileModal}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Select
                      {modalType === "gallery" ? " gallery images" : " image"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <FileUpload setFiles={setFiles} setNext={setNext} />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                      {files?.map((file) => (
                        <div key={file.asset_id} className="relative">
                          <label
                            htmlFor={file.asset_id}
                            className="select-none font-medium text-gray-700"
                          >
                            <CloudMedia
                              id={file.public_id}
                              alt={file.context?.custom?.alt}
                            />
                          </label>
                          <input
                            id={file.asset_id}
                            name={file.asset_id}
                            value={file.public_id}
                            checked={
                              modalType === "gallery"
                                ? gallery.includes(file.public_id)
                                : featuredImg
                                ? featuredImg === file.public_id
                                : ""
                              // featuredImg && modalType === "featured"
                              //   ? featuredImg.includes(file.public_id)
                              //   : modalType === "gallery"
                              //   ? gallery.includes(file.public_id)
                              //     : ""
                            }
                            onChange={
                              modalType === "gallery"
                                ? handleGallery
                                : (e) => setFeaturedImg(e.target.value)
                            }
                            type="checkbox"
                            className="absolute top-1.5 right-1.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    <LoadMore
                      setFiles={setFiles}
                      next={next}
                      setNext={setNext}
                    />
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
