import type { User, Address } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Address } from "@prisma/client";

export function getAddress({
  id,
  userId,
}: Pick<Address, "id"> & {
  userId: User["id"];
}) {
  return prisma.address.findFirst({
    where: { id, userId },
  });
}

export function getAddressListItems({ userId }: { userId: User["id"] }) {
  return prisma.address.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createAddress({
  body,
  title,
  userId,
}: Pick<Address, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.address.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteAddress({
  id,
  userId,
}: Pick<Address, "id"> & { userId: User["id"] }) {
  return prisma.address.deleteMany({
    where: { id, userId },
  });
}
