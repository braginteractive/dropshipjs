import { handleWebhook } from "~/models/checkout.server";

export const action = async ({ request }) => {
  try {
    return await handleWebhook(request);
  } catch (e) {
    //console.log(e)
    return e;
  }
};
