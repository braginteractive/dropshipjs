import type { User, Product, Category } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Product } from "@prisma/client";

export function getProduct({ slug }: Pick<Product, "slug">) {
  return prisma.product.findFirst({
    where: { slug },
    include: { categories: true },
  });
}

export function getProducts(
  search: string,
  currentPage: number = 1,
  published: boolean = true
) {
  const perPage = 24;
  return prisma.product.findMany({
    where: {
      published: published ? true : undefined,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      published: true,
      featured_img: true,
      slug: true,
      external_id: true,
      price: true,
    },
    orderBy: { createdAt: "desc" },
    take: perPage,
    skip: (currentPage - 1) * perPage,
  });
}

export function getProductCount(search: string, published: boolean = true) {
  return prisma.product.count({
    where: {
      published: published ? true : undefined,
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
}

export function getProductPrintfulIds() {
  return prisma.product.findMany({
    select: {
      external_id: true,
    },
  });
}

export function createProduct(
  {
    name,
    slug,
    description,
    categories,
    featured_img,
    gallery,
    published,
    price,
    printful_id,
    external_id,
    variants,
  },
  userId
) {
  const cats = !categories ? [] : categories.split(",");
  return prisma.product.create({
    data: {
      name,
      slug,
      description,
      featured_img,
      gallery: !gallery ? [] : gallery.split(","),
      published: published === "on" ? true : false,
      price: parseFloat(price),
      printful_id: parseInt(printful_id),
      external_id,
      variants: JSON.parse(variants),
      user: {
        connect: {
          id: userId,
        },
      },
      categories: {
        connect: cats.map((c) => ({ id: c })) || [],
      },
    },
  });
}

export function updateProduct({
  id,
  name,
  slug,
  description,
  categories,
  published,
  price,
  featured_img,
  gallery,
}) {
  const cats = !categories ? [] : categories.split(",");
  return prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      published: published === "on" ? true : false,
      price,
      featured_img,
      gallery: !gallery ? [] : gallery.split(","),
      categories: {
        set: cats.map((c) => ({ id: c })) || [],
      },
    },
  });
}

export function updateProductFiles({
  id,
  featured_img,
}: Pick<Product, "id" | "featured_img">) {
  return prisma.product.update({
    where: { id },
    data: {
      featured_img,
    },
  });
}

export function deleteProduct({ slug }: Pick<Product, "slug">) {
  return prisma.product.delete({
    where: { slug },
  });
}
