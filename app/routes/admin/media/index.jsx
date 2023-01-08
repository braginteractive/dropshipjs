import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getFiles, uploadFile } from "~/lib/cloudinary";
import File from "~/components/admin/File";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import FileUpload from "~/components/admin/FileUpload";
import LoadMore from "~/components/admin/FileLoadMore";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const next = url.searchParams.get("next");
  const files = await getFiles(next);
  return files;
};

export const action = async ({ request }) => {
  const uploadHandler = composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      //console.log(filename);
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage = await uploadFile(data, filename);
      //console.log(uploadedImage);
      return uploadedImage.public_id;
    },
    createMemoryUploadHandler()
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");
  const imgDesc = formData.get("desc");
  const { _action, ...values } = Object.fromEntries(formData);
  console.log(values);
  if (!imgSrc) {
    return json({
      error: "something is wrong",
    });
  }
  return json({
    imgSrc,
    imgDesc,
  });
};

export default function Media() {
  const data = useLoaderData();
  const [files, setFiles] = useState(data.resources);
  const [next, setNext] = useState(data.next_cursor);

  return (
    <>
      <h1 className="px-4 text-3xl font-extrabold text-gray-900 md:px-0">
        Media
      </h1>

      <FileUpload setFiles={setFiles} setNext={setNext} />

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8  px-4 sm:grid-cols-2 sm:gap-x-6 sm:px-0 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {files?.map((file) => (
          <File key={file.asset_id} file={file} />
        ))}
      </ul>

      <LoadMore setFiles={setFiles} next={next} setNext={setNext} />
    </>
  );
}
