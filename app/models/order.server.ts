import type { User, Order } from "@prisma/client";
import { prisma } from "~/db.server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export type { Order } from "@prisma/client";

export async function retrievePaymentIntent(id) {
  const payment = await stripe.paymentIntents.retrieve(id);
  //console.log(payment)
  return payment;
}

export function countOrders() {
  return prisma.order.count();
}

export function getOrders(currentPage: number = 1) {
  const perPage = 20;
  return prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: perPage,
    skip: (currentPage - 1) * perPage,
  });
}

export function getOrderByUserId(
  userId: Pick<Order, "id"> & {
    userId: User["id"];
  }
) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          description: true,
          featured_img: true,
          price: true,
          quantity: true,
          color: true,
          size: true,
        },
      },
    },
  });
}

export function getOrder(id) {
  return prisma.order.findFirst({
    where: { id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          id: true,
          name: true,
          description: true,
          featured_img: true,
          price: true,
          quantity: true,
          color: true,
          size: true,
        },
      },
    },
  });
}

export function getOrderListItems({ userId }: { userId: User["id"] }) {
  return prisma.order.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createOrder({
  body,
  title,
  userId,
}: Pick<Order, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.order.create({
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

export function deleteOrder({
  id,
  userId,
}: Pick<Order, "id"> & { userId: User["id"] }) {
  return prisma.order.deleteMany({
    where: { id, userId },
  });
}
