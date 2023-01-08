import { Link } from "@remix-run/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import checkImgURL from "~/lib/checkImgURL";
import CloudMedia from "~/components/CloudMedia";

export default function Product({ product, externalIds = [], type = "db" }) {
  // console.log(product)
  return (
    <>
      <div
        key={product.id}
        className="col-span-1 flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
      >
        <div className="mx-auto flex grow  items-center ">
          {type === "api" && checkImgURL(product.thumbnail_url) ? (
            <img alt={product.name} src={product.thumbnail_url} />
          ) : product.featured_img ? (
            <CloudMedia
              id={product.featured_img || product.thumbnail_url}
              alt={product?.name}
            />
          ) : (
            <PhotoIcon
              className="h-32 w-32 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div>
          <div className="flex flex-col justify-between divide-y  divide-gray-200">
            <div className="flex items-center space-x-3 p-4 sm:justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {product.name}
              </h3>
              {type === "api" && !externalIds.includes(product.external_id) && (
                <span className="inline-block flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  NOT ADDED
                </span>
              )}
              {!product.published && type != "api" && (
                <span className="inline-block flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  DRAFT
                </span>
              )}
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                {product.slug ? (
                  <>
                    <div className="flex w-0 flex-1">
                      <Link
                        to={`${product.slug}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-3">View</span>
                      </Link>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <Link
                        to={`update?slug=${product.slug}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex w-0 flex-1">
                    <Link
                      to={`add?id=${product.id}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      <span className="ml-3">Add Product</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
