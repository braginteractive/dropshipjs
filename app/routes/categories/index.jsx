import { Link, useLoaderData } from "@remix-run/react";
import CloudMedia from "~/components/CloudMedia";
import { getCategories } from "~/models/category.server";

export const loader = async ({ request }) => {
  const cats = await getCategories(true);
  return cats;
};

export default function CategoriesIndex() {
  const data = useLoaderData();

  return (
    <>
      <main>
        <div className="border-grey-200 mb-10 border-b pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Shop by Category
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Find that special product by category.
          </p>
        </div>

        {/* Category grid */}
        <section aria-labelledby="categories-heading" className="mt-8">
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {data.map((category) => (
              <Link
                key={category.id}
                to={`${category.slug}`}
                className="group block"
              >
                <div
                  aria-hidden="true"
                  className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg group-hover:opacity-80 group-hover:shadow-2xl group-hover:shadow-blue-500/20 lg:aspect-w-5 lg:aspect-h-6"
                >
                  <CloudMedia
                    alt={category.name}
                    id={category.image}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h2 className="mt-4 text-base font-semibold text-gray-900">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
