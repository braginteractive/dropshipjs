import { Link } from "@remix-run/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import CloudMedia from "~/components/CloudMedia";

export default function CategoryProductList({ product }) {
  return (
    <>
      <div key={product.id} className="group py-2">
        <Link to={`/admin/products/${product.slug}`}>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CloudMedia
                alt={product.name}
                id={product.featured_img}
                className="h-8 w-8 rounded-full group-hover:scale-125"
              />
            </div>
            <div className="min-w-0 grow">
              <p className="truncate text-sm font-medium text-gray-900  group-hover:text-indigo-700">
                {product.name}
                <EyeIcon
                  className="ml-2 inline-flex h-6 w-6 items-center rounded-full p-1 text-gray-500 opacity-0  transition duration-300 ease-in-out group-hover:text-gray-700 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </p>
            </div>
            <div></div>
          </div>
        </Link>
      </div>
    </>
  );
}
