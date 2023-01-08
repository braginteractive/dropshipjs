import { json } from "@remix-run/react";
const headers = { "Content-Type": "application/json" };
headers["Authorization"] = `Bearer  ${process.env.PRINTFUL_API_KEY}`;

export const loader = async () => {
  //return null
  const data = { yes: "here" };
  return null;
  //    try {
  //     const res = await fetch(process.env.PRINTFUL_API_URL + "/shipping/rates", {
  //         method: "POST",
  //         headers,
  //       body: JSON.stringify({
  //         recipient: {
  //           address1: "19749 Dearborn St",
  //           city: "Chatsworth",
  //           country_code: "US",
  //           state_code: "CA",
  //           zip: 91311,
  //           phone: "string",
  //         },
  //         items: [
  //           {
  //             variant_id: "202",
  //             external_variant_id: "623b7dd92d8c56",
  //             quantity: 10,
  //             value: "2.99",
  //           },
  //         ],
  //         currency: "USD",
  //         locale: "en_US",
  //       }),
  //     });
  //        const shipping = await res.json();
  //        console.log(shipping)
  //     return shipping;
  //   } catch (error) {
  //     console.log(error);
  //    }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  const { zip } = values;

  //console.log(zip)

  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/shipping/rates", {
      method: "POST",
      headers,
      body: JSON.stringify({
        recipient: {
          address1: "19749 Dearborn St",
          city: "Chatsworth",
          country_code: "US",
          state_code: "CA",
          zip: 91311,
          phone: "string",
        },
        items: [
          {
            variant_id: "202",
            external_variant_id: "623b7dd92d8c56",
            quantity: 10,
            value: "2.99",
          },
        ],
        currency: "USD",
        locale: "en_US",
      }),
    });
    const shipping = await res.json();
    console.log(shipping);
    return shipping;
  } catch (error) {
    return json({ error: error.message });
  }
};
