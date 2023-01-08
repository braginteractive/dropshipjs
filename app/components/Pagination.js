import { Link, useSearchParams } from "@remix-run/react";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";

export default function Pagination({ count, type }) {
  const pageNum = Math.ceil(count / 24);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const printfulPage = searchParams.get("printfulpage") || 1;
  const query = searchParams.get("query");
  const searchPath = query ? "&query=" + query : "";
  const current = !type ? currentPage : printfulPage;

  return (
    <>
      {count && (
        <nav className="my-20 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div className="-mt-px flex w-0 flex-1">
            {parseInt(current) >= 2 && (
              <Link
                to={
                  !type
                    ? `?page=${currentPage - 1 + searchPath}`
                    : `?printfulpage=${printfulPage - 1}`
                }
                className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 font-medium text-gray-500  hover:border-green-700 hover:text-green-700"
              >
                <ArrowSmallLeftIcon
                  className="mr-3 h-5 w-5"
                  aria-hidden="true"
                />
                Previous
              </Link>
            )}
          </div>

          <div>
            <p className="mt-4 hidden font-light text-gray-500   md:inline-block">
              Page <span className="font-medium">{current}</span> of{" "}
              <span className="font-medium">{pageNum}</span> -{" "}
              <span className="font-medium">{count}</span> total results
            </p>
          </div>

          <div className="-mt-px flex w-0 flex-1 justify-end">
            {!(parseInt(current) >= pageNum) && (
              <Link
                to={
                  !type
                    ? `?page=${parseInt(currentPage) + 1 + searchPath}`
                    : `?printfulpage=${parseInt(printfulPage) + 1}`
                }
                className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 font-medium text-gray-500   hover:border-green-700 hover:text-green-700"
              >
                Next
                <ArrowSmallRightIcon
                  className="ml-3 h-5 w-5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
