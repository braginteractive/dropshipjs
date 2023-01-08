import { prisma } from "~/db.server";
import { createOrder } from "~/lib/printful";
import { sendOrderDetailsEmail } from "~/lib/sendgrid";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env; // pull from environment variables

// access token is used to authenticate all REST API requests
async function generateAccessToken() {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
  ).toString("base64");
  const response = await fetch(
    `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
    {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  const data = await response.json();
  return data.access_token;
}

export async function getPayPalOrder(orderId) {
  //console.log(orderId);
  const accessToken = await generateAccessToken();

  const url = `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function processPaypalOrder(paypal) {
  // get user from db using the customer ID when creating the PayPal Order
  const user = await prisma.user.findUnique({
    where: { id: paypal.purchase_units[0].custom_id },
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

  //console.log(user);

  // Change from GUEST to CUSTOMER Role
  const updateUserRole = await prisma.user.update({
    where: { id: paypal.purchase_units[0].custom_id },
    data: {
      role:
        user.role != "ADMIN" && user.role === "GUEST" ? "CUSTOMER" : user.role,
    },
  });

  // Map over the published cart items to build an object to create a new order
  // TODO: thumbnails
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

  if (orderItems.length > 0) {
    // create a new order with the items and connect to the user
    const order = await prisma.order.create({
      data: {
        charge: paypal.id,
        total: paypal.purchase_units[0].amount.value,
        items: { create: orderItems },
        user: { connect: { id: paypal.purchase_units[0].custom_id } },
        addresses: user.addresses,
      },
    });

    // Delete all cart items that have the userId from the successful charge
    await prisma.cartItem.deleteMany({
      where: {
        userId: paypal.purchase_units[0].custom_id,
      },
    });

    // Send order information to Printful
    const items = orderItems.map(({ quantity, external_variant_id }) => ({
      quantity,
      external_variant_id,
    }));
    const submitPrintfulOrder = await createOrder(user, items);

    // update prisma order with the order ID from printful
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        printfulId: submitPrintfulOrder.result.id,
      },
    });

    // Send order details email
    const sendOrderEmail = await sendOrderDetailsEmail(user, order);
  }
}

// DOESNT WORK..
// PayPal webhooks API docs suck: https://developer.paypal.com/api/rest/webhooks/
// Cant figure out how to get a sucessful response
// If the following returned any data, the next step would be to process the order(like Stripe) in checkout.server.ts
// Instead, the PayPal order is being processed in order.jsx
export async function verifyPayPalWebhook(request) {
  const accessToken = await generateAccessToken();

  const requestBody = await request.json();
  const webhook_event = JSON.parse(requestBody);

  const auth_algo = request.headers.get("paypal-auth-algo");
  const cert_url = request.headers.get("paypal-cert-url");
  const transmission_id = request.headers.get("paypal-transmission-id");
  const transmission_sig = request.headers.get("paypal-transmission-sig");
  const transmission_time = request.headers.get("paypal-transmission-time");
  const webhook_id = process.env.PAYPAL_WEBHOOK_ID;

  const url = `${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      auth_algo,
      cert_url,
      transmission_id,
      transmission_sig,
      transmission_time,
      webhook_event,
      webhook_id,
    },
  });

  const data = await response.json();
  //console.log(data);
  return data;
}
