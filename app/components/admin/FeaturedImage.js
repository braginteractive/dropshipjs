import checkImgURL from "~/lib/checkImgURL";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import CloudMedia from "~/components/CloudMedia";

export default function FeaturedImage({
  product,
  featuredImg,
  setFeaturedImg,
  toggleFileModal,
  route,
}) {
  return (
    <>
      <div className="relative flex w-full flex-col items-center justify-center bg-white md:rounded md:shadow">
        {featuredImg ? (
          <>
            {route === "view" && (
              <div className="border-grey-200 w-full border-b px-4  py-5 text-sm font-medium text-gray-700 hover:text-gray-500">
                Featured Image
              </div>
            )}

            <CloudMedia
              id={featuredImg || product.featured_img}
              alt={product?.name}
              onClick={toggleFileModal}
              data-modal="featured"
              className="py-4"
            />

            {route != "view" && (
              <button
                type="button"
                className="absolute top-2 right-2  text-red-400 hover:text-red-500"
                onClick={() => setFeaturedImg("")}
              >
                <span className="sr-only">Remove Featured Image</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </>
        ) : route === "add" && checkImgURL(product?.thumbnail_url) ? (
          <img alt={product?.name} src={product?.thumbnail_url} />
        ) : (
          <PhotoIcon className="h-32 w-32 text-gray-400" aria-hidden="true" />
        )}
        {route != "view" && (
          <button
            type="button"
            onClick={toggleFileModal}
            className="border-grey-200 w-full border-t py-4  text-sm font-medium text-gray-700 hover:text-gray-500"
            data-modal="featured"
          >
            {featuredImg ? "Edit Featured Image" : "Set Featured Image"}
          </button>
        )}
      </div>
    </>
  );
}
