import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";

export default function LoadMore({ setFiles, next, setNext }) {
  const moreFetcher = useFetcher();
  function loadMore(next) {
    // use the next cursor to load next batch of images from cloudinary
    moreFetcher.load(`/admin/media?index&next=${next}`);
  }

  useEffect(() => {
    // moreFetcher has data from loadMore function, append to loader data files and set next_cursor
    if (moreFetcher.data) {
      setFiles((prevFiles) => [...prevFiles, ...moreFetcher.data.resources]);
      setNext(moreFetcher.data.next_cursor);
    }
  }, [moreFetcher.data]);

  return (
    <div className="my-6 flex justify-center  pt-5 pb-6 ">
      {next && (
        <button
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          type="button"
          onClick={() => loadMore(next)}
        >
          {moreFetcher.state === "submitting" ||
          moreFetcher.state === "loading" ? (
            <span className="inline-flex items-center justify-center">
              <svg
                className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10"></circle>
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{" "}
              Loading...
            </span>
          ) : (
            <span className="inline-flex items-center justify-center">
              Load More
            </span>
          )}
        </button>
      )}
    </div>
  );
}
