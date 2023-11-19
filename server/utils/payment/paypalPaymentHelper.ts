import axios from "axios";
import {sendMail} from "../../services/sendmail";

// const { STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_ID, STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_SECRET,STRAPI_ADMIN_PAYPAL_ENVIRONMENT } = process.env;
// const base = STRAPI_ADMIN_PAYPAL_ENVIRONMENT==='sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
export const capturePayment = async (orderID: string, strapi : any) => {
  const accessToken = await generateAccessToken(strapi);
  const credentials = await strapi.plugin("omcommerce").service("paypalsetup").find({});
  const base = credentials.live === false ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response && response.data) {

      // const query = `populate=*&[filters][order_id][$eq]=${orderID}`
      const query = { populate: '*', filters: { order_id: { '$eq': orderID.toString() } } }
      const orderResponse =await strapi.plugin("omcommerce").service("order").find(query);

      const order = orderResponse[0];
      order.email = response.data?.payer?.email_address;
      order.customer_name = response.data?.payer?.name?.given_name;
      order.customer_surname = response.data.payer?.name?.surname;
      order.address_line_1 = response.data.purchase_units[0]?.shipping?.address?.address_line_1;
      order.address_line_2 = response.data.purchase_units[0]?.shipping?.address?.address_line_2;
      order.admin_area_1 = response.data.purchase_units[0]?.shipping?.address?.admin_area_1;
      order.admin_area_2 = response.data.purchase_units[0]?.shipping?.address?.admin_area_2;
      order.country_code = response.data.purchase_units[0]?.shipping?.address?.country_code;
      order.postal_code = response.data.purchase_units[0]?.shipping?.address?.postal_code;
      order.status = response.data.status;
      order.discount = "0"


      // const gmail: any = await findGmail({});

      const gmail =await strapi.plugin("omcommerce").service("gmail").find({});


      if (order.status === "COMPLETED" && gmail !== undefined) await sendMail(orderResponse[0], "this is a message", strapi, gmail);

      await strapi.plugin("omcommerce").service("order").update(order.id,order);

      return handleResponse(response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
export const generateAccessToken = async (strapi : any) => {
  try {
    const credentials =await strapi.plugin("omcommerce").service("paypalsetup").find({});
    const PAYPAL_CLIENT_ID = credentials.live === true ? credentials.live_paypal_client_id : credentials.sandbox_paypal_client_id;
    const PAYPAL_CLIENT_SECRET = credentials.live === true ?credentials.live_paypal_client_secret : credentials.sandbox_paypal_client_secret;

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const base = credentials.live === false ?  "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

    const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = response.data;
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

export async function handleResponse(response : any) {
  if (response.status === 200 || response.status === 201) {
    return response.data
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

export const createOrder = async (data : any,strapi : any) => {


  const accessToken = await generateAccessToken(strapi);
  const credentials =await strapi.plugin("omcommerce").service("paypalsetup").find({});
  const base = credentials.live === false ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
  const url = `${base}/v2/checkout/orders`;

  // const products = res.data;
  // const products = await findProduct({},strapi);

  const products =await strapi.plugin("omcommerce").service("product").find({});

  const cartItemIds = data.cart.map((item: { id: any; }) => item.id);
  const matchingProducts = products.filter((product: { id: { toString: () => any; }; }) => {
    return cartItemIds.includes(product.id.toString());
  });
  const totalAmount = matchingProducts.reduce((total: number, product: { id: { toString: () => any; }; amount_value: number; }) => {
    const cartItem = data.cart.find((item: { id: any; }) => item.id === product.id.toString());
    const quantity = cartItem ? parseInt(cartItem.quantity, 10) : 0;
    return total + (product.amount_value * quantity);
  }, 0);

  // const shippingAmount = await calculateShippingCost(strapi,{data});
  const shippingAmount =await strapi.plugin("omcommerce").service("shippingcalculator").calculate({data});

  // const currency = await findCurrency({},strapi);
  const currency =await strapi.plugin("omcommerce").service("currency").find({});

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency.currency,
          value: (totalAmount + shippingAmount).toString(),
          breakdown: {
            item_total: {
              currency_code: currency.currency,
              value: totalAmount.toFixed(2).toString(),
            },
            shipping: {
              currency_code: currency.currency,
              value: typeof shippingAmount === 'number' ? shippingAmount.toFixed(2).toString() : "0.00",
            }
          }
        },
        items: matchingProducts.map((product: { title: any; description: any; SKU: any; amount_value: { toString: () => any; }; id: { toString: () => any; }; }) => {
          return {
            name: product.title,
            description: product.description,
            SKU: product.SKU,
            unit_amount: {
              currency_code: currency.currency,
              value: product.amount_value.toString()
            },
            quantity: data.cart.find((cartItem: { id: any; }) => cartItem.id === product.id.toString()).quantity,
          };
        }),
      },
    ]
  };

  const payloadJSON = JSON.stringify(payload);

  try {
    const response = await axios.post(url, payloadJSON, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const postData = {
      order_id: response.data.id,
      amount: parseFloat(payload.purchase_units[0].amount.value),
      currency: payload.purchase_units[0].amount.currency_code,
      items: payload.purchase_units[0].items,
      shipping_fee: parseFloat(payload.purchase_units[0].amount.breakdown.shipping.value),
      status: response.data.status
    }

    await strapi.plugin("omcommerce").service("order").create(postData);

    return handleResponse(response);
  } catch (error) {
    console.error('Error:', error);
  }
};
