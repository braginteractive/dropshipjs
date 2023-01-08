import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { useMatches } from "@remix-run/react";
import { json } from "@remix-run/node";
import { userDevice, getCookie, getDeviceId } from "~/cookies";
import Product from "~/components/Product";
import {
  addProductToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "~/models/cart.server";

export const action = async ({ request }) => {
  const cookie = await getCookie(request);
  const deviceId = await getDeviceId(cookie);

  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { productId, cartItem, quantityString, color, variant } = values;

  const quantity = parseInt(quantityString);

  // add items to cart
  if (_action === "add_to_cart") {
    // Parse variant object that has the size and color
    const variantObj = JSON.parse(variant);
    const external_variant_id = variantObj.id;
    const size = variantObj.size;

    // get user items currently in cart
    const cartItems = await getCartItems({
      productId,
      deviceId,
      external_variant_id,
    });
    const [existingCartItem] = cartItems;
    //if user item is already in cart, increment by 1
    if (existingCartItem) {
      return await updateCartItem(existingCartItem);
    }
    // if there isnt a user and the product isnt in the cart, add it
    const product = await addProductToCart({
      productId,
      color,
      size,
      external_variant_id,
      deviceId,
    });
    return json(product, {
      headers: {
        "Set-Cookie": await userDevice.serialize(cookie),
      },
    });
  }

  // delete item from cart
  if (_action === "delete_cart_item") {
    try {
      await deleteCartItem({ id: cartItem });
      return json({ ok: true });
    } catch (error) {
      return json({ error: error.message });
    }
  }
};

export default function Cart() {
  const match = useMatches();
  const cart = match[0].data.cart;

  return (
    <>
      <Header /*cart={cart}*/ />
      <div className="mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        {/* {cart?.reduce(
                        (tally, cartItem) => tally + cartItem.quantity,
                        0
                      )}  */}

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {cart.map((product) => (
            <Product key={product.id} product={product.product} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
