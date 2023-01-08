import { Link } from "@remix-run/react";
import formatMoney from "~/lib/formatMoney";
import CloudMedia from "~/components/CloudMedia";

export default function Product({ product }) {
  return (
    <>
      <div key={product.id} className="group relative text-center">
        <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white transition ease-in-out group-hover:opacity-80 group-hover:shadow-2xl group-hover:shadow-blue-500/20 lg:h-96 lg:aspect-none  ">
          <CloudMedia
            alt={product.name}
            id={product.featured_img}
            className="h-full w-full  object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900">
          <Link to={`/products/${product.slug}`}>
            <span className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {formatMoney(product.price)}
        </p>
      </div>
    </>
  );
}
