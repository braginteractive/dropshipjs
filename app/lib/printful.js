const headers = { "Content-Type": "application/json" };
headers["Authorization"] = `Bearer  ${process.env.PRINTFUL_API_KEY}`;

//https://developers.printful.com/docs/

export async function getPrintfulProducts(pagination) {
  const offset = (parseInt(pagination) - 1) * 24;
  try {
    const res = await fetch(
      process.env.PRINTFUL_API_URL +
        "/sync/products?limit=24" +
        "&offset=" +
        offset,
      {
        headers,
      }
    );
    const products = await res.json();
    //console.log(products);
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulProduct({ id }) {
  try {
    const res = await fetch(
      process.env.PRINTFUL_API_URL + "/sync/product/" + id,
      {
        headers,
      }
    );
    const product = await res.json();
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulProductStatus({ variants }) {
  try {
    const variantStatus = await Promise.all(
      variants.map((v) =>
        fetch(
          process.env.PRINTFUL_API_URL + "/products/variant/" + v.variant_id,
          {
            headers,
          }
        )
      )
    );
    const data = await Promise.all(variantStatus.map((p) => p.json()));
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulProductSizeChart(id) {
  try {
    const res = await fetch(
      process.env.PRINTFUL_API_URL + "/products/" + id + "/sizes",
      {
        headers,
      }
    );
    const sizeChart = await res.json();
    return sizeChart.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulCountries() {
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/countries", {
      headers,
    });
    const countries = await res.json();
    return countries;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulTax({
  address1,
  city,
  country_code,
  state_code,
  zip,
}) {
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/tax/rates", {
      method: "POST",
      headers,
      body: JSON.stringify({
        recipient: {
          address1,
          city,
          country_code,
          state_code,
          zip,
        },
      }),
    });
    const taxRate = await res.json();
    return taxRate;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulShipping(
  { address1, city, country_code, state_code, zip },
  items
) {
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/shipping/rates", {
      method: "POST",
      headers,
      body: JSON.stringify({
        recipient: {
          address1,
          city,
          country_code,
          state_code,
          zip,
        },
        items,
      }),
    });
    const shipping = await res.json();
    return shipping;
  } catch (error) {
    console.log(error);
  }
}

export async function createOrder({ first_name, last_name, addresses }, items) {
  //console.log(items);
  const orderData = {
    recipient: {
      name: first_name + " " + last_name,
      address1: addresses[0].address1,
      address2: addresses[0].address2,
      city: addresses[0].city,
      state_code: addresses[0].state_code,
      country_code: addresses[0].country_code,
      zip: addresses[0].zip,
    },
    items,
  };
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/orders", {
      method: "POST",
      headers,
      body: JSON.stringify(orderData),
    });
    const order = await res.json();
    //console.log(order);
    return order;
  } catch (error) {
    //console.log(error);
  }
}

export async function getPrintfulOrderDetails(id) {
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/orders/" + id, {
      headers,
    });
    const order = await res.json();
    //console.log(order);
    return order;
  } catch (error) {
    console.log(error);
  }
}

export async function getPrintfulOrders() {
  try {
    const res = await fetch(process.env.PRINTFUL_API_URL + "/orders/", {
      headers,
    });
    const orders = await res.json();
    //console.log(order);
    return orders;
  } catch (error) {
    console.log(error);
  }
}
