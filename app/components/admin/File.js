import { useState } from "react";
import classNames from "~/lib/classNames";
import CloudMedia from "~/components/CloudMedia";
import FilePanel from "./FilePanel";

export default function File({ file }) {
  const [openFilePanel, setOpenFilePanel] = useState(false);
  function toggleFilePanel() {
    setOpenFilePanel(!openFilePanel);
  }

  //console.log(file);

  return (
    <>
      <li className="relative">
        <div
          className={classNames(
            file.current
              ? "ring-2 ring-indigo-500 ring-offset-2"
              : "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100",
            "group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100"
          )}
        >
          <CloudMedia
            key={file.asset_id}
            id={file.public_id}
            className={classNames(
              file.current ? "" : "group-hover:opacity-75",
              "pointer-events-none  object-cover"
            )}
            alt={file.context?.custom?.alt}
          />
          {file.public_id.split("/")[0] === "printful" && (
            <button
              type="button"
              onClick={toggleFilePanel}
              className="absolute inset-0 focus:outline-none"
            >
              <span className="sr-only">View details for {file.name}</span>
            </button>
          )}
        </div>
        <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
          {file.public_id}
        </p>
      </li>
      <FilePanel
        openFilePanel={openFilePanel}
        toggleFilePanel={toggleFilePanel}
        file={file}
      />
    </>
  );
}
