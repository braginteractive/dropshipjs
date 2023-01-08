import { getProducts, getProductCount } from "~/models/product.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Product from "~/components/Product";
import Pagination from "~/components/Pagination";
import MetaImage from "~/images/social-share.jpg";

export function meta() {
  const meta = {
    title: "DropshipJS Clothing & Accessories | DropshipJS.com ",
    description:
      "Shop from our official online store here. Shirts, hoodies, shorts, hats, accessories, and more.",
  };
  return {
    title: meta.title,
    description: meta.description,
    image: MetaImage,
    "og:url": "https://dropshipjs.com",
    "og:image": MetaImage,
    "og:type": "website",
    "twitter:card": "summary_large_image",
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": MetaImage,
  };
}

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") || 1;

  const products = await getProducts(undefined, currentPage);
  const productCount = await getProductCount();

  return json({ products, productCount });
};

export default function ProductIndexPage() {
  const { products, productCount } = useLoaderData();

  return (
    <main>
      <div className="mb-10  border-b border-neutral-200 pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
        <p className="mt-4 text-lg text-gray-800">
          Checkout out the latest release of shirts, hats and various
          accessories!
        </p>
      </div>

      {products?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
            {products
              .filter((draft) => draft.published)
              .map((product) => (
                <Product key={product.id} product={product} />
              ))}
          </div>
          <Pagination count={productCount} />
        </>
      ) : (
        <div className="mt-12 flex -rotate-6 justify-center">
          <h1 className="inline-block rounded-lg border-2 border-red-600 bg-red-600 p-6 text-9xl font-extrabold uppercase text-white">
            Sold Out
          </h1>
        </div>
      )}
    </main>
  );
}
