import CloudMedia from "~/components/CloudMedia";
import formatMoney from "~/lib/formatMoney";

export default function OrderItems({ order }) {
  return (
    <>
      {order && (
        <section aria-labelledby="order-heading" className="mt-10 ">
          <h2 id="order-heading" className="sr-only">
            Your order items
          </h2>

          <h3 className="sr-only">Items</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {order?.items?.map((product) => (
              <div
                key={product.id}
                className="flex border border-gray-200 bg-white py-10 shadow-sm sm:rounded-lg sm:border"
              >
                <CloudMedia
                  alt={product.name}
                  id={product.featured_img}
                  className="mx-4 h-20 w-20 flex-none rounded-lg bg-gray-200 object-cover object-center xl:h-40 xl:w-40"
                />

                <div className="flex flex-auto flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-medium text-gray-900">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-6 flex flex-col">
                    <dl className="flex flex-col flex-wrap gap-2 text-sm xl:flex-row xl:gap-6 ">
                      <div className="flex gap-2">
                        <dt className="font-medium text-gray-900 ">
                          Quantity:
                        </dt>
                        <dd className=" text-gray-700">{product.quantity}</dd>
                      </div>
                      {product.size && (
                        <div className="flex gap-2">
                          <dt className="font-medium text-gray-900">Size:</dt>
                          <dd className=" text-gray-700">{product.size}</dd>
                        </div>
                      )}
                      {product.color && (
                        <div className="flex gap-2">
                          <dt className="font-medium text-gray-900">Color:</dt>
                          <dd className=" text-gray-700">{product.color}</dd>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <dt className="font-medium text-gray-900 ">Price:</dt>
                        <dd className=" text-gray-700">
                          {formatMoney(product.price)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
