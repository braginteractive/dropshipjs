import { useFetcher, Link } from "@remix-run/react";
import { useEffect } from "react";
import CloudMedia from "~/components/CloudMedia";

export default function CategoryList() {
  const categoryFetcher = useFetcher();

  useEffect(() => {
    if (categoryFetcher.type === "init") {
      categoryFetcher.load("/admin/categories?index");
    }
  }, [categoryFetcher]);

  //console.log(categoryFetcher.data);

  return (
    <>
      {categoryFetcher?.data?.map((cat) => (
        <div
          key={cat.id}
          className="col-span-1 flex flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        >
          {cat.image ? (
            <CloudMedia
              alt={cat?.name}
              id={cat.image}
              className="h-48 w-full rounded-tl-md rounded-tr-md object-cover"
            />
          ) : (
            <div className="mt-1 p-8 sm:col-span-2 sm:mt-0">
              <div className="flex justify-center rounded-md px-6 pt-5 pb-6 group-hover:bg-slate-300">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-20 w-20 text-gray-400"
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
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-col justify-between divide-y divide-gray-200">
              <div className="flex items-center space-x-3 p-4 sm:justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link to={`${cat.slug}`}>{cat.name}</Link>
                </h3>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <>
                    <div className="flex w-0 flex-1">
                      <Link
                        to={`${cat.slug}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        <span className="ml-3">View</span>
                      </Link>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <Link
                        to={`update?slug=${cat.slug}`}
                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                      >
                        Edit
                      </Link>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {categoryFetcher?.data?.length === 0 && (
        <div className="col-span-4 ">
          <div className="mt-5 rounded-lg bg-red-600 p-2 shadow-lg sm:p-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 flex-1 items-center">
                <p className="ml-3 truncate font-medium text-white">
                  <span>No categories.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
