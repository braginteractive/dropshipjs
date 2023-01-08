import { useFetcher } from "@remix-run/react";

// Post to the /cart route to add items to the cart
// sends the product id and the add_to_cart action
export default function AddToCart({ productId, variant, color, className }) {
  const addToCart = useFetcher();

  //console.log(addToCart.data);

  return (
    <addToCart.Form method="post" action="/cart">
      <input type="hidden" name="productId" defaultValue={productId} />
      <input type="hidden" name="color" defaultValue={color} />
      <input
        type="hidden"
        name="variant"
        defaultValue={JSON.stringify(variant)}
      />
      <button type="submit" className={`add-to-cart ${className}`}>
        {addToCart.state === "submitting" || addToCart.state === "loading" ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="stroke-4 -ml-1 mr-3 h-5 w-5 animate-spin fill-current text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"></circle>
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>{" "}
            Adding to Cart
          </span>
        ) : (
          <span>Add To Cart</span>
        )}
      </button>
      <input type="hidden" name="_action" value="add_to_cart" />
    </addToCart.Form>
  );
}
