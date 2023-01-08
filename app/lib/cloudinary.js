import cloudinary from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import slugify from "~/lib/slugify";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(data, filename) {
  const file = filename.split('.').slice(0, -1).join('.')
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "printful",
        unique_filename: false,
        use_filename: true,
        public_id: slugify(file)
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise;
}

export async function getFiles(next_cursor = null) {
  const files = cloudinary.v2.api.resources(
    {
      type: "upload",
      direction: "desc",
      max_results: 15,
      next_cursor,
      metadata: true,
      context: true,
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
      //console.log(error, result);
    }
  );

  return files;
}

export async function getFile(id) {
  const file = cloudinary.v2.api.resource(
    "printful/" + id,
    {
      colors: true,
      pages: true,
      image_metadata: true,
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
    }
  );
  return file;
}

export async function updateFile({ public_id, title, alt }) {
  console.log(public_id, alt, title);
  const file = cloudinary.v2.api.update(
    public_id,
    {
      context: "caption=" + title + "|alt=" + alt,
    },
    function (error, result) {
      if (error) {
        console.log(error);
      }
    }
  );
  return file;
}
