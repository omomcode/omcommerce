import axios from "axios";
// import {decryptData} from "./paypalPaymentSettings";
import {sendMail} from "../../services/sendmail";
import shippingcalculator from "../../services/shippingcalculator";

// const getCredentials = async () => {
//   return await paypalSetupRequests.getAllPaypalSetups();
// }

const findCredentials = async (query,strapi) => {
  return await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
}

const calculateShippingCost = async (strapiInstance,data) => {
  try {
    return await shippingcalculator({strapi: strapiInstance}).calculate(data);
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
  }
};

const findProduct = async (query,strapi) => {
  return await strapi.entityService.findMany("plugin::omcommerce.product", query);
}

const findOrder =async (query, strapi) => {
    return await strapi.entityService.findMany("plugin::omcommerce.order", query);
  }

const updateOrder = async (id, data, strapi) => {
    return await strapi.entityService.update("plugin::omcommerce.order", id, {data});
  }

const createOrderInDB = async (data, strapi) => {
  return await strapi.entityService.create("plugin::omcommerce.order", {data});
}

const findCurrency = async (query,strapi) => {
  return await strapi.entityService.findMany("plugin::omcommerce.currency", query);
}
const findGmail = async (query) => {
  return await strapi.entityService.findOne("plugin::omcommerce.gmail", query);
}


// const { STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_ID, STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_SECRET,STRAPI_ADMIN_PAYPAL_ENVIRONMENT } = process.env;
// const base = STRAPI_ADMIN_PAYPAL_ENVIRONMENT==='sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
export const capturePayment = async (orderID: string, strapi) => {
  const accessToken = await generateAccessToken();
  const base = process.env.STRAPI_ADMIN_PAYPAL_ENVIRONMENT === 'sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response && response.data) {
      console.log("rispons dejta", response.data);

      // const query = `populate=*&[filters][order_id][$eq]=${orderID}`
      const query = { populate: '*', filters: { order_id: { '$eq': orderID.toString() } } }
      const orderResponse = await findOrder(query,strapi);
      console.log("Order response");
      console.log(response.data);
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


      const gmail: any = await findGmail({});
      console.log("gmailOrder", gmail)

      if (order.status === "COMPLETED" && gmail !== undefined) await sendMail(orderResponse[0], "this is a message", strapi, gmail);

      console.log("OVO JE ORDER", order);
      console.log("OVO JE ORDER ID", order.id);
      await updateOrder(order.id, order,strapi);

      return handleResponse(response);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
const generateAccessToken = async () => {
  try {
    const credentials = await findCredentials({},strapi);
    console.log(credentials);


    // @ts-ignore
    // const STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_ID = decryptData(credentials.sandbox_paypal_client_id);
    // @ts-ignore
    // const STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_SECRET = decryptData(credentials.sandbox_paypal_client_secret);

    // const PAYPAL_CLIENT_ID = credentials.live === true ? decryptData(credentials.live_paypal_client_id) : decryptData(credentials.sandbox_paypal_client_id);
    const PAYPAL_CLIENT_ID = credentials.live === true ? credentials.live_paypal_client_id : credentials.sandbox_paypal_client_id;
    // const PAYPAL_CLIENT_SECRET = credentials.live === true ? decryptData(credentials.live_paypal_client_secret) : decryptData(credentials.sandbox_paypal_client_secret);
    const PAYPAL_CLIENT_SECRET = credentials.live === true ?credentials.live_paypal_client_secret : credentials.sandbox_paypal_client_secret;

    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const base = process.env.STRAPI_ADMIN_PAYPAL_ENVIRONMENT === 'sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

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

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.data
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

export const createOrder = async (data,strapi) => {


  const accessToken = await generateAccessToken();
  const base = process.env.STRAPI_ADMIN_PAYPAL_ENVIRONMENT === 'sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
  const url = `${base}/v2/checkout/orders`;

  // const products = res.data;
  const products = await findProduct({},strapi);

  const cartItemIds = data.cart.map(item => item.id);
  const matchingProducts = products.filter(product => cartItemIds.includes(product.id.toString()));
  console.log(matchingProducts);

  const totalAmount = matchingProducts.reduce((total, product) => {
    const cartItem = data.cart.find(item => item.id === product.id.toString());
    const quantity = cartItem ? parseInt(cartItem.quantity, 10) : 0;
    return total + (product.amount_value * quantity);
  }, 0);

  console.log("shipping amount data to be");
  console.log(data);
  const shippingAmount = await calculateShippingCost(strapi,{data});
  console.log(shippingAmount);

  const currency = await findCurrency({},strapi);


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
        items: matchingProducts.map(product => {
          return {
            name: product.title,
            description: product.description,
            SKU: product.SKU,
            unit_amount: {
              currency_code: currency.currency,
              value: product.amount_value.toString()
            },
            quantity: data.cart.find(cartItem => cartItem.id === product.id.toString()).quantity,
          };
        }),
      },
    ]
  };

  const payloadJSON = JSON.stringify(payload);
  console.log(payloadJSON);

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

    // await orderRequests.addOrder(postData);

    console.log(postData);
    await createOrderInDB(postData,strapi);

    return handleResponse(response);
  } catch (error) {
    console.error('Error:', error);
  }
};
