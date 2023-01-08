import { Link, useSearchParams } from "@remix-run/react";

export default function PaginationTable({ count }) {
  const pageNum = Math.ceil(count / 20);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || "1";

  return (
    <>
      {count > 0 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{pageNum}</span> -{" "}
              <span className="font-medium">{count}</span> total results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            {parseInt(currentPage) >= 2 && (
              <Link
                to={`?page=${currentPage - 1}`}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            )}

            {!(parseInt(currentPage) >= pageNum) && (
              <Link
                to={`?page=${parseInt(currentPage) + 1}`}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
