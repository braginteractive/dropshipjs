import type { User, CartItem, Product } from "@prisma/client";
import { prisma } from "~/db.server";
export type { CartItem } from "@prisma/client";

export function groupCarts() {
  return prisma.cartItem.groupBy({
    by: ["deviceId"],
  });
}

export function getCarts(currentPage: number = 1) {
  const perPage = 20;
  return prisma.cartItem.findMany({
    include: {
      product: true,
    },
    take: perPage,
    skip: (currentPage - 1) * perPage,
  });
}

// Used in cookies.js to set the deviceID
export function getUserCart({ deviceId }: Pick<CartItem, "deviceId">) {
  return prisma.cartItem.findMany({
    where: { deviceId },
    include: {
      product: true,
    },
  });
}

export function getCartDetails(id: Pick<CartItem, "id">) {
  return prisma.cartItem.findMany({
    where: { deviceId: id },
    include: {
      product: true,
    },
  });
}

export function getCartItems({
  productId,
  deviceId,
  external_variant_id,
}: Pick<CartItem, "productId" | "deviceId" | "external_variant_id"> & {
  productId: Product["id"];
}) {
  return prisma.cartItem.findMany({
    select: { id: true, deviceId: true, external_variant_id: true },
    where: {
      AND: [{ productId }, { external_variant_id }, { deviceId }],
    },
  });
}

export function addProductToCart({
  productId,
  color,
  size,
  external_variant_id,
  deviceId,
}: Pick<CartItem, "color" | "size" | "deviceId" | "external_variant_id"> & {
  productId: Product["id"];
}) {
  return prisma.cartItem.create({
    data: {
      quantity: 1,
      color,
      size,
      external_variant_id,
      deviceId,
      product: {
        connect: {
          id: productId,
        },
      },
    },
  });
}

export function updateCartItem({
  id,
}: Pick<CartItem, "id"> & {
  id: CartItem["id"];
}) {
  return prisma.cartItem.update({
    where: { id },
    data: { quantity: { increment: 1 } },
  });
}

export function deleteCartItem({
  id,
}: Pick<CartItem, "id"> & {
  id: CartItem["id"];
}) {
  return prisma.cartItem.delete({
    where: { id },
  });
}
