import { createCookie } from "@remix-run/node";
import { getUserCart } from "~/models/cart.server";
import { v4 as uuidv4 } from "uuid";

export const userDevice = createCookie("user-device", {
  maxAge: 604_800, // one week
});

export async function getCookie(request) {
  const cookieHeader = request.headers.get("Cookie");
  return (await userDevice.parse(cookieHeader)) || {};
}

export async function getCart(request) {
  const cookie = await getCookie(request);

  if (Object.keys(cookie).length === 0) {
    const cart = [];
    return cart;
  } else {
    const cart = await getUserCart({ deviceId: cookie.device });
    return cart;
  }
}

export async function getDeviceId(cookie) {
  if (Object.keys(cookie).length == 0) {
    cookie.device = uuidv4();
  }
  return cookie.device;
}
