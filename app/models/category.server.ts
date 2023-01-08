import type { Category } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Category } from "@prisma/client";

export function getCategory({ slug }: Pick<Category, "slug">) {
  return prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      order: true,
      featured: true,
      products: {
        select: {
          id: true,
          name: true,
          featured_img: true,
          slug: true,
        },
      },
    },
  });
}

export function getCategories(hideEmpty = false) {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    where: hideEmpty
      ? {
          products: {
            some: {},
          },
        }
      : {},
  });
}

export function createCategory({
  name,
  slug,
  description,
  image,
}: Pick<Category, "slug" | "description" | "name" | "image">) {
  return prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
    },
  });
}

export function updateCategory({
  id,
  name,
  image,
  slug,
  description,
  order,
  featured,
}: Pick<
  Category,
  "id" | "slug" | "description" | "name" | "image" | "order" | "featured"
>) {
  //console.log(order);
  return prisma.category.update({
    where: { id },
    data: {
      name,
      image,
      slug,
      description,
      order: parseFloat(order) || 0,
      featured: featured === "on" ? true : false,
    },
  });
}

export function deleteCategory({ slug }: Pick<Category, "slug">) {
  return prisma.category.delete({
    where: { slug },
  });
}

export function getProductsByCategory({ slug }: Pick<Category, "slug">) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          featured_img: true,
          price: true,
          slug: true,
          published: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
