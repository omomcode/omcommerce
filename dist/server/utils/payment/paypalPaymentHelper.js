"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.handleResponse = exports.generateAccessToken = exports.capturePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const sendmail_1 = require("../../services/sendmail");
// const { STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_ID, STRAPI_ADMIN_SANDBOX_PAYPAL_CLIENT_SECRET,STRAPI_ADMIN_PAYPAL_ENVIRONMENT } = process.env;
// const base = STRAPI_ADMIN_PAYPAL_ENVIRONMENT==='sandbox' ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
const capturePayment = async (orderID, strapi) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const credentials = await strapi.plugin("omcommerce").service("paypalsetup").find({});
    if (!credentials) {
        throw new Error("No valid paypal credentials");
    }
    const accessToken = await (0, exports.generateAccessToken)(strapi);
    const base = credentials.live === false ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
    async function iterateAsync(combinedObject) {
        try {
            for (const obj of combinedObject) {
                const { id, ...updatedObject } = obj;
                //await strapi.entityService.update("plugin::omcommerce.product", id, updatedObject)
                await strapi.plugin("omcommerce").service("product").update(id, updatedObject);
            }
            return true;
        }
        catch (e) {
            // throw new Error(e);
            // return false;
            // console.error(e);
        }
    }
    try {
        const response = await axios_1.default.post(url, null, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response && response.data && response.data.payer && response.data.purchase_units &&
            response.data.purchase_units[0] && response.data.payer.email_address && response.data.payer.name &&
            response.data.payer.name.given_name &&
            response.data.payer.name.surname && response.data.purchase_units[0].shipping &&
            response.data.purchase_units[0].shipping.address &&
            response.data.purchase_units[0].shipping.address.address_line_1 &&
            response.data.purchase_units[0].shipping.address.admin_area_2 &&
            response.data.purchase_units[0].shipping.address.country_code &&
            response.data.purchase_units[0].shipping.address.postal_code && response.data.status) {
            // const query = `populate=*&[filters][order_id][$eq]=${orderID}`
            const query = { populate: '*', filters: { order_id: { '$eq': orderID.toString() } } };
            const orderResponse = await strapi.plugin("omcommerce").service("order").find(query);
            if (!orderResponse) {
                return Promise.reject(new Error("Order data could not be fetched"));
            }
            const products = await strapi.plugin("omcommerce").service("product").find({});
            if (!products) {
                return Promise.reject(new Error("Invalid products data"));
            }
            const combinedObject = products
                .map((product) => {
                const orderItem = orderResponse[0].items.find((orderItem) => orderItem.name === product.title);
                if (orderItem) {
                    return { ...product, Quantity: product.Quantity - orderItem.quantity };
                }
                return null;
            })
                .filter((obj) => obj !== null);
            if (combinedObject) {
                combinedObject.map((prod) => {
                    if (prod.Quantity < 0) {
                        const q = prod.Quantity * (-1);
                        return Promise.reject(new Error(`We are missing ${q} x ${prod.title} so we cannot go through with the order. We apologize for the inconvenience.`));
                    }
                });
            }
            await iterateAsync(combinedObject);
            const order = orderResponse[0];
            order.email = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.payer) === null || _b === void 0 ? void 0 : _b.email_address;
            order.customer_name = (_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.payer) === null || _d === void 0 ? void 0 : _d.name) === null || _e === void 0 ? void 0 : _e.given_name;
            order.customer_surname = (_g = (_f = response.data.payer) === null || _f === void 0 ? void 0 : _f.name) === null || _g === void 0 ? void 0 : _g.surname;
            order.address_line_1 = (_k = (_j = (_h = response.data.purchase_units[0]) === null || _h === void 0 ? void 0 : _h.shipping) === null || _j === void 0 ? void 0 : _j.address) === null || _k === void 0 ? void 0 : _k.address_line_1;
            order.address_line_2 = (_o = (_m = (_l = response.data.purchase_units[0]) === null || _l === void 0 ? void 0 : _l.shipping) === null || _m === void 0 ? void 0 : _m.address) === null || _o === void 0 ? void 0 : _o.address_line_2;
            order.admin_area_1 = (_r = (_q = (_p = response.data.purchase_units[0]) === null || _p === void 0 ? void 0 : _p.shipping) === null || _q === void 0 ? void 0 : _q.address) === null || _r === void 0 ? void 0 : _r.admin_area_1;
            order.admin_area_2 = (_u = (_t = (_s = response.data.purchase_units[0]) === null || _s === void 0 ? void 0 : _s.shipping) === null || _t === void 0 ? void 0 : _t.address) === null || _u === void 0 ? void 0 : _u.admin_area_2;
            order.country_code = (_x = (_w = (_v = response.data.purchase_units[0]) === null || _v === void 0 ? void 0 : _v.shipping) === null || _w === void 0 ? void 0 : _w.address) === null || _x === void 0 ? void 0 : _x.country_code;
            order.postal_code = (_0 = (_z = (_y = response.data.purchase_units[0]) === null || _y === void 0 ? void 0 : _y.shipping) === null || _z === void 0 ? void 0 : _z.address) === null || _0 === void 0 ? void 0 : _0.postal_code;
            order.status = response.data.status;
            order.discount = "0";
            // const gmail: any = await findGmail({});
            const gmail = await strapi.plugin("omcommerce").service("gmail").find({});
            if (!gmail) {
                return Promise.reject(new Error("Sender email data invalid"));
            }
            if (order.status === "COMPLETED")
                await (0, sendmail_1.sendMail)(orderResponse[0], "this is a message", strapi, gmail);
            else
                return Promise.reject(new Error("Order could not be completed"));
            await strapi.plugin("omcommerce").service("order").update(order.id, order);
            return handleResponse(response);
        }
        else {
            return Promise.reject(new Error("Order could not be captured"));
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.capturePayment = capturePayment;
const generateAccessToken = async (strapi) => {
    try {
        const credentials = await strapi.plugin("omcommerce").service("paypalsetup").find({});
        const PAYPAL_CLIENT_ID = credentials.live === true ? credentials.live_paypal_client_id : credentials.sandbox_paypal_client_id;
        const PAYPAL_CLIENT_SECRET = credentials.live === true ? credentials.live_paypal_client_secret : credentials.sandbox_paypal_client_secret;
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
        const base = credentials.live === false ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
        const response = await axios_1.default.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = response.data;
        return data.access_token;
    }
    catch (error) {
        console.error("Failed to generate Access Token:", error);
    }
};
exports.generateAccessToken = generateAccessToken;
async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
        return response.data;
    }
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}
exports.handleResponse = handleResponse;
const createOrder = async (data, strapi) => {
    const credentials = await strapi.plugin("omcommerce").service("paypalsetup").find({});
    if (!credentials) {
        throw new Error("No valid paypal credentials");
    }
    const accessToken = await (0, exports.generateAccessToken)(strapi);
    const base = credentials.live === false ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
    const url = `${base}/v2/checkout/orders`;
    // const products = res.data;
    // const products = await findProduct({},strapi);
    if (!data.cart) {
        throw new Error("Invalid data");
    }
    const products = await strapi.plugin("omcommerce").service("product").find({});
    if (!products) {
        throw new Error("Invalid products data");
    }
    const cartItemIds = data.cart.map((item) => item.id);
    const matchingProducts = products.filter((product) => {
        return cartItemIds.includes(product.id.toString());
    });
    if (matchingProducts.length === 0) {
        throw new Error("No matching products found");
    }
    const totalAmount = matchingProducts.reduce((total, product) => {
        const cartItem = data.cart.find((item) => item.id === product.id.toString());
        const quantity = cartItem ? parseInt(cartItem.quantity, 10) : 0;
        if (product.Quantity < quantity) {
            throw new Error(`Not enough ${product.title} in stock`);
        }
        return total + (product.amount_value * quantity);
    }, 0);
    // const shippingAmount = await calculateShippingCost(strapi,{data});
    const shippingAmount = await strapi.plugin("omcommerce").service("shippingcalculator").calculate({ data });
    // if(!shippingAmount){
    //   throw new Error("No valid shipping amount data")
    // }
    // const currency = await findCurrency({},strapi);
    const currency = await strapi.plugin("omcommerce").service("currency").find({});
    if (!currency || !currency.currency) {
        throw new Error("No valid currency data");
    }
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
                items: matchingProducts.map((product) => {
                    return {
                        name: product.title,
                        description: product.description,
                        SKU: product.SKU,
                        Quantity: product.Quantity,
                        unit_amount: {
                            currency_code: currency.currency,
                            value: product.amount_value.toString()
                        },
                        quantity: data.cart.find((cartItem) => cartItem.id === product.id.toString()).quantity,
                    };
                }),
            },
        ]
    };
    const payloadJSON = JSON.stringify(payload);
    try {
        const response = await axios_1.default.post(url, payloadJSON, {
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
        };
        await strapi.plugin("omcommerce").service("order").create(postData);
        return handleResponse(response);
    }
    catch (error) {
        console.error('ErrorPayment:', error);
    }
};
exports.createOrder = createOrder;
