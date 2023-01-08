import type { User } from "@prisma/client";
import { prisma } from "~/db.server";
import { createOrder } from "~/lib/printful";
import { sendOrderDetailsEmail } from "~/lib/sendgrid";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

// <---------  STRIPE -------------->
export async function createPaymentIntent(
  total,
  shippingRate,
  taxTotal,
  { id, email, first_name, last_name }
) {
  // Make values for stripe API
  const name = first_name + " " + last_name;
  const amount = Math.round(parseFloat(total) * 100);

  // creating a new Stripe customer from the submitted form data on checkout page
  const customer = await stripe.customers.create({
    email,
    name,
  });

  // Start the Stripe payment process
  // Supply the total cart amount in cents and customer ID from the call above
  // This is the total before tax and shipping
  // The final charge is done client side in StripePayment.js
  const paymentIntent = await stripe.paymentIntents
    .create({
      customer: customer.id,
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { id, total, shippingRate, taxTotal },
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  return paymentIntent.client_secret;
}

// Webhook for payments
export async function handleWebhook(request) {
  //Start Stripe Webhook
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get("stripe-signature");
  let event;
  const payload = await request.text();

  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    console.log(err);
    return new Response(err.message, {
      status: 400,
    });
  }

  // if stripe charge successful
  if (event.type == "charge.succeeded") {
    const charge = event.data.object;

    // get user from db using the customer ID when creating the paymentIntent
    const user = await prisma.user.findUnique({
      where: { id: charge.metadata.id },
      include: {
        cart: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                price: true,
                external_id: true,
                published: true,
                featured_img: true,
              },
            },
          },
        },
        addresses: {
          select: {
            type: true,
            first_name: true,
            last_name: true,
            address1: true,
            address2: true,
            city: true,
            state_code: true,
            country_code: true,
            zip: true,
          },
        },
      },
    });

    // Change from GUEST to CUSTOMER Role
    const updateUserRole = await prisma.user.update({
      where: { id: charge.metadata.id },
      data: {
        role:
          user.role != "ADMIN" && user.role === "GUEST"
            ? "CUSTOMER"
            : user.role,
      },
    });

    // Map over the published cart items to build an object to create a new order
    const publishedCartItems = user.cart.filter(
      (cartItem) => cartItem.product.published
    );
    const orderItems = publishedCartItems.map((cartItem) => {
      const orderItem = {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
        featured_img: cartItem.product.featured_img,
        external_variant_id: cartItem.external_variant_id,
      };
      return orderItem;
    });

    // Send order information to Printful
    const items = orderItems.map(({ quantity, external_variant_id }) => ({
      quantity,
      external_variant_id,
    }));
    const printfulOrder = await createOrder(user, items);

    // create a new order with the items and connect to the user
    const order = await prisma.order.create({
      data: {
        charge: charge.id,
        total: charge.metadata.total,
        tax: charge.metadata.taxTotal,
        shipping: charge.metadata.shippingRate,
        items: { create: orderItems },
        user: { connect: { id: charge.metadata.id } },
        addresses: user.addresses,
        printfulId: printfulOrder.result.id,
        printfulTotal: printfulOrder.result.costs.total,
      },
    });

    // Delete all cart items that have the userId from the successful charge
    await prisma.cartItem.deleteMany({
      where: {
        userId: charge.metadata.id,
      },
    });

    const sendOrderEmail = await sendOrderDetailsEmail(user, order);
  }

  // if (
  //  event.type == "checkout.session.completed" ||
  //   event.type == "checkout.session.async_payment_succeeded"
  //) {
  // const session = event.data.object;
  // if(session.payment_status == 'paid') {
  //   const subscription = await stripe.subscriptions.retrieve(session.subscription);
  //   await handleSubscriptionCreated(session.customer, subscription)
  // }
  // }

  // if(event.type == 'customer.subscription.updated' || event.type == 'customer.subscription.deleted') {
  //   const subscription = event.data.object;
  //   await updateSubscriptionStatus(subscription.metadata.userId, subscription.status);
  // }

  return {};
}

// export async function subscriptionActive(user: User) {
//   if(!user.stripeSubscriptionId) return false;
//   if(user.stripeSubscriptionStatus == 'canceled') return false;

//   return true;
// }

// export async function handleSubscriptionCreated(
//   stripeCustomerId: User["stripeCustomerId"],
//   subscription: any
// ) {
//   await prisma.user.update({
//     where: { id: subscription.metadata.userId },
//     data: {
//       stripeSubscriptionId: subscription.id,
//       stripeSubscriptionStatus: subscription.status,
//     }
//   })
// }

// export async function updateSubscriptionStatus(
//   id: User["id"],
//   status: String
// ) {
//   await prisma.user.update({
//     where: { id },
//     data: {
//       stripeSubscriptionStatus: status,
//     }
//   })
// }
