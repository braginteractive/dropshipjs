import CloudMedia from "~/components/CloudMedia";

export default function Gallery({ product, gallery, toggleFileModal, route }) {
  //console.log(gallery);

  return (
    <>
      <div className="relative mt-6 flex w-full flex-col items-center justify-center bg-white md:rounded md:shadow">
        {route === "view" && gallery.length > 0 && (
          <div className="border-grey-200 w-full border-b px-4 py-5 text-sm font-medium text-gray-700 hover:text-gray-500">
            Image Gallery
          </div>
        )}
        {gallery.length > 0 && (
          <ul className="grid grid-cols-4 content-center items-center gap-x-4 gap-y-4 p-4">
            {gallery.map((g, gIdx) => (
              <li key={gIdx} className="relative">
                <CloudMedia
                  alt={product?.name + "-" + gIdx}
                  id={g}
                  onClick={toggleFileModal}
                  data-modal="gallery"
                  className="py-4"
                />
              </li>
            ))}
          </ul>
        )}
        {route != "view" && (
          <button
            type="button"
            onClick={toggleFileModal}
            className="border-grey-200 w-full border-t py-4  text-sm font-medium text-gray-700 hover:text-gray-500"
            data-modal="gallery"
          >
            {gallery.length === 0
              ? "Set Gallery Images"
              : "Edit Gallery Images"}
          </button>
        )}
      </div>
    </>
  );
}
