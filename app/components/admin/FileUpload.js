import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

export default function FileUpload({ setFiles, setNext }) {
  const fileUpload = useFetcher();
  const uploadFetcher = useFetcher();
  const [uploadStatus, setUploadStatus] = useState();

  function uploadFile(event) {
    fileUpload.submit(event.currentTarget, {
      method: "post",
      action: "/admin/media?index",
      encType: "multipart/form-data",
    });
  }

  useEffect(() => {
    if (fileUpload.type === "done") {
      setUploadStatus(fileUpload.type);
    }
  }, [fileUpload]);

  useEffect(() => {
    // Acts as a refresh when a file is uploaded from the FileUpload component
    if (uploadStatus === "done") {
      uploadFetcher.load(`/admin/media?index`);
    }
  }, [uploadStatus]);

  useEffect(() => {
    // Resets the files with the new uploads
    if (uploadFetcher.data) {
      setFiles(uploadFetcher.data.resources);
      setNext(uploadFetcher.data.next_cursor);
    }
  }, [uploadFetcher.data]);

  return (
    <div className="my-6 mx-4 flex justify-center rounded-md border-2 border-dashed border-gray-300 pt-5 pb-6 group-hover:bg-slate-300 sm:mx-0 ">
      <fileUpload.Form onChange={uploadFile}>
        {(fileUpload.state === "submitting" ||
          fileUpload.state === "loading") && (
          <span className="inline-flex items-center justify-center">
            <svg
              className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-black"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"></circle>
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>{" "}
            Uploading...
          </span>
        )}

        <label htmlFor="img" className="">
          <span className="sr-only">Upload a file</span>
          <input
            id="img"
            name="img"
            type="file"
            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            multiple
          />
        </label>
      </fileUpload.Form>
    </div>
  );
}
