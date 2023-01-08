import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import Product from "./Product";

export default function RelatedProduct({ product }) {
  const categoryFetcher = useFetcher();

  //console.log(product);

  useEffect(() => {
    if (product?.categories[0]?.slug && categoryFetcher.type === "init") {
      categoryFetcher.load(`/categories/${product?.categories[0]?.slug}`);
    }
  }, [categoryFetcher]);

  const filteredProducts = categoryFetcher?.data?.category?.products
    ?.slice(0, 4)
    .filter((check) => check.id != product.id && check.published);

  //console.log(filteredProducts);

  return (
    <>
      {filteredProducts?.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="mt-20 border-t-4 border-dotted border-neutral-200 pt-10 sm:pt-10"
        >
          <div className="items-center justify-center px-4 sm:flex sm:px-6 lg:px-8 xl:px-0">
            <h2
              id="related-heading"
              className="mb-10 text-2xl font-extrabold uppercase tracking-tight text-gray-900"
            >
              you might also like
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
            {filteredProducts?.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
