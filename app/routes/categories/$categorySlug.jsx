import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getProductsByCategory } from "~/models/category.server";
import Product from "~/components/Product";

export const loader = async ({ request, params }) => {
  invariant(params.categorySlug, "categorySlug not found");

  // get product from db
  const category = await getProductsByCategory({ slug: params.categorySlug });
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ category });
};

export default function CategorySlugPage() {
  const { category } = useLoaderData();
  //console.log(category);

  return (
    <main>
      <div className="border-grey-200 mb-10  border-b pb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {category.name}
        </h1>
        <p className="mt-4 text-lg text-gray-700">{category.description}</p>
      </div>

      {category.products?.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
          {category.products
            .filter((draft) => draft.published)
            .map((product) => (
              <Product key={product.id} product={product} />
            ))}
        </div>
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
